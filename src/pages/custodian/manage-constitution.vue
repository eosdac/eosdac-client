<template>
  <q-page class="q-pa-md">
    <p class="text-text2">
      Review the constitution history and propose constitution updates.
    </p>
    <div class="">
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-md-5 animate-fade">
          <q-card>
            <q-card-section class="bg-primary q-pa-xs">
              <q-item>
                <q-item-section avatar>
                  <q-icon :name="$configFile.icon.dactoken" />
                </q-item-section>
                <q-item-section class="text-h6">
                  Constitution History
                </q-item-section>
              </q-item>

            </q-card-section>

            <q-card-section>
                <q-list no-border separator highlight>
                  <q-item v-for="(mt, i) in getParsedMemberTerms" :key="`mt${i}`">
                    <q-item-section side>
                      <q-icon :name="$configFile.icon.constitution" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <div class="overflow-hidden">
                          <span>Version {{ mt.version }} </span>
                          <span class="q-caption text-text2">{{ mt.hash }}</span>
                        </div>
                      </q-item-label>
                      <q-item-label caption>
                        <div
                                style="white-space: nowrap;"
                                class=" overflow-hidden"
                        >
                          <a
                                  class=" q-caption"
                                  target="_blank"
                                  :href="mt.terms"
                          >{{ mt.terms }}</a
                          >
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side style="min-width:65px">
                      <q-btn
                              v-if="mt.hash != md5_constitution"
                              color="info"
                              class="animate-fade"
                              flat
                              size="sm"
                              label="load"
                              @click="setConstitution(mt.terms)"
                      />
                      <q-icon
                              v-else
                              name="check"
                              size="24px"
                              color="positive"
                              class="animate-fade"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-md-7 animate-fade">

          <q-card>
            <q-card-section class="bg-primary q-pa-xs">
              <q-item>
                <q-item-section avatar>
                  <q-icon :name="$configFile.icon.dactoken" />
                </q-item-section>
                <q-item-section class="text-h6">
                  New Constitution
                </q-item-section>
              </q-item>

            </q-card-section>

            <q-card-section>
              <div class="q-pa-md column justify-between " style="height:250px">
                <div class="row items-center no-wrap">
                  <q-input
                          class="full-width "
                          color="primary-light"
                          v-model="new_constitution_url"
                          stack-label="Constitution URL"
                          placeholder="Input URL to Constitution"
                          @input="urlChanged"
                  />
                  <div>
                    <q-btn
                            label="load"
                            @click="setConstitution(new_constitution_url)"
                            color="primary"
                            :loading="isloading"
                            class="on-right animate-fade"
                    />
                  </div>
                </div>
                <div class="row no-wrap items-center" v-if="getIsNewConstitution === true">
                  <div>
                    <q-btn label="Update" @click="updateConstitution" color="primary" />
                  </div>
                  <div class="q-caption text-positive q-pa-sm">
                    New constitution detected. Please review the constitution and
                    verify the md5 hash before updating. The constitution change
                    will be put up for voting via msig.
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-xs-12 animate-scale">
          <div class="q-pa-md rounded-borders bg-bg1 shadow-4">
            <div v-if="parsed_constitution != ''">
              <div class="row q-pb-md justify-end">
                <xspan :value="md5_constitution" />
              </div>
              <div
                class="markdown-body animate-fade q-pa-md inline-doc"
                v-html="parsed_constitution"
              ></div>
            </div>
            <div v-if="!isloading && parsed_constitution === ''">
              No constitution loaded
            </div>
            <div v-if="isloading" class="animate-fade">loading...</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
const CryptoJS = require('crypto-js')
// import helpBtn from 'components/controls/help-btn'
import marked from 'marked'
import xspan from 'components/ui/xspan'

import { mapGetters } from 'vuex'
export default {
  components: {
    xspan
  },
  data () {
    return {
      isloading: false,
      raw_constitution: false,
      parsed_constitution: '',
      md5_constitution: '',
      new_constitution_url: '',
      constitution_version_descending: true
    }
  },
  computed: {
    ...mapGetters({
      getMemberTerms: 'dac/getMemberTerms',
      getLatestMemberTerm: 'dac/getLatestMemberTerm',
      getAccountName: 'user/getAccountName',
      getIsLoaded: 'dac/getIsLoaded'
    }),
    getIsNewConstitution () {
      if (!this.getMemberTerms || !this.md5_constitution) return null
      return !this.getMemberTerms.find(mt => mt.hash === this.md5_constitution)
    },
    getParsedMemberTerms () {
      if (!this.getMemberTerms) return []
      let clone = JSON.parse(JSON.stringify(this.getMemberTerms))
      if (this.constitution_version_descending) {
        return clone.reverse()
      } else {
        return clone
      }

      // return [...clone, ...clone, ...clone, ...clone, ...clone];
    }
  },

  methods: {
    async setConstitution (url) {
      this.parsed_constitution = ''
      this.md5_constitution = null
      this.raw_constitution = false
      if (!url) {
        this.md5_constitution = ''
        return
      }
      this.isloading = true
      try {
        let getCt = await this.loadConstitutionFromUrl(url)
        if (!getCt) {
          this.md5_constitution = ''
          this.isloading = false
          return
        }
        this.raw_constitution = getCt
        this.md5_constitution = CryptoJS.MD5(getCt).toString()

        this.parsed_constitution =
          '<span class="animate-fade">' +
          marked(getCt, { sanitize: true }) +
          '</span>'
        this.isloading = false
      } catch (e) {
        console.log(e)
        this.isloading = false
        this.md5_constitution = ''
      }
    },

    async loadConstitutionFromUrl (url) {
      let options = {
        method: 'GET',
        url: url,
        timeout: 5000
      }
      try {
        let constitution = await this.$axios(options)
        return constitution.data
      } catch (err) {
        return false
      }
    },

    urlChanged () {
      this.md5_constitution = ''
      this.parsed_constitution = ''
    },

    async updateConstitution () {
      if (this.new_constitution_url === '' || this.md5_constitution === '') { return }
      let action = {
        account: this.$dir.symbol.contract,
        name: 'newmemtermse', // xxxxx
        data: {
          terms: this.new_constitution_url,
          hash: this.md5_constitution,
          dac_id: this.$dir.dacId
        },
        authorization: [
          {
            actor: this.$dir.symbol.contract,
            permission: 'active'
          }
        ]
      }
      let res = await this.$store.dispatch('user/proposeMsig', {
        actions: [action],
        title: `Update constitution`,
        description: `Update the constitution with ${this.new_constitution_url} \nhash: ${this.md5_constitution}`
      })
      console.log(res)
    }
  },

  watch: {}
}
</script>
<!--
<style lang="stylus">
@import '~variables'
</style>-->
