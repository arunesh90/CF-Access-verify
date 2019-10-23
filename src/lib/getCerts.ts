import { cloudflareCerts } from './types/cloudflare'
import fetch from 'node-fetch'

export default async () => {
  const certsReq               = await fetch(`https://${process.env.LOGIN_DOMAIN!}/cdn-cgi/access/certs`)
  const certs: cloudflareCerts = await certsReq.json()

  console.log(`Successfully retrieved CF Access certs for ${process.env.LOGIN_DOMAIN}`)

  return certs
}
