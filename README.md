# RSS Notifier

## Run this project

Run `docker-compose up --build` to start the application.

## FAQ

1. How to fix "UNABLE_TO_GET_ISSUER_CERT_LOCALLY" error

```zsh
npm config set cafile /path/to/your/certificate.pem
```

this will add cafile path to `~/.npmrc` and also we need to set `strict-ssl=false` in ~/.npmrc. 

For more info, see [here](https://elsevier.atlassian.net/wiki/spaces/TEN/pages/59535175745/SSL+encryption+Application+Development+Environment+and+Guest+OS+compatibility+requirements#Node.js%2C-npm%2C-yarn%2C-nvm).

