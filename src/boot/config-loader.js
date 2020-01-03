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
      case 'endpoints':
        return this.configFile.endpoints
      case 'theme_images':
        return this.theme.images
      case 'dacdirectory':
        return this.configFile.accounts.directory
      case 'dacid':
        return this.configFile.dacId
      case 'pricefeed':
        return this.configFile.pricefeed
      case 'systemtokensymbol':
        return this.configFile.system_token.symbol
      case 'systemtokendecimals':
        return this.configFile.system_token.precision
      case 'systemtokencontract':
        return this.configFile.system_token.contract
      case 'systemmsigcontract':
        return this.configFile.contracts.system_msig.name
      case 'explorer':
        return this.configFile.external.explorer.replace(/\/+$/, '')
      case 'external':
        return this.configFile.external
      case 'dacapi':
        return this.configFile.api.dac_api.replace(/\/+$/, '')
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

  const endpoints = config.get('endpoints')
  const u = new URL(endpoints[0])
  const protocol = u.protocol.substring(0, u.protocol.indexOf(':'))
  let port = u.port
  if (!port) {
    port = (protocol === 'http') ? 80 : 443
  }

  const network = { ...config.get('network'), host: u.host, protocol, port }
  console.log('setting network', network)
  store.commit('global/setNetwork', network)

  Vue.prototype.$configFile = config
}
