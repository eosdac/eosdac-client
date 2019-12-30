<template>
      <div class="row gutter-sm">
        <div class="col-xs-12">
          <q-field borderless label="Title"
                   :error="$v.form.title.$error"
                   error-label="Title is required and can't be longer then 230 chars">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                <q-input
                        v-model="form.title"
                        @input="$v.form.title.$touch()"
                />
              </div>
            </template>
          </q-field>

        </div>

        <div class="col-xs-12">
          <q-field
                  borderless
                  label="Description"
                  class="q-mb-sm"
                  :error="$v.form.description.$error"
                  error-label="Description is required and can't be longer then 900 chars"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                <q-input
                        class="no-padding"
                        type="textarea"
                        v-model="form.description"
                        @input="$v.form.description.$touch()"
                />
              </div>
            </template>
          </q-field>
        </div>

        <div class="col-xs-12 col-lg-6">
          <q-field
                  borderless
                  label="From"
                  class="q-mb-sm"
                  :error="$v.form.from.$error"
                  error-label="Select a from account"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                <q-input
                        class="no-padding"
                        v-model="form.from"
                        color="primary-light"
                />
              </div>
            </template>
          </q-field>
        </div>

        <div class="col-xs-12 col-lg-6">
          <div>
            <q-field
                    borderless
                    class="q-mb-sm"
                    label="To"
                    :error="$v.form.to.$error"
                    error-label="Please enter a valid accountname"
            >
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  <q-input
                          class="no-padding"
                          v-model.trim="form.to"
                          @input="$v.form.to.$touch()"
                  />
                </div>
              </template>
            </q-field>
          </div>
        </div>

        <div class="col-xs-12 col-lg-6">
          <div>
            <q-field
                    borderless
                    class="q-mb-sm"
                    :error="$v.form.asset.amount.$error"
                    label="Quantity"
                    error-label="Please enter a valid pay amount"
            >
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  <div class="row no-wrap items-end">
                    <q-input
                            class="full-width no-padding"
                            type="number"
                            :decimals="form.asset.precision"
                            v-model="form.asset.amount"
                            @input="$v.form.asset.amount.$touch()"
                    />

                    <q-select
                            v-if="!tokens_loading"
                            class="no-padding q-ml-xs animate-fade"
                            hide-underline
                            filter
                            autofocus-filter
                            :value="selected_token"
                            color="primary-light"
                            placeholder="token"
                            :options="
                tokens.map(t => {
                  return {
                    image: t.logo || '',
                    value: t,
                    label: t.symbol,
                    sublabel: t.contract,
                    stamp: `${t.precision}`,
                    rightTextColor: 'blue'
                  };
                })
              "
                            @change="handleTokenSelection"
                    />

                    <q-spinner v-if="tokens_loading" color="primary" />
                  </div>
                </div>
              </template>

            </q-field>
          </div>
        </div>

        <div class="col-xs-12 col-lg-6">
          <div>
            <q-field
                    borderless
                    label="Memo"
                    class="no-padding q-mb-sm"
                    :error="$v.form.memo.$error"
                    error-label="Memo can't be longer then 255 chars."
            >
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  <q-input
                          v-model.trim="form.memo"
                          class="no-padding"
                  />
                </div>
              </template>
            </q-field>
          </div>
        </div>

        <div class="col-xs-12">
          <div class="row justify-end">
            <q-btn color="primary" label="add" @click="processInputs" />
          </div>
        </div>
      </div>

</template>

<script>
import { mapGetters } from 'vuex'
// import MarkdownViewer from "components/ui/markdown-viewer";
import { required, maxLength } from 'vuelidate/lib/validators'
import { isEosName } from '../../modules/validators.js'
export default {
  name: 'msigTransfer',
  components: {
    // MarkdownViewer
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
        from: '',
        to: '',
        asset: {
          symbol: 'EOS',
          precision: 4,
          contract: 'eosio.token',
          amount: ''
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
          symbol: this.$configFile.get('dactokensymbol'),
          precision: 4,
          contract: this.$configFile.get('tokencontract')
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getIsDark: 'ui/getIsDark',
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
        return
      }
      let formdata = JSON.parse(JSON.stringify(this.form))
      formdata.asset.amount = parseFloat(formdata.asset.amount).toFixed(
        formdata.asset.precision
      )
      this.$emit('onsubmit', formdata)
      this.clearForm()
    },
    clearForm () {
      this.form = {
        from: '',
        to: '',
        asset: {
          symbol: 'EOS',
          precision: 4,
          contract: 'eosio.token',
          amount: ''
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
      if (!this.form.from) return
      this.tokens_loading = true
      let tokens
      try {
        tokens = await this.$axios.get(
          `${this.$configFile.get(
            'dacapi'
          )}/tokens_owned?account=${this.form.from}`
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
      this.setTokens()
    }
  },

  validations () {
    return {
      form: {
        from: { required, isEosName },
        to: { required, isEosName },
        asset: {
          amount: { required },
          symbol: { required }
        },
        memo: { maxLength: maxLength(255) },
        title: { required, maxLength: maxLength(230) },
        description: { required, maxLength: maxLength(900) }
      }
    }
  }
}
</script>
<!--
<style>
.q-item-image {
  min-height: 40px;
  height: 40px;
  min-width: 40px;
  width: 40px;
  border-radius: 50%;
  object-fit: cover;
}
</style>-->
