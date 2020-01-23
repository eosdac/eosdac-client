<template>
  <q-page class="q-pa-md">
    <dac-events @notification="onDACEvent"></dac-events>

    <div class="row justify-end q-mb-md">
      <q-btn
        color="primary"
        :label="$t('workerproposals.my_delegations')"
        @click="delegate_modal = true"
      />
    </div>

    <q-tabs class="q-mb-md topbar" v-model="active_tab">
      <q-tab
        v-if="getIsCustodian"
        name="inbox"
        :label="$t('workerproposals.inbox')"
      />
      <q-tab
        name="pending_approval"
        :label="$t('workerproposals.pending_approval')"
      />
      <q-tab name="work_in_progress" :label="$t('workerproposals.work_in_progress')" />
      <q-tab name="pending_claim" :label="$t('workerproposals.pending_validate')" />
      <q-tab name="claimed" :label="$t('workerproposals.completed')" />
      <q-tab name="expired" :label="$t('workerproposals.expired')" />
      <q-tab name="cancelled" :label="$t('workerproposals.cancelled')" />
    </q-tabs>

    <div
      class="row q-pa-md q-mb-md justify-between"
      v-if="pagination.max > 1"
    >
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

    <q-list separator v-if="wps.length" class="row">
      <div class="col-12" >
        <wp-proposal v-for="(wp, i) in wps" :key="`wp${i}`"
          :wp="wp"
          :array_index="i"
          @wp_expand="
            expanded_modal_index = Number($event);
            expanded_modal = true;
          "
          @delete="wps.splice(i, 1)"
        />
      </div>
    </q-list>
    <div
      v-else
      class="bg-logo-sm q-pa-md rounded-borders shadow-4 capitalize"
    >
      <span v-if="loading" class="row items-center">
        <q-spinner class="on-left" color="primary" />{{$t('workerproposals.loading')}}
      </span>
      <span v-else>{{$t('workerproposals.no_proposals')}}</span>
    </div>

    <q-dialog maximized v-model="expanded_modal">
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

    <q-dialog v-model="delegate_modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('workerproposals.delegate_votes')}}</div>
        </q-card-section>
        <q-card-section>
          <vote-delegation />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import wpProposal from 'components/ui/wp-proposal'
import dacEvents from 'components/dacevents/dac-events'
import voteDelegation from 'components/controls/vote-delegation'
import { mapGetters } from 'vuex'
const stateEnum = require('../boot/wp_state_enum.js')

// https://api-jungle.eosdac.io/v1/eosdac/proposals_inbox?account=evilmikehere

export default {
  name: 'ReviewWP',
  components: {
    wpProposal,
    voteDelegation,
    dacEvents
  },
  data () {
    return {
      loading: false,
      delegate_modal: false,
      expanded_modal: false,
      expanded_modal_index: 0,
      wps: [],
      active_tab: '',
      pagination: {
        page: 1,
        max: 1,
        items_per_page: 20
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
    onDACEvent (data) {
      if (data.notify.substr(0, 3) === 'WP_') {
        this.managePagination()
      }
    },
    async fetchWps (query) {
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
    async fetchWpsInbox (query) {
      // {account:'evilmikehere'}
      let res = await this.$store.dispatch(
        'dac/fetchWorkerProposalsInbox',
        query
      )
      console.log(res)
      if (res.results) {
        this.wps = res.results
        this.pagination.max = Math.ceil(
          res.count / this.pagination.items_per_page
        )
      }
    },
    managePagination () {
      // calculate skip
      let skip = (this.pagination.page - 1) * this.pagination.items_per_page
      // make request
      if (this.active_tab === 'inbox') {
        this.fetchWpsInbox({
          account: this.getAccountName,
          skip: skip,
          limit: this.pagination.items_per_page
        })
      } else {
        console.log(`active tab : ${this.active_tab}`)
        this.fetchWps({
          status: stateEnum[this.active_tab],
          skip: skip,
          limit: this.pagination.items_per_page
        })
      }
    }
  },

  created () {
    if (this.getWpConfig.service_account === null) {
      this.$store.dispatch('dac/fetchWpConfig')
    }
  },
  mounted () {
    if (this.getIsCustodian) {
      this.active_tab = 'inbox'
    } else {
      this.active_tab = 'pending_approval'
      this.managePagination()
    }
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
    }
  }
}
</script>
