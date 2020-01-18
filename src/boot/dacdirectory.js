
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

    this.REF_HOMEPAGE = 0
    this.REF_LOGO_URL = 1
    this.REF_DESCRIPTION = 2
    this.REF_LOGO_NOTEXT_URL = 3
    this.REF_BACKGROUND_URL = 4
    this.REF_COLORS = 5
    this.REF_CLIENT_EXTENSION = 6
    this.REF_FAVICON_URL = 7
    this.REF_DAC_CURRENCY_URL = 8
    this.REF_SYSTEM_CURRENCY_URL = 9
    this.REF_DISCORD_URL = 10
    this.REF_TELEGRAM_URL = 11

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

  set symbol (symbol) {
    throw new Error('Cannot set symbol')
  }
  set active (active) {
    throw new Error('Cannot set active')
  }
  set title (title) {
    throw new Error('Cannot set title')
  }

  get symbol () {
    return this.dacData.symbol
  }

  get symbolCode () {
    const [, code] = this.dacData.symbol.symbol.split(',')
    return code
  }

  get symbolPrecision () {
    const [precisionStr] = this.dacData.symbol.symbol.split(',')
    return parseInt(precisionStr)
  }

  get state () {
    return this.dacData.dac_state
  }

  get title () {
    return this.dacData.title
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
