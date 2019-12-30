<template>
  <q-page class="q-pa-md">
    <!-- content -->
    <h4>{{$t('referendums.title')}}</h4>

    <div v-for="(refData, i) in referendums" :key="i">
      <referendum :data="refData" v-on:referendumvote="delayedUpdateList" :updating="updating" />
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
      updating: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsDark: 'ui/getIsDark',
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
    async updateList () {
      console.log(`Update referendums list`)
      const query = { status: 0 }
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
  }
}
</script>
