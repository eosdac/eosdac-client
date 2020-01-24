<template>
  <div class="row items-center">
      <div
        v-if="getSettingByName('toolbar_menu_items').value && getAccountName"
        class="row  justify-start gt-md q-mr-xl"
      >
        <q-item>
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.dactoken" />
          </q-item-section>
            <q-item-section>
                <q-item-label>{{ $t("default.your_token_balance", {tokenName: $dir.symbolCode}) }}</q-item-label>
                <q-item-label caption><xspan
                        :value="
                  $helper.toLocaleNumber(
                    getDacBalance,
                    $dir.symbolPrecision
                  )
                "
                />
                <q-icon
                  :name="$configFile.icon.liquid"
                  class="q-ml-xs"
                  :title="$t('default.liquid_balance')"
                />
                </q-item-label>
              <q-item-label caption><xspan
                      :value="
                  $helper.toLocaleNumber(
                    getStakedDacBalance,
                    $dir.symbolPrecision
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
            <q-item-label caption>
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
                class="q-ml-xs"
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
      class="animate-fade"
      :label="getAccountName"
      content-style="margin-top:15px;"
      content-class="rounded-borders"
    >
      <q-list link class="rounded-borders">
        <q-item-section class="text-center text-h6 q-pa-sm">
          {{ getAuthString }}
        </q-item-section>
        <q-item>
          <q-item-section avatar v-if="memberType !== 'non-member'">
            <q-icon :name="$configFile.icon.check" color="positive" />
          </q-item-section>
          <q-item-section v-else>
            <q-icon :name="$configFile.icon.pending_sand" color="warning" />
          </q-item-section>

          <q-item-section>
            <q-item-label v-if="memberType !== 'non-memberx'">{{$t("menu.member_status")}}</q-item-label>
            <q-item-label caption v-if="memberType !== 'non-memberx'">{{memberType}}</q-item-label>
            <div v-else caption>
              <q-btn
                color="primary"
                to="/constitution"
                size="md"
                :label="$t('menu.signature_required')"
              />
            </div>
          </q-item-section>
          <!-- <q-item-side right icon="info" color="amber" /> -->
        </q-item>

        <q-separator inset="item" />

        <q-item clickable v-if="getAccountName" :to="`/profile/` + getAccountName">
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.profile" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{$t('menu.profile')}}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/settings">
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.settings" />
          </q-item-section>
          <q-item-section>{{ $t("menu.settings") }}</q-item-section>
        </q-item>

        <q-item to="/constitution">
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.constitution" />
          </q-item-section>
          <q-item-section>{{ $t("menu.constitution") }}</q-item-section>
        </q-item>

        <q-separator inset="item" />

        <q-item
                clickable
                @click.native="$store.dispatch('global/switchAccount')"
        >
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.refresh" color="info" />
          </q-item-section>
          <q-item-section>{{ $t("menu.switch_account") }}</q-item-section>
        </q-item>
        <q-item clickable @click.native="$store.dispatch('global/logout')">
          <q-item-section avatar>
            <q-icon :name="$configFile.icon.account" color="negative" />
          </q-item-section>
          <q-item-section>{{$t('default.logout')}}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn
      size="lg"
      class="no-shadow animate-fade"
      icon="lock"
      v-if="!getAccountName"
      :label="$t('default.login')"
      @click="$store.dispatch('global/login')"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import profilePic from 'components/ui/profile-pic'
import xspan from 'components/ui/xspan'

export default {
  name: 'ToolbarMenu',
  components: {
    xspan,
    profilePic
  },
  data () {
    return {
      memberType: 'non-member'
    }
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
  },

  methods: {
    async updateMemberType () {
      if (this.getAccountName) {
        const p = await this.$profiles.getProfiles([this.getAccountName])
        console.log(`mounted`, p, this.getAccountName)
        if (p.length) {
          console.log(p)
          this.memberType = this.$helper.memberTypeToText(p[0].member_type)
          return
        }
      }

      this.memberType = 'non-member'
    }
  },

  watch: {
    getAccountName (accountName) {
      console.log(`Account name changed `, accountName)
    }
  },

  async mounted () {
    this.updateMemberType()
  }
}
</script>
