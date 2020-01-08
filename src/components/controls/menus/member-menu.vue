<template>
<div v-if="wpEnabled || referendumEnabled">
  <q-expansion-item
          group="main-menu-sub"
          v-if="getMemberStatus == 'member'"
          class="animate-fade"
  >
    <template slot="header">
      <q-item-section avatar>
        <q-icon :name="$configFile.icon.mem_tools" />
      </q-item-section>
      <q-item-section>{{$t('menu.member_tools')}}</q-item-section>
    </template>

    <q-item class="q-pl-lg animate-fade" clickable to="/member/new-worker-proposal" v-if="wpEnabled">
      <q-item-section class="text-text1 text-weight-light">{{$t('menu.new_worker_proposal')}}</q-item-section>
    </q-item>

    <q-item class="q-pl-lg animate-fade" clickable to="/member/my-worker-proposals" v-if="wpEnabled">
      <q-item-section class="text-text1 text-weight-light">{{$t('menu.my_worker_proposals')}}</q-item-section>
    </q-item>

    <q-item class="q-pl-lg animate-fade" clickable to="/member/referendums" v-if="referendumEnabled">
      <q-item-section class="text-text1 text-weight-light">{{$t('menu.referendums')}}</q-item-section>
    </q-item>

    <q-item class="q-pl-lg animate-fade" clickable to="/member/new-referendum" v-if="referendumEnabled">
      <q-item-section class="text-text1 text-weight-light">{{$t('menu.new_referendum')}}</q-item-section>
    </q-item>

  </q-expansion-item>

</div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'memberMenu',
  data () {
    return {
      wpEnabled: false,
      referendumEnabled: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getMemberStatus: 'user/getMemberStatus'
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
