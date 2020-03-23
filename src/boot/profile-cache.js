import axios from 'axios'

class ProfileCache {
  constructor (config) {
    this.config = config
    this.cache = new Map()
    this.default_avatar = require('../extensions/branding/images/default-avatar.png')
    this.request_queue = new Set()
    this.inflight = new Set()
    let cacheLife = 1000 * 60 * 60

    if (cacheLife) {
      setInterval(() => {
        this.cache.clear()
      }, cacheLife)
    }

    setInterval(this.processQueue.bind(this), 300)
  }

  async getProfiles (accountnames, forceReload = false) {
    if (forceReload) this.removeFromCache(accountnames)
    // reduce requested accountnames
    let profiles = accountnames.map(accountname => {
      return this.getPromise(accountname)
    })
    return Promise.all(profiles)
  }

  async getAvatars (accountnames, force_reload = false) {
    let profiles = await this.getProfiles(accountnames, force_reload)
    let avatars = accountnames.map(accountname => {
      let p = profiles.find(x => x.account === accountname)
      let img =
        p && p.profile && p.profile.image
          ? p.profile.image
          : this.default_avatar
      return { account: accountname, image: img }
    })
    return avatars
  }

  async processQueue () {
    if (this.request_queue.size) {
      const names = Array.from(this.request_queue.values())
      this.request_queue.clear()
      this.inflight = new Set(names)
      this.fetchProfiles(names)
    }
  }

  async responseWrapper (resp, accountname) {
    /*
      After response is received, filter for only `accountname` and set the cache.  All other promises will resolve
      once the cache is populated
       */
    const respData = await resp
    const profileData = respData.data.results.filter(
      a => a.account === accountname
    )[0]
    this.cache.set(accountname, profileData)
    this.inflight.delete(accountname)
    return profileData
  }

  async fetchProfiles (accountnames) {
    let url = this.config.get('dacapi')
    // let dacname = "eosdac"; //this.config.get("dacname");
    let params = { account: accountnames.join(',') }
    const header = { 'X-DAC-Name': this.config.get('dacid') }
    const resp = axios({
      method: 'get',
      url: `${url}/profile`,
      params: params,
      headers: header
    })

    const retvals = accountnames.map(accountname => {
      return this.responseWrapper(resp, accountname)
    })

    return retvals
  }

  /**
   * Returns a promise which will return the contents of the cache.
   *
   * If not in the cache then will add to the request queue and resolve once
   * that has been executed and in the cache.
   *
   * @param string accountname
   */
  async getPromise (accountname) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(accountname)) {
        resolve(this.cache.get(accountname))
      } else {
        const intervalHandler = () => {
          if (this.cache.has(accountname)) {
            resolve(this.cache.get(accountname))
          } else if (!this.inflight.has(accountname)) {
            this.request_queue.add(accountname)
          }
        }

        intervalHandler()
        const ival = setInterval(intervalHandler, 100)
        setTimeout(() => {
          if (!this.cache.has(accountname)) {
            console.error(`Timeout fetching profile for ${accountname}`)
          }
          clearInterval(ival)
        }, 10000)
      }
    })
  }

  removeFromCache (accountnames) {
    accountnames.forEach(account => this.cache.delete(account))
  }

  delete () {
    this.cache.clear()
    console.log('Profile cache emptied')
  }
}

export default ({ Vue }) => {
  Vue.prototype.$profiles = new ProfileCache(Vue.prototype.$configFile)
}
