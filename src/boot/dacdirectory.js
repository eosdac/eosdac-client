
class DacDirectory {
  constructor (api, config) {
    this.ACCOUNT_AUTH = 0
    this.ACCOUNT_TREASURY = 1
    this.ACCOUNT_CUSTODIAN = 2
    this.ACCOUNT_MSIGS = 3
    this.ACCOUNT_SERVICE = 5
    this.ACCOUNT_PROPOSALS = 6
    this.ACCOUNT_ESCROW = 7
    this.ACCOUNT_VOTE_WEIGHT = 8
    this.ACCOUNT_ACTIVATION = 9
    this.ACCOUNT_REFERENDUM = 10
    this.ACCOUNT_EXTERNAL = 254
    this.ACCOUNT_OTHER = 255

    this.dacId = config.get('dacid')
    this.directoryAccount = config.get('dacdirectory')
    this.api = api
    this.dacData = null
    console.log(`DACDirectory loaded with ID ${this.dacId} on directory ${this.directoryAccount}`)
  }

  processMap (chainData) {
    const retData = []
    chainData.forEach((v) => { retData[v.key] = v.value })
    return retData
  }

  getAccount (accountType) {
    return this.dacData.accounts[accountType]
  }

  getRef (refType) {
    return this.dacData.refs[refType]
  }

  async reload () {
    const res = await this.api.rpc.get_table_rows({ code: this.directoryAccount, scope: this.directoryAccount, table: 'dacs', lower_bound: this.dacId, upper_bound: this.dacId })

    const dacData = res.rows[0]
    dacData.accounts = this.processMap(dacData.accounts)
    dacData.refs = this.processMap(dacData.refs)

    this.dacData = dacData
    console.log(`dac directory reload`, dacData)
  }
}

export default async ({ Vue, store }) => {
  console.log(`Loading dacdirectory`, Vue.prototype.$configFile.get('dacdirectory'))
  Vue.prototype.$dir = new DacDirectory(Vue.prototype.$eosApi, Vue.prototype.$configFile)
  await Vue.prototype.$dir.reload()
}
