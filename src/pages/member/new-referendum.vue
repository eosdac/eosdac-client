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
                  :text="description"
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

    <div class="col q-pa-md text-right">
      <q-btn @click="submitReferendum" color="positive">{{$t('referendums.submit')}}</q-btn>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import MarkdownViewer from 'components/ui/markdown-viewer'

export default {
  name: 'new-referendum',

  components: {
    MarkdownViewer
  },
  data () {
    return {
      config: null,
      title: null,
      content: null,
      type: null,
      voting_type: null,
      actions: [],
      type_options: [{ value: 1, label: 'Semi-Binding' }, { value: 2, label: 'Opinion' }],
      voting_type_options: [{ value: 0, label: 'Token' }, { value: 1, label: 'Account' }]
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getSettingByName: 'user/getSettingByName'
    })
  },
  methods: {
    updateText (val) {
      this.content = val
    },
    async loadConfig () {
      console.log(`Load referendums config`)
      const results = await this.$store.dispatch('dac/fetchReferendumConfig')
      console.log('Referendum config', results)
      this.config = results
    },
    updateContent (e) {
      this.content = e.target.value
    },
    async submitReferendum () {
      const data = {
        proposer: this.getAccountName,
        type: this.type.value,
        voting_type: this.voting_type.value,
        title: this.title,
        content: this.content,
        dac_id: this.$dir.dacId,
        acts: this.actions
      }
      let actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM),
          name: 'propose',
          data
        }
      ]
      try {
        let result = await this.$store.dispatch('user/transact', {
          actions: actions
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
    this.loadConfig()
  }
}
</script>

<style lang="stylus">
#editor
  min-height 300px
  max-height 800px
</style>
