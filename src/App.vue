<template>
  <div id="q-app">
    <ual vi-if="appName" :appName= "appName" :chains="chains" :authenticators="authenticators"/>
    <dac-events dacId="eosdac" @notification="showNotify"></dac-events>
    <router-view />
<!--    <q-ajax-bar position="left" color="primary-light" size="3px" />-->
  </div>
</template>

<script>
import { Notify } from 'quasar'
import theme from './extensions/branding/theme'
import ual from 'components/ual/ual'
import dacEvents from 'components/dacevents/dac-events'
import { Scatter } from 'ual-scatter'
import { Ledger } from 'ual-ledger'
import { Lynx } from 'ual-lynx'
import { Wax } from 'ual-wax'
import { TokenPocket } from 'ual-token-pocket'

export default {
  name: 'App',
  components: {
    ual,
    dacEvents
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
      new Scatter(chains, { appName }),
      new Ledger(chains),
      new Lynx(chains, { appName: appName }),
      new TokenPocket(chains)/* ,
      new Wax(chains, { appName: appName }),
        new EOSIOAuth(chains, { appName, protocol: 'eosio' }) */
    ]

    if (network.blockchain === 'wax') {
      authenticators.push(new Wax(chains, { appName: appName }))
    }

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
    async showNotify (data) {
      console.log(`Notification`, data)
      let msg = data.notify
      let color = 'info'
      let avatar = ''
      let actor = data.actor
      const p = await this.$profiles.getProfiles([data.actor])
      if (p.length && p[0].profile.givenName) {
        actor = `${p[0].profile.givenName} ${p[0].profile.familyName}`
      }
      const a = await this.$profiles.getAvatars([data.actor])
      if (a.length && a[0].image) {
        avatar = a[0].image
      }

      switch (data.notify) {
        case 'MSIG_PROPOSED':
          msg = `${data.msig_data.title} Proposed by ${actor}`
          break
        case 'MSIG_APPROVED':
          msg = `${data.msig_data.title} Approved by ${actor}`
          break
        case 'MSIG_UNAPPROVED':
          msg = `${data.msig_data.title} Unapproved by ${actor}`
          color = 'warning'
          break
        case 'MSIG_CANCELLED':
          msg = `${data.msig_data.title} Cancelled by ${actor}`
          color = 'negative'
          break
        case 'MSIG_EXECUTED':
          msg = `${data.msig_data.title} Executed by ${actor}`
          color = 'positive'
          break
        case 'VOTES_CHANGED':
          msg = `${data.msig_data.title} Executed by ${actor}`
          color = 'positive'
          break
      }
      Notify.create({
        message: msg,
        timeout: 5000,
        color,
        avatar,
        position: 'top-right'
      })
    }
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
        color: 'error',
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
