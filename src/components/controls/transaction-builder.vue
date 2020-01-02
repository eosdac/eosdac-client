<template>
  <div id="transaction-builder">
    <div class="text-text1">
      <div class="justify-between">

        <q-separator />

        <div class="">
          <q-btn
            :disabled="!actions.length"
            color="positive"
            class="animate-fade"
            @click="proposeMsig"
            :label="$t('transactionbuilder.submit_proposal')"
          />
        </div>
      </div>

      <div
        class="row q-mb-md bg-bg2 q-pa-md q-mt-md rounded-borders"
      >
        <draggable
          v-model="actions"
          group="actions"
          @start="drag = true"
          @end="drag = false"
        >
          <display-action
            v-for="(action, i) in actions"
            :action="action"
            closable
            viewable
            @close="deleteAction(i)"
            :key="`a${i}`"
            class="cursor-pointer"
          />
        </draggable>
        <span class="text-negative text-weight-light" v-if="!actions.length">{{$t('transactionbuilder.add_actions')}}</span>
      </div>

      <div>
        <div name="tab-actions">

          <action-maker @actiondata="addAction" :prefill="{ from: getAccountName }"/>

        </div>

        <div name="tab-msig">
          <div class="row gutter-sm q-pa-md">
            <div class="col-xs-12 col-md-6">
              <div class="q-pa-md rounded-borders full-height">
                <span class="text-text2">{{$t('transactionbuilder.add_title_description')}}</span>
                <q-input
                        :label="$t('transactionbuilder.title')"
                        v-model="msig_title"
                        class="q-mb-md"
                />
<!--                <div class="q-caption q-mb-sm">{{$t('transactionbuilder.description')}}</div>-->

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
                          :text="msig_description"
                          v-on:update="updateText"
                          :label="$t('transactionbuilder.description')"
                  />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="q-pa-md rounded-borders">
                <div class="q-pa-sm">{{$t('transactionbuilder.set_expiry')}}</div>

                <q-date v-model="msig_expiration" :options="verifyDates" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
const prettyHtml = require('json-pretty-html').default
import { mapGetters } from 'vuex'
import actionMaker from 'components/controls/action-maker'
import displayAction from 'components/ui/display-action'
// import VueEditor from 'vue2-editor'

import MarkdownViewer from 'components/ui/markdown-viewer'

import draggable from 'vuedraggable'
import { date } from 'quasar'
const today = new Date()
const { addToDate } = date

export default {
  name: 'transactionBuilder',
  components: {
    actionMaker,
    displayAction,
    draggable,
    MarkdownViewer
  },
  props: {
    enable_msig: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      drag: false,
      new_requested_signature: '',

      actions: [],
      broadcast: true,
      msigMode: this.enable_msig,

      is_personal_msig: false,
      msig_proposal_name: '',
      msig_requested_signatures: [],

      msig_title: '',
      msig_description: '',

      msig_delay: 0,
      msig_expiration: date.formatDate(addToDate(today, { days: 14 }), 'YYYY/MM/DD'),
      mindate: addToDate(today, { days: -1 }),
      maxdate: addToDate(today, { days: 90 })
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getSettingByName: 'user/getSettingByName',
      getAuthString: 'user/getAuthString',
      getCustodianPermissions: 'dac/getCustodianPermissions',
      getCustodianConfig: 'dac/getCustodianConfig'
    }),

    parseNumberToAsset (number, symbol) {
      return `${number.toFixed(4)} ${symbol}`
    },
    verifyStep2 () {
      return true
    }
  },

  methods: {
    prettyHtml,
    updateText (val) {
      this.msig_description = val
    },
    verifyDates (selectedDateStr) {
      return date.isBetweenDates(selectedDateStr, this.mindate, this.maxdate)
    },
    addAction (data) {
      this.actions.push(data)
    },

    deleteAction (i) {
      this.actions.splice(i, 1)
    },

    async pushTransaction () {
      let result = await this.$store.dispatch('user/transact', {
        actions: this.actions,
        options: { broadcast: this.broadcast }
      })
      if (result) {
        console.log('transaction callback', result)
        this.actions = []
        // this.latest_trx_id = result.transaction_id
      }
    },

    async proposeMsig () {
      const expiration = date.formatDate(date.addToDate(this.msig_expiration, { hours: 23, minutes: 59, seconds: 59 }), 'YYYY-MM-DDTHH:mm:ss')
      let msigOptions = {
        actions: this.actions,
        expiration,
        delay_sec: this.msig_delay,
        title: this.msig_title,
        description: this.msig_description
      }
      console.log(msigOptions)
      let result = await this.$store.dispatch(
        'user/proposeMsig',
        JSON.parse(JSON.stringify(msigOptions))
      )
      if (result) {
        console.log('transaction callback', result)
        this.actions = []
        // this.latest_trx_id = result.transaction_id
      }
    },

    async loadCustPermissions () {
      this.msig_requested_signatures =
        this.getCustodianPermissions ||
        (await this.$store.dispatch('dac/fetchCustodianPermissions'))
    },

    addRequestedSignature (authstring) {
      if (authstring === '') {
        return
      }
      let [actor, perm] = authstring.split('@')
      if (!actor || !perm) {
        this.new_auth = ''
        return
      }
      let alreadyAdded = this.msig_requested_signatures.find(
        mrs => mrs.actor === actor && mrs.permission === perm
      )

      if (!alreadyAdded) {
        this.msig_requested_signatures.push({ actor: actor, permission: perm })
        this.new_requested_signature = ''
      }
    },

    async handleFileInput () {
      let file = this.$refs.inputFile.files[0]
      console.log(file)
      let content = await new Promise((resolve, reject) => {
        var fr = new FileReader()
        fr.onload = function (result) {
          return resolve(fr.result)
        }
        fr.readAsText(file, `utf8`)
      })

      try {
        content = JSON.parse(content)
      } catch (e) {
        alert('Malformed import file !!', e)
        return
      }

      for (let i = 0; i < content.length; i++) {
        this.addAction(content[i])
      }
      document.getElementById('myInput').value = ''
    }
  },
  watch: {
    msig_expiration (v) {
      console.log(`changed`, v)
    }
  }
}
</script>

<style lang="stylus">
</style>
