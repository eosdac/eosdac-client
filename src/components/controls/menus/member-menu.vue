<template>
<div>
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

    <q-item class="q-pl-lg animate-fade" clickable to="/member/new-worker-proposal">
      <q-item-section class="text-text1 text-weight-light">{{$t('menu.new_worker_proposal')}}</q-item-section>
    </q-item>

    <q-item class="q-pl-lg animate-fade" clickable to="/member/my-worker-proposals">
      <q-item-section class="text-text1 text-weight-light">{{$t('menu.my_worker_proposals')}}</q-item-section>
    </q-item>

    <q-item class="q-pl-lg animate-fade" clickable to="/member/referendums">
      <q-item-section class="text-text1 text-weight-light">{{$t('menu.referendums')}}</q-item-section>
    </q-item>

    <q-item class="q-pl-lg animate-fade" clickable to="/member/new-referendum">
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
    return {}
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getMemberStatus: 'user/getMemberStatus'
    })
  }
}
</script>
