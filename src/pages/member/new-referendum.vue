<template>
  <q-page class="q-pa-md column">
    <h4>{{$t('referendums.new_title')}}</h4>

    <div class="col q-pa-md">
      <q-input v-model="title" :label="$t('referendums.form_title')" />
    </div>

    <q-separator />

    <div class="col q-pa-md">
      <q-field borderless :label="$t('referendums.form_content')" stack-label>
        <template v-slot:control>

          <MarkdownViewer
                  :tags="[
          'h1',
          'h2',
          'h3',
          'italic',
          'bold',
          'underline',
          'strikethrough',
          'subscript',
          'superscript',
          'anchor',
          'orderedlist',
          'unorderedlist'
        ]"
                  :edit="true"
                  value=" "
                  :text="content"
                  v-on:update="updateText"
          />
        </template>
      </q-field>
    </div>

    <div class="col q-pa-md">
      <q-select label="Type" :options="type_options" v-model="type" />
    </div>

    <div class="col q-pa-md">
      <q-select label="Voting Type" :options="voting_type_options" v-model="voting_type" />
    </div>

    <div class="col q-pa-md text-warning" v-if="showPayFee">
      There is a fee of {{feeRequired.quantity}} to pay for this referendum
    </div>

    <div class="col q-pa-md text-right">
      <q-btn @click="submitReferendum" color="positive">{{$t('referendums.submit')}}</q-btn>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MarkdownViewer from 'components/ui/markdown-viewer'

export default {
  name: 'new-referendum',

  components: {
    MarkdownViewer
  },
  data () {
    return {
      title: null,
      content: null,
      type: null,
      voting_type: null,
      actions: [],
      type_options: [{ value: 1, label: 'Semi-Binding' }, { value: 2, label: 'Opinion' }],
      voting_type_options: [{ value: 0, label: 'Token' }, { value: 1, label: 'Account' }],
      feeRequired: { contract: 'eosio.token', quantity: '0.0000 EOS' },
      showPayFee: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getReferendumConfig: 'dac/getReferendumConfig',
      getSettingByName: 'user/getSettingByName'
    })
  },
  methods: {
    ...mapActions({
      fetchReferendumConfig: 'dac/fetchReferendumConfig'
    }),
    updateText (val) {
      this.content = val
    },
    async updateRequiredFee () {
      if (!this.getReferendumConfig) {
        await this.fetchReferendumConfig()
      }
      if (this.type && this.voting_type && this.getReferendumConfig.fee) {
        // const type = this.type
        const fee = this.getReferendumConfig.fee.find((f) => f.key === parseInt(this.type.value))
        console.log(fee)
        const [feeQtyStr] = fee.value.quantity.split(' ')
        if (parseFloat(feeQtyStr) > 0) {
          this.showPayFee = true
        }
        this.feeRequired = fee.value
      }
    },
    updateContent (e) {
      this.content = e.target.value
    },
    async submitReferendum () {
      const data = {
        proposer: this.getAccountName,
        referendum_id: this.$helper.randomName(),
        type: this.type.value,
        voting_type: this.voting_type.value,
        title: this.title,
        content: this.content,
        dac_id: this.$dir.dacId,
        acts: this.actions
      }
      const actions = []
      if (this.showPayFee) {
        console.log(`feeRequired`, this.feeRequired.contract)
        actions.push(
          {
            account: this.feeRequired.contract,
            name: 'transfer',
            data: {
              from: this.getAccountName,
              to: this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM),
              quantity: this.feeRequired.quantity,
              memo: `Fee for referendum "${data.title}"`
            }
          }
        )
      }
      actions.push(
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM),
          name: 'propose',
          data
        }
      )

      try {
        const result = await this.$store.dispatch('user/transact', {
          actions
        })
        if (result) {
          console.log(result)
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  mounted () {
  },
  watch: {
    type: function (val) {
      this.updateRequiredFee()
    },
    voting_type: function (val) {
      this.updateRequiredFee()
    }
  }
}
</script>

<style lang="stylus">
#editor
  min-height 300px
  max-height 800px
</style>
