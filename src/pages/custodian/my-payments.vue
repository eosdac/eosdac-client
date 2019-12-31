<template>
  <q-page class="q-pa-md full-width">
    <div class="row q-col-gutter-md full-width">
      <q-card class="col-sm-6">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            <q-icon :name="$configFile.icon.dactoken" />
            Pending Payments ({{ pendingpay.length }})</div>
        </q-card-section>

        <q-card-section v-if="pendingpay.length > 1">
          <div class="q-pa-md">
            <span class="text-bold">Total {{ totalPayAmount }}</span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn color="positive" label="claim" @click="claimAll" />
        </q-card-actions>

      </q-card>

      <q-card class="col-sm-6">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            <q-icon :name="$configFile.icon.systemtoken" />
            Update Requested Pay</div>
          <!-- <help-btn
            :content="
              $t('manage_candidateship.pay_description', {
                requested_pay: $helper.assetToLocaleNumber(
                  getCustodianConfig.requested_pay_max.quantity
                )
              })
            "
            title="Update Requested Pay"
            color="text1"
            size="sm"
          /> -->
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <span>Your current pay amount is set to {{ getIsCandidate.requestedpay }}</span>
            <q-item class="q-pl-none">
              <q-item-section avatar>
                <q-icon name="icon-type-2"/>
              </q-item-section>

              <q-item-section>
                <q-input
                        color="primary"
                        type="number"
                        v-model="new_requested_pay"
                        @input="$v.new_requested_pay.$touch()"
                        :error="$v.new_requested_pay.$error"
                        :stack-label="$t('manage_candidateship.requestedpay')"
                        :placeholder="
                    $t(
                      'manage_candidateship.requested_custodian_pay_placeholder',
                      {
                        system_token: $configFile.get('systemtokensymbol')
                      }
                    )
                  "
                />
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

    <!-- <debug-data :data="[{ pendingpay: pendingpay }]" /> -->
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
// import debugData from 'components/ui/debug-data'
// import helpBtn from 'components/controls/help-btn'
// import countdown from '@chenfengyuan/vue-countdown'
import { required, between } from 'vuelidate/lib/validators'
export default {
  name: 'MyPayments',
  components: {
    // debugData,
    // helpBtn,
    // countdown
  },
  data () {
    return {
      loading: false,
      loadingText: '',
      pendingpay: [],
      new_requested_pay: ''
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
      let symbol = this.pendingpay[0].quantity.split(' ')[1]
      let total = this.pendingpay.reduce((total, p) => {
        return total + this.$helper.assetToNumber(p.quantity)
      }, 0)

      return (
        this.$helper.toLocaleNumber(
          total,
          this.$configFile.get('systemtokendecimals')
        ) +
        ' ' +
        symbol
      )
    },
    verifyAndGetRequestedPay () {
      if (this.new_requested_pay >= 0) {
        return this.$helper.numberToAsset(
          this.new_requested_pay.toFixed(
            this.$configFile.get('systemtokendecimals')
          ),
          this.$configFile.get('systemtokensymbol')
        )
      }

      return `0.0000 ${this.$configFile.get('systemtokensymbol')}`
    }
  },
  methods: {
    DueDateExpired (dueDate) {
      if (dueDate === undefined) {
        return {
          expired: true
        }
      }
      let due = new Date(dueDate + '.000+00:00').getTime()
      let now = new Date().getTime()
      return {
        expired: due < now,
        milis_left: due - now
      }
    },
    async claimpay (id) {
      let actions = [
        {
          account: this.$configFile.get('custodiancontract'),
          name: 'claimpaye',
          data: {
            payid: id,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.getClaimPay()
      }
    },

    async rejectpay (id) {
      let actions = [
        {
          account: this.$configFile.get('custodiancontract'),
          name: 'rejectcuspay',
          data: {
            payid: id,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.getClaimPay()
      }
    },

    async claimAll () {
      const contract = this.$configFile.get('custodiancontract')
      let actions = this.pendingpay.slice(0, 10).map(pp => {
        return {
          account: contract,
          name: 'claimpaye',
          data: {
            payid: pp.key,
            dac_id: this.$configFile.get('dacid')
          }
        }
      })
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.getClaimPay()
      }
    },

    async updateRequestedPay () {
      this.$v.new_requested_pay.$touch()

      if (this.$v.new_requested_pay.$error) {
        alert('Requested pay amount invalid')
        return
      }

      let actions = [
        {
          account: this.$configFile.get('custodiancontract'),
          name: 'updatereqpae',
          data: {
            cand: this.getAccountName,
            requestedpay: this.verifyAndGetRequestedPay,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      console.log(actions)
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.$store.dispatch('user/fetchIsCandidate')
      }
    },

    async getClaimPay () {
      this.loading = true
      this.pendingpay = await this.$store.dispatch('user/fetchPendingPay')
      this.loading = false
    }
  },
  mounted () {
    this.getClaimPay()
  },

  validations () {
    return {
      new_requested_pay: {
        required,
        between: between(
          0.0,
          this.$helper.assetToNumber(
            this.getCustodianConfig.requested_pay_max.quantity
          )
        )
      }
    }
  }
}
</script>
