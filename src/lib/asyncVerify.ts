import { verify } from 'jsonwebtoken'
import { CloudflarePayload } from './types/cloudflare'

export const jwtAsyncVerify = (token: string, cert: string): Promise<false | CloudflarePayload> => {
  return new Promise(async (resolve) => {
    verify(token, cert, (err, decoded) => {
      if (err) {
        return resolve(false)
      }

      resolve(decoded as CloudflarePayload)
    })
  })
}
