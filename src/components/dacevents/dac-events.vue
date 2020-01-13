<template><div></div></template>
<script>
import { mapGetters } from 'vuex'
const WebSocket = require('websocket').w3cwebsocket

export default {
  name: 'dacEvents',
  components: {},
  data () {
    return {
      ws: null
    }
  },
  computed: {
    ...mapGetters({
      getDacApi: 'global/getDacApi'
    })
  },

  methods: {
    connectWs () {
      if (this.ws) {
        console.log(`Already connected to websocket`)
        return
      }
      console.log(`Connecting to websocket at ${this.$configFile.get('dacws')}`, this.$configFile)

      const endpoint = this.$configFile.get('dacws')
      const dacId = this.$configFile.get('dacid')
      this.ws = new WebSocket(endpoint)
      this.ws.onmessage = (msg) => {
        console.log('websocket Received message', msg.data)
        const msgObj = JSON.parse(msg.data)
        this.$emit(msgObj.type, msgObj.data)
      }
      this.ws.onopen = () => {
        console.log(`Websocket opened to ${endpoint}`)
        this.ws.send(JSON.stringify({ type: 'register', data: { dac_id: dacId } }))
        console.log(`Sent register message for b ${dacId}`)
      }
    },
    async disconnectWs () {
      if (this.ws) {
        console.log(`Disconnecting websocket`)

        await this.ws.close()
        // this.ws.onopen = null
        // this.ws.onmessage = null
        this.ws = null
      }
    }
  },

  async mounted () {
    this.connectWs()
  },

  async beforeDestroy () {
    this.disconnectWs()
  }
}
</script>
