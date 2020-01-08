<template>
  <q-page class="q-pa-md full-width">
    <div class="row q-col-gutter-md">
      <div class="col-sm-6">
        <q-card v-if="!loading">
          <q-card-section class="bg-primary q-pa-xs">
            <q-item>
              <q-item-section avatar>
                <q-icon :name="$configFile.icon.dactoken" />
              </q-item-section>
              <q-item-section class="text-h6">
                {{$t('mypayments.pending_payments')}} ({{ pendingpay.length }})
              </q-item-section>
            </q-item>

          </q-card-section>

          <q-card-section v-if="pendingpay.length">
            <div class="q-pa-md">
              <span class="text-bold">{{$t('mypayments.total')}} {{ totalPayAmount }}</span>
            </div>
          </q-card-section>
          <q-card-section v-else>
            <div class="q-pa-md">
              {{$t('mypayments.no_payments')}}
            </div>
          </q-card-section>

          <q-card-actions align="right" v-if="pendingpay.length">
            <q-btn color="positive" :label="$t('mypayments.claim')" @click="claimAll" />
          </q-card-actions>

        </q-card>
      </div>
      <div class="col-sm-6">
        <q-card>

          <q-card-section class="bg-primary q-pa-xs">
            <q-item>
              <q-item-section avatar>
                <q-icon :name="$configFile.icon.systemtoken" />
              </q-item-section>
              <q-item-section class="text-h6">
                {{$t('mypayments.update_requested_pay')}}
              </q-item-section>
            </q-item>

          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <div>{{$t('mypayments.your_current_pay', { currentpay: getIsCandidate.requestedpay })}}</div>
              <div class="text-negative" v-if="requestedPayInvalid"><strong>{{$t('mypayments.pay_invalid')}}</strong></div>
              <q-item class="q-pl-none">
                <q-item-section avatar>
                  <q-icon name="icon-type-2"/>
                </q-item-section>

                <q-item-section>
                  <asset-input :allowed="allowed" v-model="newRequestedPay" />
                </q-item-section>
              </q-item>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
                    :label="$t('default.update')"
                    @click="updateRequestedPay"
                    color="positive"
            />
          </q-card-actions>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import AssetInput from '../../components/ui/asset-input'
export default {
  name: 'MyPayments',
  components: {
    AssetInput
  },
  data () {
    const [precisionStr, symbol] = this.$dir.symbol.symbol.split(',')
    const precision = parseInt(precisionStr)

    return {
      loading: false,
      loadingText: '',
      pendingpay: [],
      newRequestedPay: null,
      requestedPayInvalid: false,
      dacToken: { symbol, precision, contract: this.$dir.symbol.contract, value: 0 },
      allowed: []
    }
  },
  computed: {
    ...mapGetters({
      getCustodianConfig: 'dac/getCustodianConfig',
      getAccountName: 'user/getAccountName',
      getIsCandidate: 'user/getIsCandidate'
    }),

    totalPayAmount () {
      if (!this.pendingpay.length) return 0
      const symbol = this.pendingpay[0].quantity.quantity.split(' ')[1]
      const total = this.pendingpay.reduce((total, p) => {
        return total + this.$helper.assetToNumber(p.quantity.quantity)
      }, 0)

      return (
        this.$helper.toLocaleNumber(
          total,
          this.$configFile.get('systemtokendecimals')
        ) +
        ' ' +
        symbol
      )
    }
  },
  methods: {
    DueDateExpired (dueDate) {
      if (dueDate === undefined) {
        return {
          expired: true
        }
      }
      const due = new Date(dueDate + '.000+00:00').getTime()
      const now = new Date().getTime()
      return {
        expired: due < now,
        milis_left: due - now
      }
    },
    async claimpay (id) {
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'claimpaye',
          data: {
            payid: id,
            dac_id: this.$dir.dacId
          }
        }
      ]
      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.getClaimPay()
      }
    },

    async rejectpay (id) {
      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'rejectcuspay',
          data: {
            payid: id,
            dac_id: this.$dir.dacId
          }
        }
      ]
      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.getClaimPay()
      }
    },

    async claimAll () {
      const contract = this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN)
      const actions = this.pendingpay.slice(0, 10).map(pp => {
        return {
          account: contract,
          name: 'claimpaye',
          data: {
            payid: pp.key,
            dac_id: this.$dir.dacId
          }
        }
      })
      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.getClaimPay()
      }
    },

    async updateRequestedPay () {
      this.$v.newRequestedPay.$touch()

      if (this.$v.newRequestedPay.$error) {
        alert('Requested pay amount invalid')
        return
      }

      const actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'updatereqpae',
          data: {
            cand: this.getAccountName,
            requestedpay: this.newRequestedPay.quantity,
            dac_id: this.$dir.dacId
          }
        }
      ]
      console.log(actions)
      const result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.$store.dispatch('user/fetchIsCandidate')
      }
    },

    async getClaimPay () {
      this.loading = true
      this.pendingpay = await this.$store.dispatch('user/fetchPendingPay', this.getAccountName)
      console.log('pendingpay', this.pendingpay)
      this.loading = false
    },

    splitAsset (asset) {
      console.log(`Split ${asset.quantity}`, asset)
      const [qtyStr, symbolStr] = asset.quantity.split(' ')
      const [, precisionStr] = qtyStr.split('.')
      return {
        contract: asset.contract,
        symbol: symbolStr,
        precision: precisionStr.length,
        quantity: 0
      }
    }
  },
  mounted () {
    this.getClaimPay()
    this.newRequestedPay = this.getCustodianConfig.requested_pay_max
    this.allowed = [this.splitAsset(this.getCustodianConfig.requested_pay_max)]
    const [, newRequestedPaySymbol] = this.newRequestedPay.quantity.split(' ')
    const currentPay = this.getIsCandidate.requestedpay
    const [amountStr, symbol] = currentPay.split(' ')
    if (symbol !== newRequestedPaySymbol) {
      console.log(`${symbol} !== ${newRequestedPaySymbol} `, amountStr)
      this.requestedPayInvalid = true
      this.newRequestedPay.quantity = `0.0000 ${newRequestedPaySymbol}`
    }
    console.log(currentPay, this.newRequestedPay)
  },

  validations () {
    return {
      newRequestedPay: {
        required/* ,
        between: between(
          0.0,
          this.$helper.assetToNumber(
            this.getCustodianConfig.requested_pay_max.quantity
          )
        ) */
      }
    }
  }
}
</script>
