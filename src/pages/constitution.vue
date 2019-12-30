<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-lg">
      <!-- first column  -->
      <div class="col-xs-12 col-lg-8">
          <div class="constitution-body">
            <div
              v-if="constitution != ''"
              class="markdown-body animate-fade inline-doc"
              v-html="constitution"
            ></div>
          </div>
      </div>

      <!-- second column -->
      <div class="col-xs-12 col-lg-4">
        <div>
          <div
            id="registerbox"
            class="bg-logo q-pa-md round-borders shadow-4 relative-position"
            style="overflow:hidden"
          >
            <q-item>
                <q-item-section avatar>
                  <q-icon :name="$configFile.icon.constitution" />
                </q-item-section>

                <q-item-section>{{$t("default.constitution")}}</q-item-section>

                <q-item-section>
                  version <xspan :value="getLatestMemberTerm.version"></xspan>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                  <q-icon :name="$configFile.icon.check" />
                </q-item-section>

                <q-item-section>{{$t("constitution.hash")}}</q-item-section>

                <q-item-section>
                  <xspan :value="getLatestMemberTerm.hash"></xspan>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section avatar>
                  <q-icon :name="$configFile.icon.link" />
                </q-item-section>

                <q-item-section>{{$t("constitution.direct_link")}}</q-item-section>

                <q-item-section>
                  <span><a target="_blank" :href="getLatestMemberTerm.terms">{{
                      getLatestMemberTerm.terms
                    }}</a></span>
                </q-item-section>

            </q-item>

            <!-- <q-item-side left>dd</q-item-side> -->
            <div class="row justify-end items-center">
              <div v-if="needSignature" class="text-negative q-caption q-my-sm">
                {{
                  $t("constitution.not_signed_message", {
                    dacname: $configFile.get("dacname")
                  })
                }}
              </div>
              <q-btn
                v-if="needSignature"
                class="on-right"
                @click="signConstitution()"
                color="primary"
                :label="$t('constitution.sign')"
              />
              <div
                v-if="!needSignature"
                class="text-positive q-caption q-my-sm"
              >
                {{ $t("constitution.signed_message") }}
              </div>
              <q-btn
                v-if="!needSignature"
                class="on-right"
                @click="unRegister()"
                color="primary"
                :label="$t('constitution.unsign')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-scroll-observable @scroll="userHasScrolled" />

    <!--<debug-data
      :data="[
        {
          getMemberTerms: getMemberTerms,
          getAgreedTermsVersion: getAgreedTermsVersion
        }
      ]"
    />-->
  </q-page>
</template>

<script>
const CryptoJS = require('crypto-js')
import marked from 'marked'
import xspan from 'components/ui/xspan'
// import debugData from 'components/ui/debug-data'

import { mapGetters } from 'vuex'
export default {
  components: {
    xspan
  },
  data () {
    return {
      isloading: false,
      constitution: '',

      md5_constitution: '',

      latestMemberTerms: this.getLatestMemberTerm || {}
    }
  },
  computed: {
    ...mapGetters({
      getMemberTerms: 'dac/getMemberTerms',
      getLatestMemberTerm: 'dac/getLatestMemberTerm',
      getAccountName: 'user/getAccountName',
      getAgreedTermsVersion: 'user/getAgreedTermsVersion',
      getIsLoaded: 'dac/getIsLoaded'
    }),

    needSignature () {
      if (
        this.getLatestMemberTerm &&
        this.getAgreedTermsVersion &&
        this.getLatestMemberTerm.version === this.getAgreedTermsVersion
      ) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
    async getConstitution () {
      if (!this.getLatestMemberTerm.terms) return
      this.isloading = true
      try {
        let getCt = await this.loadConstitutionFromGithub(
          this.getLatestMemberTerm.terms
        )
        this.md5_constitution = CryptoJS.MD5(getCt).toString()

        // check if the fetched constitution matches the contract hash
        // if(this.md5_constitution === this.latestMemberTerms.hash){
        //   console.log('Constitution verified! Hashes match!')
        // }

        this.constitution =
          '<span class="animate-fade">' +
          marked(getCt, { sanitize: true }) +
          '</span>'
        this.isloading = false
      } catch (e) {
        console.log(e)
        this.isloading = false
      }
    },

    async loadConstitutionFromGithub (url) {
      try {
        let constitution = await this.$axios.get(url)
        return constitution.data
      } catch (err) {
        throw err
      }
    },

    async signConstitution () {
      let actions = [
        {
          account: this.$configFile.get('tokencontract'),
          name: 'memberrege',
          data: {
            sender: this.getAccountName,
            agreedterms: this.md5_constitution,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.$store.commit(
          'user/setAgreedTermsVersion',
          this.getLatestMemberTerm.version
        )
      }
    },

    async unRegister () {
      let actions = [
        {
          account: this.$configFile.get('tokencontract'),
          name: 'memberunrege',
          data: {
            sender: this.getAccountName,
            dac_id: this.$configFile.get('dacid')
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.$store.commit('user/setAgreedTermsVersion', false)
      }
    },

    async checkRegistered () {
      // let memberRegistration = await this.$store.dispatch('api/getRegistered');
      // let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
    },

    userHasScrolled (scroll) {
      const votebox = document.getElementById('registerbox')
      if (scroll.position < 40 || window.innerWidth < 1199) {
        votebox.style.top = '0px'
        return false
      }
      // console.log(`votebox: ${offset(votebox).top} scroll: ${scroll.position}`);
      votebox.style.top = scroll.position + 'px'
    }
  },

  mounted: function () {
    if (this.getLatestMemberTerm) {
      this.getConstitution()
    }
  },
  watch: {
    // getLatestMemberTerm (oldval, newval) {
    //   console.log(oldval, newval)
    //   if(newval.terms){
    //     this.getConstitution();
    //   }
    // },
    // getMemberTerms (oldval, newval) {
    //   if(newval && newval[0] ){
    //     this.getConstitution();
    //   }
    // },
    getIsLoaded () {
      this.getConstitution()
    }
  }
}
</script>

<style lang="stylus">
.constitution-body
  min-height: 300px

#registerbox
    overflow hidden
</style>
