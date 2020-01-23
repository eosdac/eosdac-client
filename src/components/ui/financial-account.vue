<template>
  <div>
    <q-card>
      <q-card-section class="bg-primary q-pa-none">
        <div class="row justify-between items-center q-px-md">
          <q-select
                  v-if="tokens"
                  :disable="tokens.length < 2"
                  borderless
                  emit-value
                  autofocus-filter
                  map-options
                  v-model="selected_token"
                  color="primary"
                  placeholder="token"
                  :options="tokens"
                  option-value="value"
                  @input="handleTokenSelection"
          />
          <span class="text-h6">{{ accountname }}</span>
          <!-- <help-btn
            :content="description"
            :title="accountname"
            size="sm"
          /> -->
        </div>
      </q-card-section>

      <q-card-section>
          <!-- {{ selected_token }} -->
          <div class="q-pa-none relative-position">
            <xspan
                    class="absolute-right q-mr-md q-mt-sm"
                    :value="$helper.assetToLocaleNumber(balance)"
            />

            <balance-timeline
                    class="q-mt-sm"
                    :responsive="true"
                    :height="230"
                    ref="balance"
                    :account="accountname"
                    :contract="selected_token.contract"
                    :symbol="selected_token.symbol"
                    :show_balance="false"
                    :legend="false"
                    @onbalance="balance = $event"
            />
        </div>
      </q-card-section>
    </q-card>
  </div>

</template>

<script>
// import { mapGetters } from 'vuex'
import balanceTimeline from 'components/ui/balance-timeline'
// import helpBtn from 'components/controls/help-btn'
import xspan from 'components/ui/xspan'

export default {
  name: 'financialAccount',
  components: {
    balanceTimeline,
    // helpBtn,
    xspan
  },
  props: {
    accountname: String,
    description: String,
    default_symbol: {
      type: String,
      default: 'EOS'
    },
    default_contract: {
      type: String,
      default: 'eosio.token'
    }
  },
  data () {
    return {
      tokens: [],
      selected_token: '',
      balance: null
    }
  },
  computed: {
  },
  methods: {
    async setTokens () {
      if (!this.accountname) return
      let tokens = []
      try {
        tokens = await this.$axios.get(
          `${this.$configFile.get(
            'dacapi'
          )}/tokens_owned?account=${this.accountname}`
        )
      } catch (e) {
        console.log(e)
      }

      if (tokens.data && tokens.data.results) {
        tokens = tokens.data.results.map(t => {
          return {
            value: { contract: t.contract, symbol: t.symbol },
            label: t.symbol
          }
        })
        this.tokens = tokens
      } else {
        this.tokens.push({
          value: {
            contract: this.default_contract,
            symbol: this.default_symbol
          },
          label: this.default_symbol
        })
      }

      this.selected_token = {
        contract: this.default_contract,
        symbol: this.default_symbol
      }
    },
    handleTokenSelection (v) {
      this.balance = null
    }
  },
  mounted () {
    this.setTokens()
  }
}
</script>
