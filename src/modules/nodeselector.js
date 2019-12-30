const request = require('request')

class NodeSelector {
  constructor (nodesApiUrl) {
    // configs
    this.nodes_api_url = nodesApiUrl
    this.benchmark_url = '/v1/chain/get_info'
    this.exclude_nodes = ['eoscochain', 'atticlab', 'eospacex'] // blacklist nodes
  }

  async getFastestNode () {
    var self = this
    // only get nodes if not already done
    if (this.nodelist === undefined) {
      try {
        await this.getNodes({ https_only: true })
      } catch (e) {} // no need to catch the error here
    }
    // return false if node api error
    if (!this.nodelist || !this.nodelist.length) {
      console.log('error getting node list from api server!')
      return false
    }

    return new Promise(async function (resolve, reject) {
      let flag = true
      while (flag) {
        try {
          let winner = await self.startRace()
          if (winner.ms !== 'error') {
            flag = false
            resolve(winner) // valid winner
          } else {
            // node errored so exclude from next race
            self.nodelist = self.nodelist.filter(node => {
              return node !== winner.node
            })
          }
        } catch (e) {
          console.log(e)
        }
      }
    })
  }

  getNodes (config = { https_only: false }) {
    var self = this
    return new Promise(function (resolve, reject) {
      request(
        {
          url: self.nodes_api_url,
          json: true
        },
        function (err, response, body) {
          if (err || response.statusCode !== 200) {
            self.nodelist = false
            reject(false)
          } else {
            self.nodelist = body
            if (config.https_only) {
              self.nodelist = body.filter(node => node.startsWith('https'))
              self.nodelist = self.nodelist.map(node => {
                node = node.substr(-1) === '/' ? node.slice(0, -1) : node
                return node
              })
              if (self.exclude_nodes.length) {
                // filter out excluded nodes
                // console.log('node list', self.nodelist)
                self.nodelist = self.nodelist.filter(n => {
                  for (var i = 0; i < self.exclude_nodes.length; i++) {
                    if (n.indexOf(self.exclude_nodes[i]) > -1) {
                      return false
                    }
                  }
                  return true
                })
                // console.log('node list excluded', self.nodelist)
              }
            }
            resolve(self.nodelist)
          }
        }
      )
    })
  }

  startRace () {
    console.log(`start race with ${this.nodelist.length} nodes...`)
    if (this.nodelist.length < 1) {
      console.log('There are no nodes left to race!')
      return false
    }
    this.proms = []
    this.nodelist.forEach((node, index) => {
      node = node.substr(-1) === '/' ? node.slice(0, -1) : node
      let p = this.racerRequest(node)
        .then(res => res)
        .catch(e => e)
      this.proms.push(p)
    })
    return Promise.race(this.proms).then(function (winner) {
      return winner
    })
  }

  racerRequest (nodeUrl) {
    var self = this
    let url = nodeUrl
    return new Promise(function (resolve, reject) {
      request(
        {
          method: 'POST',
          url: url + self.benchmark_url,
          time: true,
          rejectUnauthorized: false
        },
        function (err, response) {
          if (err) {
            reject({ node: nodeUrl, ms: 'error' })
          } else {
            resolve({ node: nodeUrl, ms: response.elapsedTime })
          }
        }
      )
    })
  }
} // end class
export default NodeSelector
/* module.exports = {
    NodeSelector
}; */
