<template>
      <div class="row q-col-gutter-xs">
        <div class="col-xs-12">
          <q-input
                  v-model="form.title"
                  @input="$v.form.title.$touch()"
                  :label="$t('msig_transfer.form_title')"
                   :error="$v.form.title.$error"
                   :error-label="$t('msig_transfer.form_title_error')"
          />

        </div>

        <div class="col-xs-12">
          <q-input
                  type="textarea"
                  v-model="form.description"
                  :label="$t('msig_transfer.form_description')"
                  :error="$v.form.description.$error"
                  :error-message="$t('msig_transfer.form_description_error')"
                  @input="$v.form.description.$touch()"
          />
        </div>

        <div class="col-xs-12 col-lg-6">
          <q-input v-model.trim="form.from" color="primary"
                  :label="$t('msig_transfer.form_from')"
                   :error="$v.form.from.$error"
                  :error-message="$t('msig_transfer.form_from_error')"
                   @blur="setTokens"
                    />
        </div>

        <div class="col-xs-12 col-lg-6">
          <div>
            <q-input
                    v-model.trim="form.to"
                    @input="$v.form.to.$touch()"
                  :label="$t('msig_transfer.form_to')"
                    :error="$v.form.to.$error"
                  :error-message="$t('msig_transfer.form_to_error')"
            />
          </div>
        </div>

        <div class="col-xs-12 col-lg-6">
          <asset-input v-model="form.asset" :allowed="tokens" :label="$t('msig_transfer.form_quantity')" />
        </div>

        <div class="col-xs-12 col-lg-6">
          <q-input
                  v-model.trim="form.memo"
                  bottom-slots
                  class="no-padding"
                  :label="$t('msig_transfer.form_memo')"
                  :error="$v.form.memo.$error"
                  :error-message="$t('msig_transfer.form_memo_error')"
                   />
            <!-- <q-field
                    borderless
                    label="Memo"
                    class="no-padding q-mb-sm"
                    :error="$v.form.memo.$error"
                    error-label="Memo can't be longer then 255 chars."
            > -->
        </div>

        <div class="col-xs-12">
          <div class="row justify-end">
            <q-btn color="warning" label="clear" @click="clearForm" />
            <q-btn color="primary" :label="$t('msig_transfer.form_add')" @click="processInputs" />
          </div>
        </div>
      </div>

</template>

<script>
import { mapGetters } from 'vuex'
// import { debounce } from 'quasar'
import { required, maxLength } from 'vuelidate/lib/validators'
import { isEosName } from '../../modules/validators.js'
import AssetInput from '../ui/asset-input'
export default {
  name: 'msigTransfer',
  components: {
    AssetInput
  },
  props: {
    symbol: {
      type: String,
      default: 'EOS'
    },
    decimals: {
      type: Number,
      default: 4
    },
    from_accounts: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      form: {
        from: this.$dir.getAccount(this.$dir.ACCOUNT_TREASURY),
        to: '',
        asset: {
          contract: 'eosio.token',
          quantity: '0.0000 EOS'
        },
        memo: '',
        title: '',
        description: ''
      },
      selected_token: '',
      tokens: [],
      tokens_loading: false,
      default_assets: [
        {
          symbol: this.$configFile.get('systemtokensymbol'),
          precision: 4,
          contract: this.$configFile.get('systemtokencontract')
        },
        {
          symbol: this.$dir.symbolCode,
          precision: this.$dir.symbolPrecision,
          contract: this.$dir.symbol.contract
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getAccount: 'user/getAccount',
      getDacApi: 'global/getDacApi'
    }),
    getSelectedToken () {
      return this.selected_token
    }
  },
  methods: {
    updateFormDescription (val) {
      this.form.description = val
    },
    processInputs () {
      this.$v.$touch()
      if (this.$v.$error) {
        console.error(`form has errors`, this.$v)
        return
      }
      this.$emit('onsubmit', this.form)
      this.clearForm()
    },
    clearForm () {
      this.form = {
        from: this.$dir.getAccount(this.$dir.ACCOUNT_TREASURY),
        to: '',
        asset: {
          contract: 'eosio.token',
          quantity: '0.0000 EOS'
        },
        memo: '',
        title: '',
        description: ''
      }
      this.$v.$reset()
      this.edit_flag = false
    },
    setFormFieldsEdit (data) {
      // make clone
      let cloned = JSON.parse(JSON.stringify(data))
      this.form = cloned
    },

    async suggestAccounts_to (terms, done) {
      let accounts = await this.getDacApi.eos.get_table_rows({
        json: true,
        code: 'eosio',
        scope: 'eosio',
        table: 'voters',
        lower_bound: terms,
        limit: 7
      })
      accounts = accounts.rows.map(a => {
        return { label: a.owner, value: a.owner, icon: 'person' }
      })
      done(accounts)
    },

    async setTokens () {
      if (!this.form.from) {
        return
      }

      this.tokens_loading = true
      let tokens
      try {
        tokens = await this.$axios.get(
          `${this.$configFile.get('dacapi')}/tokens_owned?account=${this.form.from}`
        )
        tokens = tokens.data.results
      } catch (e) {
        console.log(e)
        tokens = []
      }

      if (!tokens.length) {
        tokens = JSON.parse(JSON.stringify(this.default_assets))
      }

      this.tokens = tokens

      this.selected_token = this.tokens.find(
        t =>
          t.symbol === this.form.asset.symbol &&
          t.contract === this.form.asset.contract
      )
      this.tokens_loading = false
    },
    handleTokenSelection (v) {
      this.selected_token = v
      Object.assign(this.form.asset, v)
    }
  },
  mounted () {
    this.setTokens()
  },
  watch: {
    'form.from': function () {
      // this.setTokens()
    }
  },

  validations () {
    return {
      form: {
        from: { required, isEosName },
        to: { required, isEosName },
        memo: { maxLength: maxLength(255) },
        title: { required, maxLength: maxLength(230) },
        description: { required, maxLength: maxLength(900) }
      }
    }
  }
}
</script>
