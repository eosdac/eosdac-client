<template>
  <div>
    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-md-4">
        <div class="bg-bg2 rounded-borders shadow-4 q-pa-md full-height">
          <div v-if="marketData">
            <div class="text-h4"></div>
            <q-item>
              <q-item-section class="text-h5">
                {{ marketData.last }} {{marketData.currency}}/EOS
              </q-item-section>
              <q-item-section>
                  <span class="text-positive text-h5" v-if="marketData.change >= 0">{{ marketData.change * 100 }}% (24h)</span>
                  <span class="text-negative text-h5" v-else>{{ marketData.change * 100 }}% (24h)</span>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Volume</q-item-label>
                <q-item-label caption>{{ marketData.amount }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>High</q-item-label>
                <q-item-label caption>{{ marketData.high }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>Low</q-item-label>
                <q-item-label caption>{{ marketData.low }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div v-else>Loading...</div>
        </div>
      </div>
      <div class="col-xs-12 col-md-4">
        <div class="bg-bg2 rounded-borders shadow-4 q-pa-md full-height">
          <pre>{{ $dir.symbol.contract }}</pre>
          <pre>{{ $dir.symbolCode }}</pre>
        </div>
      </div>
      <div class="col-xs-12 col-md-4">
        <div class="bg-bg2 rounded-borders shadow-4 q-pa-md full-height bg-logo">
            <q-item>
              <q-item-section>
                <q-item-label>Supply</q-item-label>
                <q-item-label caption>{{ $helper.assetToLocaleNumber(tokenStats.supply) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Market Cap</q-item-label>
                <q-item-label caption>{{ $helper.toLocaleNumber(marketData.last * supplyDecimal) }} EOS</q-item-label>
              </q-item-section>
            </q-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'token-statistics',
  components: {},
  data () {
    return {
      membercounts: null,
      marketData: null,
      tokenStats: null
    }
  },
  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians',
      getAccountName: 'user/getAccountName'
    }),
    getCustNames () {
      if (this.getCustodians) {
        return this.getCustodians.map(c => {
          return c.cust_name
        })
      } else {
        return []
      }
    },
    supplyDecimal () {
      if (this.tokenStats) {
        const [qty] = this.tokenStats.supply.split(' ')
        return parseFloat(qty)
      }

      return 0
    }
  },
  async mounted () {
    this.membercounts = await this.$store.dispatch('dac/fetchMemberCounts')
    this.marketData = await this.$store.dispatch('dac/fetchTokenMarketData')
    this.tokenStats = await this.$store.dispatch('dac/fetchTokenStats')
    console.log('pricefeed', this.marketData)
    console.log('pricefeed', this.tokenStats)
    // this.price_history = await this.$store.dispatch(
    //   "dac/fetchTokenHistoryPrice"
    // );
  }
}
</script>

<style></style>
