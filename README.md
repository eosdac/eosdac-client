# eosDAC Member Client (eosdac-client)

Member client for eosDAC upgraded to quasar 1.x

## Install the dependencies
```bash
yarn install
```

### Personalization
All dac-clients use the same base to interact with the blockchain, but you need
to customize the details for the specific DAC instance. We have created a
`boilerplate` for it, which you can clone and customize. They have to go in the
`src/extensions` folder.

```bash
git clone https://github.com/eosdac/boilerplate-client-extension src/extensions
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
