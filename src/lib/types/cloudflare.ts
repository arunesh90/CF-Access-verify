export interface cloudflareCerts {
  keys: {
    kid: string
    kty: string
    alg: string
    use: string
    e  : string
    n  : string
  }[],
  public_cert: {
    kid : string
    cert: string
  }
}
