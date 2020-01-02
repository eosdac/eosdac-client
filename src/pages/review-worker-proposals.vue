<template>
  <q-page class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-btn
        color="primary"
        label="my delegations"
        @click="delegate_modal = true"
      />
    </div>

    <q-tabs class="q-mb-md topbar" v-model="active_tab">
      <q-tab
        v-if="getIsCustodian"
        name="inbox"
        label="inbox"
      />
      <q-tab
        name="pending_approval"
        label="pending approval"
      />
      <q-tab name="work_in_progress" label="work in progress" />
      <q-tab name="pending_claim" label="Pending claim" />
      <q-tab name="claimed" label="completed" />
      <q-tab name="expired" label="Expired" />
      <q-tab name="cancelled" label="cancelled" />
    </q-tabs>

    <div
      class="row bg-bg1 q-pa-md q-mb-md shadow-4 rounded-borders justify-between"
      v-if="true"
    >
      <q-search
        color="primary"
        v-model="filter"
        :placeholder="$t('vote_custodians.search')"
      />
      <div class="row inline items-center q-mt-sm" style="font-size:12px;">
        <span>{{ $t("vote_custodians.rows_per_page") }}:</span>
        <q-select
          class="q-ml-sm"
          style="width:45px;"
          hide-underline
          v-model="pagination.items_per_page"
          emit-value
          :options="[
            { label: '1', value: 1 },
            { label: '4', value: 4 },
            { label: '8', value: 8 },
            { label: '16', value: 16 },
            { label: '24', value: 24 },
            { label: '48', value: 48 }
          ]"
        />
        <q-pagination
          color="primary"
          v-show="true"
          v-model="pagination.page"
          :min="1"
          :max="pagination.max"
          :max-pages="6"
          direction-links
        />
      </div>
    </div>

    <div v-if="wps.length" class="row q-col-gutter-md">
      <div class="col-xs-12 col-lg-6" v-for="(wp, i) in wps" :key="`wp${i}`">
        <wp-proposal
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
      class="text-text2 bg-bg1 bg-logo q-pa-md rounded-borders shadow-4 capitalize"
    >
      <span v-if="loading" class="row items-center">
        <q-spinner class="on-left" color="primary" />Loading
      </span>
      <span v-else>No proposals available</span>
    </div>

    <q-dialog maximized v-model="expanded_modal">
      <q-carousel
        color="text2"
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
          <div class="full-height bg-bg2">
            <div class=" text-text1" style="padding-top:38px; height:100%;">
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

    <q-dialog maximized v-model="delegate_modal">
      <div
        style="height:50px"
        class="bg-bg1 row items-center justify-between q-px-md text-text1"
      >
        <span>Delegate</span>
        <q-btn
          icon="close"
          @click="delegate_modal = false"
          dense
          class="no-shadow"
        />
      </div>
      <div class="q-pa-md bg-bg2 text-text1 full-height">
        <vote-delegation />
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import wpProposal from 'components/ui/wp-proposal'
import voteDelegation from 'components/controls/vote-delegation'
import { mapGetters } from 'vuex'
const stateEnum = require('../boot/wp_state_enum.js')

// https://api-jungle.eosdac.io/v1/eosdac/proposals_inbox?account=evilmikehere

export default {
  name: 'ReviewWP',
  components: {
    wpProposal,
    voteDelegation
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
