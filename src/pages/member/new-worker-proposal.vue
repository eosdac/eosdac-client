<template>
  <q-page class="q-pa-md">
    <!-- content -->

    <div class="bg-bg1 round-borders shadow-4 q-pa-md bg-logo">
      <div class="text-h4">Submit Worker Proposal</div>
      <div class="q-mb-md text-text2">
        Please fill in the form to explain your worker proposal.
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-lg-8">
            <q-input
                    :error="$v.wp_data.title.$error"
                    error-label="A title is required"
              type="text"
              label="Title"
              color="primary"
              v-model="wp_data.title"
            />
        </div>
        <div class="col-xs-12 col-lg-4">
            <q-select
                    :error="$v.wp_data.category.$error"
                    error-label="Please select a category"
              color="primary"
              v-model="wp_data.category"
              label="Category"
              :options="getWpCategoriesOptions"
            />
        </div>
        <div class="col-xs-12 col-lg-6">

          <asset-input :allowed="allowed_currencies" label="Pay Amount" v-model="wp_data.pay_amount" />

        </div>
        <div class="col-xs-12 col-lg-6">
          <q-input
                  class="full-width"
                  type="text"
                  label="Arbitrator"
                  color="primary"
                  v-model="wp_data.arbitrator" />
        </div>
      </div>

      <div class="q-caption q-mb-xs q-mt-md">Description</div>
      <MarkdownViewer
        :edit="true"
        value=" "
        :text="wp_data.summary"
        v-on:update="updateText"
      />

      <div class="row justify-end q-mt-md">
        <q-btn
          label="submit"
          color="primary"
          @click="submitProposal"
          class="animate-pop"
        />
      </div>
    </div>

    <!--<debug-data
      :data="[
        {
          wp_data: wp_data
        }
      ]"
    />-->
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
// import debugData from 'components/ui/debug-data'
import MarkdownViewer from 'components/ui/markdown-viewer'
import AssetInput from 'components/ui/asset-input'
// import helpBtn from 'components/controls/help-btn'
import { required } from 'vuelidate/lib/validators'
import { isEosName } from '../../modules/validators.js'

export default {
  name: 'newWorkerProposal',

  components: {
    // helpBtn,
    MarkdownViewer,
    AssetInput
    // debugData
  },
  data () {
    return {
      allowed_currencies: [
        {
          symbol: this.$configFile.get('systemtokensymbol'),
          contract: this.$configFile.get('systemtokencontract'),
          precision: 4
        },
        {
          symbol: this.$configFile.get('dactokensymbol'),
          contract: this.$configFile.get('tokencontract'),
          precision: 4
        }
      ],
      wp_data: {
        title: '',
        summary: '',
        arbitrator: '',
        pay_amount: null,
        category: '',
        symbol: this.$configFile.get('systemtokensymbol')
      }
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getSettingByName: 'user/getSettingByName',
      getWpCategories: 'dac/getWpCategories'
    }),
    getWpCategoriesOptions: function () {
      return this.getWpCategories.map(wpc => {
        wpc.label = this.$t(wpc.label)
        return wpc
      })
    }
  },
  methods: {
    updateText (val) {
      this.wp_data.summary = val
    },
    async submitProposal () {
      this.$v.wp_data.$touch()

      if (this.$v.wp_data.$error) {
        this.$q.notify('Please review fields again.')
        return
      }
      const extendedAsset = {
        quantity: `${this.wp_data.pay_amount.quantity} ${this.wp_data.pay_amount.symbol}`,
        contract: this.wp_data.pay_amount.contract
      }
      let actions = [
        {
          account: this.$configFile.get('wpcontract'),
          name: 'createprop',
          data: {
            proposer: this.getAccountName,
            title: this.wp_data.title,
            summary: this.wp_data.summary,
            arbitrator: this.wp_data.arbitrator,
            pay_amount: extendedAsset,
            content_hash: '00000000000000000000000000000000',
            id: this.$helper.randomIntFromInterval(1, 999999999999999999),
            category: this.wp_data.category,
            dac_id: this.$dir.dacId
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        // this.$store.commit('user/setIsCandidate', false );
        console.log(result)
      }
    }
  },

  validations: {
    wp_data: {
      arbitrator: { required, isEosName },
      title: { required },
      pay_amount: {
        required
      },
      category: { required }
    }
  }
}
</script>
