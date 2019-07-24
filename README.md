<h1 align="center">Cloudflare Access Verification Proxy</h1>
<p align="center">
  <img src="https://img.shields.io/github/languages/top/arunesh90/CF-Access-verify.svg" />
  <img src="https://img.shields.io/github/license/arunesh90/CF-Access-verify.svg" />
  <img src="https://img.shields.io/docker/cloud/automated/arunesh90/cf-access-verify.svg" />
  <img src="https://img.shields.io/docker/cloud/build/arunesh90/cf-access-verify.svg" />
  <img src="https://images.microbadger.com/badges/image/arunesh90/cf-access-verify.svg" />
</p>

> Simple reverse proxy that verifies all requests are done through Cloudflare Access and makes sure no unauthenticated users can access your application

## Install & Usage

#### Environment variables: 
* `TARGET_URL`: The target url for the application you want to use/proxy
* `LOGIN_DOMAIN`: Your cloudflare login domain. You can find it in the Access tab
* `PORT` (optional): For overriding the default port (80)


### Docker
```sh
docker pull arunesh90/cf-access-verify

docker create arunesh90/cf-access-verify \
  -e TARGET_URL="http://127.0.0.1:9000" \
  -e LOGIN_DOMAIN="example.cloudflareaccess.com" \
  -p 80:80
```

## Author

👤 **Arunesh**

* Twitter: [@arunesh90](https://twitter.com/arunesh90)
* Github: [@arunesh90](https://github.com/arunesh90)
* Discord: Pepe#9999

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_