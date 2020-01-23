<template>
  <q-page class="q-pa-md">
    <q-tabs class="q-mb-md topbar" v-model="active_tab">
      <q-tab name="my_proposals" :label="$t('myworkerproposals.my_proposals')" />
      <q-tab name="completed" :label="$t('myworkerproposals.completed_proposals')" />
      <q-tab name="my_validations" :label="$t('myworkerproposals.validator')" />
    </q-tabs>

    <div
      class="row q-pa-md q-mb-md shadow-4 rounded-borders justify-between"
      v-if="pagination.max > 1"
    >
      <!--<q-search
        color="primary"
        v-model="filter"
        :placeholder="$t('vote_custodians.search')"
      /> -->
      <q-pagination
              color="secondary"
              v-show="true"
              v-model="pagination.page"
              :min="1"
              :max="pagination.max"
              :max-pages="6"
              direction-links
              size="12px"
      />
    </div>

    <div v-if="wps.length" class="row gutter-sm">
      <div class="col-xs-12 col-xl-6" v-for="(wp, i) in wps" :key="`wp${i}`">
        <wp-proposal
          :read_only="!getIsCustodian"
          :wp="wp"
          :array_index="i"
          @wp_expand="
            expanded_modal_index = Number($event);
            expanded_modal = true;
          "
          @delete="wps.splice(i, 1)"
        />
      </div>
    </div>
    <div
      v-else
      class="bg-logo-sm q-pa-md rounded-borders shadow-4"
    >
      <span v-if="loading" class="row items-center">
        <q-spinner class="on-left" color="primary" />{{$t('workerproposals.loading')}}
      </span>
      <span v-else>{{$t('workerproposals.no_proposals')}}</span>
    </div>

    <q-dialog v-model="expanded_modal">
      <q-carousel
        height="100%"
        quick-nav
        :quick-nav-icon="$configFile.icon.dactoken"
        quick-nav-position="top"
        arrows
        v-model="expanded_modal_index"
      >
        <q-carousel-slide
          class="no-padding "
          v-for="(wp, i) in wps"
          :key="`exp${i}`"
        >
          <div class="full-height">
            <div style="padding-top:38px; height:100%;">
              <wp-proposal
                :wp="wp"
                :expanded="true"
                @wp_compress="expanded_modal = false"
              />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </q-dialog>
  </q-page>
</template>

<script>
import wpProposal from 'components/ui/wp-proposal'
import { mapGetters } from 'vuex'
// const stateEnum = require('../../boot/wp_state_enum.js')

export default {
  name: 'ReviewWP',
  components: {
    wpProposal
  },
  data () {
    return {
      loading: false,
      expanded_modal: false,
      expanded_modal_index: 0,
      wps: [],
      active_tab: 'my_proposals',
      pagination: {
        page: 1,
        max: 1,
        items_per_page: 8
      },
      filter: ''
    }
  },
  computed: {
    ...mapGetters({
      getWpConfig: 'dac/getWpConfig',
      getIsCustodian: 'user/getIsCustodian',
      getAccountName: 'user/getAccountName'
    })
  },
  methods: {
    async fetchWps (query) {
      console.log(`fetchWps`, query, this.getAccountName)
      this.loading = true
      let res = await this.$store.dispatch('dac/fetchWorkerProposals', query)
      console.log(res)
      if (res.results) {
        this.wps = res.results
        this.pagination.max = Math.ceil(
          res.count / this.pagination.items_per_page
        )
      }
      this.loading = false
    },
    managePagination () {
      if (!this.getAccountName) {
        return
      }
      let skip = (this.pagination.page - 1) * this.pagination.items_per_page
      // make request
      const query = {
        status: '0,1,2,3,4', // all current statuses
        skip: skip,
        limit: this.pagination.items_per_page
      }
      if (this.active_tab === 'my_proposals') {
        query.proposer = this.getAccountName
      } else if (this.active_tab === 'my_validations') {
        query.arbitrator = this.getAccountName
      } else if (this.active_tab === 'completed') {
        query.proposer = this.getAccountName
        query.status = 101
      }
      this.fetchWps(query)
    }
  },

  created () {
    if (this.getWpConfig.service_account === null) {
      this.$store.dispatch('dac/fetchWpConfig')
    }
    this.managePagination()
  },
  watch: {
    active_tab: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        // double check the tab has been changed

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
    },

    getAccountName: function () {
      console.log(`fetchWps account name changed`)
      this.managePagination()
    }
  }
}
</script>
