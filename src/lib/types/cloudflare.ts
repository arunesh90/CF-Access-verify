interface CloudflarePublicCert {
  kid : string
  cert: string
}

export interface CloudflareCerts {
  keys: {
    kid: string
    kty: string
    alg: string
    use: string
    e  : string
    n  : string
  }[]
  public_cert : CloudflarePublicCert
  public_certs: CloudflarePublicCert[]
}

export interface CloudflarePayload {
  identity_nonce: string
  email         : string
  type          : string
  aud           : string[]
  exp           : number
  iat           : number
  nbf           : number
  iss           : string
  sub           : string
}
