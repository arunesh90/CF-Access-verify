import 'dotenv/config'
import getKeys from './lib/getCerts'
import http from 'http'
import { createProxyServer, createServer } from 'http-proxy'
import morgan from 'morgan'
import cookie from 'cookie'
import { jwtAsyncVerify } from './lib/asyncVerify'

const run = async () => {
  let accessCerts = await getKeys()

  const proxyServer  = createProxyServer({ws: true, toProxy: true, preserveHeaderKeyCase: true});
  const wsServer     = createServer({target: `ws://${process.env.TARGET_URL}`, ws: true})
  const logger       = morgan('combined')
  const customServer = http.createServer((req, res) => {
    // @ts-ignore
    logger(req, res, async () => {
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
  
      const jwtChecks   = await Promise.all(accessCerts.public_certs.map(publicCert => jwtAsyncVerify(token, publicCert.cert)))
      const passedCheck = jwtChecks.find(jwtPayload => jwtPayload && jwtPayload.iss === `https://${process.env.LOGIN_DOMAIN!}`)

      if (passedCheck) {
        proxyServer.web(req, res, {
          target: `http://${process.env.TARGET_URL}`
        })

        return
      }

      res.writeHead(403, 'Invalid CF Access token.')
      res.end()
    })
  })

  // Proxy WS
  customServer.on('upgrade', (req, socket, head) => {
    wsServer.ws(req, socket, head);
  })

  const httpPort = process.env.PORT || 80
  customServer.listen({host: process.env.LISTEN, port: httpPort}, () => {
    console.log(`Listening on port ${httpPort}`)
  })

  // Regularly refresh access certs every hour
  setInterval(async () => {
    accessCerts = await getKeys()
  }, 1000 * 60 * 60)
}

run()
