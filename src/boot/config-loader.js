require('../assets/icon-fonts/eosdac-iconfont-v1-9/styles.css')
require('../assets/icon-fonts/extended_material_icons/css/materialdesignicons.css')
import theme from '../extensions/branding/theme'
import network from '../extensions/statics/config/network'
import iconmap from '../extensions/statics/config/iconmap'

function styledConsoleLog () {
  let argArray = []
  if (arguments.length) {
    const startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi
    const endTagRe = /<\/span>/gi
    let reResultArray
    argArray.push(
      arguments[0].replace(startTagRe, '%c').replace(endTagRe, '%c')
    )
    while ((reResultArray = startTagRe.exec(arguments[0]))) {
      argArray.push(reResultArray[2])
      argArray.push('')
    }
    for (var j = 1; j < arguments.length; j++) {
      argArray.push(arguments[j])
    }
  }
  console.log.apply(console, argArray)
}

class ConfigLoader {
  constructor () {
    this.configFile = network
    this.icon = iconmap
    this.theme = theme

    styledConsoleLog(
      `<span style="color:white;background-color:hsl(268, 87%, 53%); font-size:21px; padding:5px;">Welcome To the ${this.get(
        'dacname'
      )} Member Client </span><span style="color:black; font-size:12px;">Pasting code in the console can be dangerous </span>`
    )
  }

  get (configquery) {
    switch (configquery) {
      case 'network':
        return this.configFile.network
      case 'eosioendpoints':
        const network = this.configFile.network
        return [`${network.protocol}://${network.host}:${network.port}`]
      case 'theme_images':
        return this.theme.images
      case 'dacname':
        return this.configFile.dacName
      case 'dacdirectory':
        return this.configFile.accounts.directory
      case 'dacid':
        return this.configFile.dacId
      case 'defaultnode':
        return this.configFile.api.default_eos_node
      case 'tokencontract':
        return this.configFile.dac_token.contract
      case 'tokendecimals':
        return this.configFile.dac_token.precision
      case 'dactokensymbol':
        return this.configFile.dac_token.symbol
      case 'marketapi':
        return this.configFile.contracts.token.market_api
      case 'custodiancontract':
        return this.configFile.contracts.custodian.name
      case 'systemtokensymbol':
        return this.configFile.contracts.system_token.symbol
      case 'systemtokendecimals':
        return this.configFile.system_token.precision
      case 'systemtokencontract':
        return this.configFile.system_token.contract
      case 'systemmsigcontract':
        return this.configFile.contracts.system_msig.name
      case 'botcontract':
        return this.configFile.contracts.bot.name
      case 'explorer':
        return this.configFile.external.explorer.replace(/\/+$/, '')
      case 'external':
        return this.configFile.external
      case 'dacapi':
        return this.configFile.api.dac_api.replace(/\/+$/, '')
      case 'wpcontract':
        return this.configFile.contracts.wpproposal.name
      case 'referendumcontract':
        return this.configFile.contracts.referendum.name
      case 'financialaccounts':
        return this.configFile.financial_page_graphs
      default:
        return `***${configquery} not yet subscribed in config-loader***`
    }
  }

  setConfig (conf) {
    this.configFile = conf
  }
}

export default ({ Vue, store }) => {
  let config = new ConfigLoader()
  store.commit('global/setNode', config.get('defaultnode'))
  store.commit('global/setNetwork', config.get('network'))

  Vue.prototype.$configFile = config
}
