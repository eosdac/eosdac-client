<template>
  <q-page class="q-pa-md">
    <dac-events @notification="onDACEvent"></dac-events>
      <wp-proposal
                :wp="wp"
                :expanded="true"
                :fullscreen="true"
              />
  </q-page>
</template>

<script>
import wpProposal from 'components/ui/wp-proposal'
import dacEvents from 'components/dacevents/dac-events'

import { mapGetters } from 'vuex'

export default {
  name: 'workerProposal',
  components: {
    wpProposal,
    dacEvents
  },

  data () {
    return {
      wp: null,
      wp_id: null
    }
  },

  computed: {
    ...mapGetters({
      getIsCustodian: 'user/getIsCustodian'
    })
  },

  methods: {
    onDACEvent (data) {
      if (data.notify.substr(0, 3) === 'WP_') {
        // this.managePagination()
        console.log(data.wp_data.id)
        if (data.wp_data.id === this.wp_id) {
          this.getProposal(this.wp_id)
        }
      }
    },

    async getProposal (id) {
      const res = await this.$store.dispatch('dac/fetchWorkerProposal', id)
      console.log(`WPS res`, res)
      if (res.count) {
        this.wp = res.results[0]
      }
    }
  },

  mounted () {
    this.wp_id = this.$route.params.id
    this.getProposal(this.wp_id)
  },

  watch: {
    'pagination.items_per_page': function (newVal, oldVal) {
      this.managePagination()
    },

    'pagination.page': function (newVal, oldVal) {
      this.managePagination()
    }
  }
}
</script>
