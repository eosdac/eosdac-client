<template>
  <div>
    <q-expansion-item
      group="main-menu-sub"
      v-if="getIsCustodian"
      class="animate-fade"
    >
      <template slot="header">
        <q-item-section avatar>
          <q-icon :name="$configFile.icon.cust_tools" />
        </q-item-section>
        <q-item-section>{{$t('menu.custodian_tools')}}</q-item-section>
      </template>

        <q-item class="q-pl-lg animate-fade" clickable to="/custodian/dac-management">
          <q-item-section class="text-weight-light">{{$t('menu.manage_dac')}}</q-item-section>
        </q-item>

        <q-item class="q-pl-lg animate-fade" clickable to="/review-proposals">
          <q-item-section class="text-weight-light">{{$t('menu.vote_msigs')}}</q-item-section>
        </q-item>

        <q-item class="q-pl-lg animate-fade" clickable to="/review-worker-proposals">
          <q-item-section class="text-weight-light">{{$t('menu.vote_worker_proposals')}}</q-item-section>
        </q-item>

        <q-item v-if="getEnableCustPayments" class="q-pl-lg animate-fade" clickable to="/custodian/my-payments">
          <q-item-section class="text-weight-light">{{$t('menu.my_payments')}}</q-item-section>
        </q-item>

        <q-item class="q-pl-lg animate-fade" clickable to="/explore-dac">
          <q-item-section class="text-weight-light">{{$t('menu.explore')}}</q-item-section>
        </q-item>

        <!--
        <q-item
          class="q-pl-lg animate-fade"
          link
          to="/custodian/review-worker-proposals"
        >
          <q-item-main
            :label="$t('menu.vote_worker_proposals')"
            class="text-weight-light"
          />
        -->
        <!-- <q-item-side right>
            <q-chip round dense color="negative" class="shadow-2">7</q-chip>
          </q-item-side> -->
        <!--
        </q-item>
        -->

    </q-expansion-item>

    <q-expansion-item v-else group="main-menu-sub" class="animate-fade">

      <template slot="header">
        <q-item-section avatar>
          <q-icon :name="$configFile.icon.dactoken" />
        </q-item-section>
        <q-item-section>{{$t('menu.dac_activity', { dacname: $dir.title })}}</q-item-section>
      </template>

      <q-item class="q-pl-lg animate-fade" clickable to="/review-proposals">
        <q-item-section class="text-weight-light">{{$t('menu.view_msigs')}}</q-item-section>
      </q-item>

      <q-item class="q-pl-lg animate-fade" clickable to="/review-worker-proposals" v-if="wpEnabled">
        <q-item-section class="text-weight-light">{{$t('menu.vote_worker_proposals')}}</q-item-section>
      </q-item>

      <q-item class="q-pl-lg animate-fade" clickable to="/dac-activity/financials">
        <q-item-section class="text-weight-light">{{$t('menu.view_financials')}}</q-item-section>
      </q-item>
      <q-item class="q-pl-lg animate-fade" clickable to="/explore-dac">
        <q-item-section class="text-weight-light">{{$t('menu.explore')}}</q-item-section>
      </q-item>

      <!--
      <q-item
        class="q-pl-lg animate-fade"
        link
        to="/dac-activity/review-worker-proposals"
      >
        <q-item-main
          :label="$t('menu.view_worker_proposals')"
          class="text-weight-light"
        />
      </q-item>
      -->
    </q-expansion-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'custodianMenu',
  data () {
    return {
      wpEnabled: false,
      referendumEnabled: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getIsCustodian: 'user/getIsCustodian',
      getEnableCustPayments: 'dac/getEnableCustPayments'
    })
  },

  mounted () {
    const wpAccount = this.$dir.getAccount(this.$dir.ACCOUNT_PROPOSALS)
    const referendumAccount = this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM)
    this.wpEnabled = !!wpAccount
    this.referendumEnabled = !!referendumAccount
  }
}
</script>
