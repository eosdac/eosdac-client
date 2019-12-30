<template>
  <div class="row items-center ">
      <div
        v-if="getSettingByName('toolbar_menu_items').value && getAccountName"
        class="row  justify-start gt-md q-mr-xl"
      >
        <q-item>
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.dactoken" />
          </q-item-section>
            <q-item-section>
                <q-item-label>{{
                  $t("default.your_token_balance", {
                  tokenName: $configFile.get("dactokensymbol")
                  })
                  }}
                </q-item-label>
                <q-item-label><xspan
                        :value="
                  $helper.toLocaleNumber(
                    getDacBalance,
                    $configFile.get('tokendecimals')
                  )
                "
                /></q-item-label>
              <q-item-label caption><xspan
                      :value="
                  $helper.toLocaleNumber(
                    getStakedDacBalance,
                    $configFile.get('tokendecimals')
                  )
                " /> staked</q-item-label>
            </q-item-section>
        </q-item>

        <q-item class="animate-pop">
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.systemtoken" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{
              $t("default.your_token_balance", {
                tokenName: $configFile.get("systemtokensymbol")
              })
            }}</q-item-label>
            <q-item-label>
              <xspan
                :value="
                  $helper.toLocaleNumber(
                    getSystemBalance,
                    $configFile.get('systemtokendecimals')
                  )
                "
              />
              <q-icon
                :name="$configFile.icon.liquid"
                color="text2"
                style="margin-left:3px"
                title="Liquid Balance"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

    <div
      v-if="
        getSettingByName('toolbar_profile_image').value &&
          getAccountName &&
          getProfilePicture
      "
      class="row justify-end relative-position"
      style=" margin-right:-12px;"
      ref="profileContainer"
    >
      <profile-pic
        :accountname="getAccountName"
        :scale="0.55"
      />
      <!--<div style="position:absolute;top:7px;right:40px" v-if="isAppIdle">
        <zzz-sleep />
      </div>-->
    </div>

    <q-btn-dropdown
      id="login_button"
      v-if="getAccountName"
      flat
      text-color="text1"
      class="animate-fade"
      :label="getAccountName"
      content-style="margin-top:15px;"
      content-class="round-borders"
    >
      <q-list link class="text-text1 round-borders">
        <q-list-header class="text-text2" style="min-width:300px">
          <span class="q-caption">{{ getAuthString }}</span>
        </q-list-header>
        <q-item>
          <q-item-section
            v-if="getMemberStatus == 'member'"
            :icon="$configFile.icon.check"
            color="positive"
          />
          <q-item-section
            v-if="getMemberStatus == 'pending'"
            :icon="$configFile.icon.pending_sand"
            color="warning"
          />

          <q-item-section>
            <q-item-label header>{{
              $t("menu.member_status")
            }}</q-item-label>
            <q-item-label caption v-if="getMemberStatus">{{
              getMemberStatus
            }}</q-item-label>
            <q-item-label v-else caption>
              <q-btn
                color="primary"
                to="/constitution"
                dense
                :label="$t('menu.signature_required')"
              />
            </q-item-label>
          </q-item-section>
          <!-- <q-item-side right icon="info" color="amber" /> -->
        </q-item>

        <q-separator inset />

        <q-item
          clickable
          v-close-overlay
          @click.native="$store.dispatch('global/switchAccount')"
        >
            <q-item-section avatar>
              <q-icon :name="$configFile.icon.refresh" color="info" />
            </q-item-section>
          <q-item-section>{{ $t("menu.switch_account") }}</q-item-section>
        </q-item>

        <q-item clickable v-close-overlay @click.native="$store.dispatch('global/logout')">
            <q-item-section avatar>
              <q-icon :name="$configFile.icon.account" color="negative" />
            </q-item-section>
            <q-item-section>{{$t('default.logout')}}</q-item-section>
        </q-item>

        <q-separator inset />

        <q-item v-close-overlay to="/settings">
            <q-item-section avatar>
              <q-icon :name="$configFile.icon.settings" />
            </q-item-section>
          <q-item-section>{{ $t("menu.settings") }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn
      size="lg"
      class="no-shadow animate-fade"
      text-color="text1"
      icon="lock"
      v-if="!getAccountName"
      :label="$t('default.login')"
      @click="$store.dispatch('global/login')"
    />
  </div>
</template>

<script>
import profilePic from 'components/ui/profile-pic'
// import zzzSleep from "components/ui/zzz-sleep";
import xspan from 'components/ui/xspan'
import { mapGetters } from 'vuex'
export default {
  name: 'ToolbarMenu',
  components: {
    xspan,
    profilePic
  },
  data () {
    return {}
  },

  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getAuthString: 'user/getAuthString',
      getAgreedTermsVersion: 'user/getAgreedTermsVersion',
      getProfilePicture: 'user/getProfilePicture',
      getDacBalance: 'user/getDacBalance',
      getStakedDacBalance: 'user/getStakedDacBalance',
      getSystemBalance: 'user/getSystemBalance',
      getMemberStatus: 'user/getMemberStatus',
      getSettingByName: 'user/getSettingByName'
    })
  }
}
</script>

<!--<style lang="stylus">
 @import '~variables'

#login_button  .q-focusable:focus .q-focus-helper,
#login_button .q-hoverable:hover .q-focus-helper {
  background: inherit;
  opacity: 0;
}
#login_button .q-hoverable:active .q-focus-helper {
  background: inherit;
  opacity: 0;
}
#login_button .q-focus-helper {
  opacity: 0;
  transition: unset;
}
.grey_scale{
  filter: grayscale(80%);
}
</style>-->
