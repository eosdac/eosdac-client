<template>
  <div id="q-app">
    <ual vi-if="appName" :appName= "appName" :chains="chains" :authenticators="authenticators"/>
    <router-view />
<!--    <q-ajax-bar position="left" color="primary-light" size="3px" />-->
  </div>
</template>

<script>
// import { Notify } from 'quasar'
import theme from './extensions/branding/theme'
import ual from 'components/ual/ual'
import { Scatter } from 'ual-scatter'

export default {
  name: 'App',
  components: {
    ual
  },

  data () {
    const appName = this.$dir.title
    const endpoints = this.$configFile.get('endpoints')
    const network = this.$configFile.get('network')
    const [protocol, hostPort] = endpoints[0].split('://')
    const [host, portStr] = hostPort.split(':')
    let port = parseInt(portStr)
    if (isNaN(port)) {
      port = (protocol === 'https') ? 443 : 80
    }

    const chains = [{
      chainId: network.chainId,
      rpcEndpoints: [{
        protocol,
        host,
        port
      }]
    }]
    const authenticators = [
      new Scatter(chains, { appName })/* ,
      new Ledger(chains),
      new Lynx(chains, { appName: appName }),
      new TokenPocket(chains),
      new Wax(chains, { appName: appName }),
        new EOSIOAuth(chains, { appName, protocol: 'eosio' }) */
    ]

    this.chains = chains
    this.authenticators = authenticators
    this.appName = appName

    return {
      leftDrawerOpen: true,
      loading: true,
      appName,
      chains,
      authenticators
    }
  },
  methods: {
    /* checkVersionChange () {
      // check if localstorage needs an update
      let stored_version = this.$store.getters[
        'global/getLocal_storage_version'
      ]
      let pj = require('../package.json')
      const version = pj.local_storage_version

      this.$store.commit('global/setDapp_version', pj.version) // store the app version too

      if (stored_version === null) {
        console.log(`Loaded LS v${version} for the first time`)
        Notify.create({
          message: `You're ready. Loaded Memberclient v${version}`,
          timeout: 2500,
          type: 'info',
          position: 'bottom-right'
        })
        this.$store.commit('global/setLocal_storage_version', version)
        return
      }

      if (stored_version != version) {
        console.log(`Update detected. New LS Version ${version}`)
        Notify.create({
          message: `Detected new LS version v${version}`,
          detail: `The memberclient will auto reload`,
          timeout: 4000,
          type: 'info',
          position: 'bottom-right'
        })
        setTimeout(this.clearLocalStorage, 4000)
      }
    },

    clearLocalStorage () {
      window.localStorage.clear()
      window.location.reload()
    } */
  },

  async created () {
    this.$store.dispatch('ui/loadTheme', { theme, q: this.$q })

    let test = await this.$store.dispatch('global/testEndpoint', false)

    if (test === false) {
      this.$notify({
        message: `Failed to connect to network`,
        detail: `Please reload later`,
        timeout: 4000,
        type: 'error',
        position: 'bottom-right'
      })
    }
    this.loading = true

    this.$store.dispatch('dac/initRoutine', this)
    // this.$root.$emit('helloc');
    // await this.$store.dispatch('global/connectScatter')
    await this.$store.dispatch('ual/attemptAutoLogin')
    this.loading = false
  },

  meta () {
    return {
      title: this.$t('meta.title', {
        dacName: this.$dir.title
      }),
      noscript: {
        default: this.$t('meta.noscript')
      }
    }
  },

  watch: {}
}
</script>
