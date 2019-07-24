import 'dotenv/config'
import getKeys from './lib/getCerts'
import http from 'http'
import { verify as jwtVerify } from 'jsonwebtoken'
import { createProxyServer } from 'http-proxy'

getKeys().then((accessCerts) => {
  const proxyServer  = createProxyServer({toProxy: true, preserveHeaderKeyCase: true})
  const customServer = http.createServer((req, res) => {
    const { headers } = req
    const token       = headers['cf-access-jwt-assertion'] as string

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

  // Proxy WS
  customServer.on('upgrade', (req, socket, head) => {
    proxyServer.ws(req, socket, head)
  })

  const httpPort = process.env.PORT || 80
  customServer.listen(httpPort, () => {
    console.log(`Listening on port ${httpPort}`)
  })
}).catch((err) => {
  console.log('Was unable to fetch the keys for you Cloudflare login domain', err)
})
