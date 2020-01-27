<template>
  <q-page class="q-pa-md">
    <!-- content -->
    <h4>{{$t('referendums.title')}}</h4>

    <q-tabs align="justify" v-model="active_tab" class="q-mb-md">
      <q-tab name="open" :label="$t('referendums.open')" />
      <q-tab name="passed" :label="$t('referendums.passed')" />
      <q-tab name="failed" :label="$t('referendums.failed')" />
      <q-tab name="not_met" :label="$t('referendums.not_met')" />
    </q-tabs>

    <div v-for="(refData, i) in referendums" :key="i">
      <referendum :data="refData" v-on:referendumvote="delayedUpdateList" :updating="updating" />
    </div>
    <div v-if="!referendums.length">
      {{$t('referendums.no_results')}}
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import referendum from 'components/ui/referendum'

export default {
  name: 'referendums',

  components: {
    referendum
  },
  data () {
    return {
      referendums: [],
      config: null,
      updating: false,
      pagination: {
        page: 1,
        max: 1,
        items_per_page: 20
      },
      active_tab: 'open'
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getSettingByName: 'user/getSettingByName',
      getReferendums: 'dac/getReferendums'
    })
  },
  methods: {
    async delayedUpdateList () {
      this.updating = true
      setTimeout(() => {
        this.updateList()
        this.updating = false
      }, 2000)
    },
    currentStatus () {
      const map = { open: 0, passed: 1, failed: 2, not_met: 3 }
      return map[this.active_tab]
    },
    async updateList () {
      let skip = (this.pagination.page - 1) * this.pagination.items_per_page
      const status = this.currentStatus()
      console.log(`status = ${status}, active tab = ${this.active_tab}`)

      console.log(`Update referendums list`)
      const query = {
        status,
        limit: this.pagination.items_per_page,
        skip: skip
      }
      const { results } = await this.$store.dispatch('dac/fetchReferendums', query)
      console.log('Referendum results', results)
      this.referendums = results
    },
    async loadConfig () {
      console.log(`Load referendums config`)
      const query = { status }
      const results = await this.$store.dispatch('dac/fetchReferendumConfig', query)
      console.log('Referendum config', results)
      this.config = results
    }
  },
  mounted () {
    this.loadConfig()
    this.updateList()
  },

  watch: {
    active_tab: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        // double check the tab has been changed

        this.proposals = []
        if (this.pagination.page === 1) {
          this.updateList()
        } else {
          this.pagination.page = 1 // this will trigger the watcher below
        }
      }
    },

    'pagination.items_per_page': function (newVal, oldVal) {
      this.updateList()
    },

    'pagination.page': function (newVal, oldVal) {
      this.updateList()
    }
  }
}
</script>
