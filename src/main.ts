import 'dotenv/config'
import getKeys from './lib/getCerts'
import http from 'http'
import { verify as jwtVerify } from 'jsonwebtoken'
import { createProxyServer } from 'http-proxy'
import morgan from 'morgan'
import cookie from 'cookie'

const run = async () => {
  let accessCerts = await getKeys()

  const proxyServer  = createProxyServer({toProxy: true, preserveHeaderKeyCase: true})
  const logger       = morgan('combined')
  const customServer = http.createServer((req, res) => {
    // @ts-ignore
    logger(req, res, () => {
      const { headers } = req

      const cookieHeader = req.headers['cookie']
      const cookieToken  = cookieHeader ? cookie.parse(cookieHeader)['CF_Authorization'] : null
      const headerToken  = headers['cf-access-jwt-assertion'] as string
      const token        = headerToken || cookieToken
  
      if (!token) {
        res.writeHead(403, 'Missing CF Access token.')
        res.end()
        return
      }
  
      try {
        jwtVerify(token, accessCerts.public_cert.cert)
      } catch (_) {
        res.writeHead(403, 'Invalid CF Access token.')
        res.end()
        return
      }
  
      proxyServer.web(req, res, {
        target: process.env.TARGET_URL!
      })
    })
  })

  // Proxy WS
  customServer.on('upgrade', (req, socket, head) => {
    proxyServer.ws(req, socket, head)
  })

  const httpPort = process.env.PORT || 80
  customServer.listen(httpPort, () => {
    console.log(`Listening on port ${httpPort}`)
  })

  // Regularly refresh access certs every hour
  setInterval(async () => {
    accessCerts = await getKeys()
  }, 1000 * 60 * 60)
}

run()
