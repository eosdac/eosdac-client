<template>
  <q-page>
    <!--  -->
    <q-tabs color="primary" v-model="selectedTab">
      <q-tab
        default
        :label="`Token (${$dir.symbolCode})`"
        name="token"
      />
      <!--<q-tab label="Members" name="members" slot="title" />-->
      <q-tab label="Votes" name="votes" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab">
      <!-- Targets -->
      <q-tab-panel name="token">
        <token-statistics class="q-mb-md" />
        <transfer-table />
      </q-tab-panel>
      <!--<q-tab-pane name="members">coming soon...</q-tab-pane>-->
      <q-tab-panel name="votes">
        <vote-timeline
                class="q-mt-sm bg-bg1 q-pa-md"
                :responsive="true"
                :height="400"
                :accounts="getCustNames"
                :legend="true"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import transferTable from 'components/ui/transfer-table'
import tokenStatistics from 'components/ui/token-statistics'
import voteTimeline from 'components/ui/vote-timeline'
export default {
  name: 'explore-dac',
  components: {
    transferTable,
    tokenStatistics,
    voteTimeline
  },
  data () {
    return {
      selectedTab: 'token'
    }
  },
  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians',
      getAccountName: 'user/getAccountName'
    }),
    getCustNames () {
      if (this.getCustodians) {
        return this.getCustodians.map(c => {
          return c.cust_name
        })
      } else {
        return []
      }
    }
  },

  methods: {},

  mounted: async function () {},
  watch: {}
}
</script>

<style></style>
