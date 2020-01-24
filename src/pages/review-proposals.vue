<template>
  <q-page class="q-pa-md">
    <dac-events @notification="onDACEvent"></dac-events>

    <div class="row relative-position justify-start q-mb-md">
      <h4 class="q-display-1 q-my-none">
        {{$t('proposals.review_proposals')}} <span v-if="total">({{ total }})</span>
      </h4>
    </div>

    <q-tabs align="justify" v-model="active_tab" class="q-mb-md">
      <q-tab name="open" :label="$t('proposals.open')" />
      <q-tab name="executed" :label="$t('proposals.executed')" />
      <q-tab name="cancelled" :label="$t('proposals.cancelled')" />
      <q-tab name="expired" :label="$t('proposals.expired')" />
    </q-tabs>

    <div
      class="row q-pa-md q-mx-md"
      v-if="pagination.max > 1"
    >
      <!--<q-search
        color="primary"
        v-model="filter"
        :placeholder="$t('vote_custodians.search')"
        style="visibility:hidden"
      />-->
        <q-pagination
          color="secondary"
          v-model="pagination.page"
          :min="1"
          :max="pagination.max"
          :max-pages="6"
          direction-links
        />
    </div>

    <div v-if="proposals && proposals.length"
      class="bg-logo-sm q-pa-md rounded-borders shadow-4 capitalize">
      <Msigproposal
        v-for="(msig, index) in proposals"
        :key="index"
        :msig="msig"
      />
    </div>
    <div
      v-else
      class="bg-logo-sm q-pa-md shadow-4 rounded-borders justify-between"
    >
      <span v-if="msigs_loading" class="row items-center">
        <q-spinner-pie class="on-left" color="primary" />{{$t('proposals.loading')}}
      </span>
      <span v-else>{{$t('proposals.no_proposals')}}</span>
    </div>

    <div
      class="row q-pa-md q-my-md"
      v-if="pagination.max > 1"
    >
<!--      <q-search-->
<!--        color="primary"-->
<!--        v-model="filter"-->
<!--        :placeholder="$t('vote_custodians.search')"-->
<!--        style="visibility:hidden"-->
<!--      />-->
        <q-pagination
          color="secondary"
          v-show="true"
          v-model="pagination.page"
          :min="1"
          :max="pagination.max"
          :max-pages="6"
          direction-links
        />
    </div>
  </q-page>
</template>

<script>
// import Vue from 'vue'
import Msigproposal from 'components/ui/msig-proposal'
import dacEvents from 'components/dacevents/dac-events'

import { mapGetters } from 'vuex'

export default {
  name: 'ReviewMsigs',
  components: {
    Msigproposal,
    dacEvents
  },

  data () {
    return {
      proposals: [],
      createmsig_modal: false,
      active_tab: '',
      total: false,
      pagination: {
        page: 1,
        max: 1,
        items_per_page: 20
      },
      filter: '',
      msigs_loading: false
    }
  },

  computed: {
    ...mapGetters({
      getIsCustodian: 'user/getIsCustodian'
    })
  },

  created () {
    this.active_tab = 'open'
    this.managePagination()
    // this.$root.$on('reloadproposals', this.getProposalsWithDelay)
  },

  methods: {
    onDACEvent (data) {
      if (data.notify.substr(0, 5) === 'MSIG_') {
        // this.managePagination()
        let found = false
        const status = this.currentStatus()
        for (let i = 0; i < this.proposals.length; i++) {
          if (this.proposals[i].proposal_name === data.msig_data.proposal_name) {
            found = true
            if (data.msig_data.status === status) {
              this.$set(this.proposals, i, data.msig_data)
            } else {
              this.proposals.splice(i, 1)
            }
            break
          }
        }
        if (!found) {
          console.log(`my data not found`)
          if (status === data.msig_data.status) {
            console.log(`Adding new msig`)
            this.proposals.unshift(data.msig_data)
          }
        }
      }
    },
    currentStatus () {
      const map = { open: 1, executed: 2, cancelled: 0, expired: 3 }
      return map[this.active_tab]
    },
    managePagination () {
      // map tab to number for making the request
      // calculate skip
      let skip = (this.pagination.page - 1) * this.pagination.items_per_page
      const status = this.currentStatus()
      console.log(`status = ${status}, active tab = ${this.active_tab}`)
      // this.getProposals({find: find, skip: skip, limit: this.pagination.items_per_page});
      this.getProposals({
        status,
        limit: this.pagination.items_per_page,
        skip: skip
      })
    },

    async getProposals (query) {
      this.msigs_loading = true
      let p = await this.$store.dispatch('dac/fetchMsigProposals', query)
      if (p) {
        console.log('msigs', p)
        this.proposals = []
        this.total = p.count
        this.pagination.max = Math.ceil(
          p.count / this.pagination.items_per_page
        )
        this.proposals = p.results
      }
      this.msigs_loading = false
    }
  },

  watch: {
    active_tab: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        // double check the tab has been changed

        this.proposals = []
        if (this.pagination.page === 1) {
          this.managePagination()
        } else {
          this.pagination.page = 1 // this will trigger the watcher below
        }
      }
    },

    'pagination.items_per_page': function (newVal, oldVal) {
      this.managePagination()
    },

    'pagination.page': function (newVal, oldVal) {
      this.managePagination()
    }
  }
}
</script>
