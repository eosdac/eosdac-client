<template>
  <q-page>
    <div
      class="gradient-bg-primary q-px-md q-pt-md relative-position"
      style="min-height:260px"
    >
      <div class="text-h2">
        {{ account_name }}
      </div>
      <q-space />

      <div class="row">
        <div class="col-md-2 animate-pop profile_image_outer_wrap">
          <q-btn
                  v-if="is_edit"
                  round
                  size="md"
                  class="animate-pop"
                  color="primary"
                  icon="icon-plus"
                  style="position:absolute;bottom:0;right:7px;z-index:2"
                  @click="profile_pic_modal = true"
          />
          <div class="fit profile_image_inner_wrap">
            <div
                    v-if="img_loaded"
                    class="profile_image profile_image_border relative-position animate-fade"
                    style="height:140px; width:140px;"
                    v-bind:style="{ 'background-image': `url(${setImgSrc})` }"
            ></div>
            <q-spinner-pie
                    color="primary"
                    class="hack_center"
                    v-if="!img_loaded"
                    size="139px"
            />
          </div>
        </div>
        <div class="col-md-10 blur-details">
          <div class="row profile_header_bottom_row">
            <div class="col-md-2 col-xs-6 q-pr-sm">
              <div class=" q-caption uppercase">
                {{ $t("profile.givenName") }}
              </div>
              <q-input
                      :readonly="!is_edit"
                      :hide-underline="!is_edit"
                      v-model="form.givenName"
              />
            </div>
            <div class="col-md-2 col-xs-6 q-pr-sm">
              <div class=" q-caption uppercase">
                {{ $t("profile.familyName") }}
              </div>
              <q-input
                      :readonly="!is_edit"
                      :hide-underline="!is_edit"
                      v-model="form.familyName"
              />
            </div>
            <!-- <div class="col-md-2 col-xs-6 q-pr-sm">
              <div class=" q-caption uppercase">
                {{ $t("profile.gender") }}
              </div>
              <q-select
                      class
                      :readonly="!is_edit"
                      :hide-underline="!is_edit"
                      v-model="form.gender"
                      :options="[
                { label: $t('profile.female'), value: 'female' },
                { label: $t('profile.male'), value: 'male' },
                { label: $t('profile.other'), value: 'other' }
              ]"
              />
            </div> -->
            <div class="col-md-2 col-xs-6">
              <div class=" q-caption uppercase">Type</div>
              <div>{{ form.member_type }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- end header gradient -->

    <div class="q-px-md">
      <div
        class="row q-mt-md gutters-md rounded-borders shadow-4"
        style="min-height:265px"
      >
        <div class="col-md-8 col-xs-12 q-pa-md">
          <div class style="height:100%">
            <div class="q-title q-mb-md">{{ $t("profile.bio") }}</div>
            <MarkdownViewer
              :edit="is_edit"
              :text="form.description"
              v-on:update="updateText"
            />
          </div>
        </div>

        <div class="col-md-4 col-xs-12 q-pa-md">
          <div class="column justify-between" style="height:100%">
            <!-- on display -->
            <div v-if="!is_edit">
              <div class="q-title q-mb-md">{{ $t("profile.website") }}</div>
              <div v-if="$helper.isUrl(form.url)" class="q-body-1 a2">
                <a target="_blank" :href="form.url">{{ form.url }}</a>
              </div>
              <div class="q-mt-md">
                <SocialLinks :links="form.sameAs.map(x => x.link)" />
              </div>
            </div>

            <!-- on is_edit -->
            <div v-if="is_edit">
              <div class="q-title q-mb-md">{{ $t("profile.website") }}</div>
              <q-input
                color="p-light"
                type="url"
                v-model="form.url"
                placeholder="http://example.com"
              />
              <q-input
                color="p-light"
                type="url"
                class="q-mt-md q-mb-md"
                v-model="social.link"
                v-for="(social, i) in form.sameAs"
                :key="i"
                :float-label="`${$t('profile.social_link')} ${i + 1}`"
                :placeholder="$t('profile.social_profile_link')"
              />
              <q-btn
                round
                color="primary"
                @click="addSocial"
                icon="icon-plus"
                @blur.native="maxLinksmsg = ''"
              />
              <span v-if="maxLinksmsg != ''" class="animate-fade on-right">{{
                maxLinksmsg
              }}</span>
            </div>

            <div v-if="allow_edit" class="row gutter-sm justify-end q-mt-md">
              <div>
                <q-btn
                  v-if="!is_edit"
                  size="md"
                  class="animate-pop"
                  color="primary"
                  @click="is_edit = !is_edit"
                  :label="$t('profile.edit')"
                />
                <q-btn
                  v-else
                  size="md"
                  class="animate-pop"
                  color="positive"
                  @click="saveProfile"
                  :label="$t('profile.save')"
                />
              </div>
              <div>
                <q-btn
                  v-if="is_edit"
                  size="md"
                  class="animate-pop"
                  color="red"
                  @click="is_edit = !is_edit"
                  :label="$t('profile.cancel')"
                />
                <!-- <q-btn size="md" class="animate-pop" color="dark" @click="download(JSON.stringify(form),`${getAccountName}_eosdac_profile.json`, 'application/json')" :label="$t('profile.download')" /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="form.timezone != ''" class="q-pa-md q-my-md">
      <TimeZone :offset="Number(form.timezone)" />
    </div>

    <q-dialog v-model="profile_pic_modal" persistent @hide="handleModalClose">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t("profile.profile_picture_url") }} (https)</div>
        </q-card-section>

        <q-card-section>
          <q-input
                  type="url"
                  v-model="form.image"
                  class="q-mt-md"
                  :float-label="$t('profile.profile_picture_url')"
                  placeholder="https://example.site/mypic.jpg"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('profile.cancel')" v-close-popup />
          <q-btn flat :label="$t('profile.set_picture')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { Notify, openURL } from 'quasar'
import SocialLinks from 'components/ui/social-links'
import ProfileTemplate from '../extensions/statics/config/profile.template.json'
import MarkdownViewer from 'components/ui/markdown-viewer'
import { mapGetters } from 'vuex'

export default {
  components: {
    SocialLinks,
    MarkdownViewer
  },
  data () {
    return {
      account_name: '',
      is_edit: false,
      allow_edit: false,
      profile_pic_modal: false,

      img_loaded: true,
      form: ProfileTemplate,
      maxLinksmsg: ''
    }
  },

  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName'
    }),
    setImgSrc () {
      let image = this.$profiles.default_avatar // default image
      if (this.form.image.startsWith('http:')) {
        console.log('need https image')
        Notify.create({
          message: this.$t('profile.http_error'),
          timeout: 5000,
          type: 'negative',
          position: 'bottom-right', // 'top', 'left', 'bottom-left' etc.
          closeBtn: true // or string as button message e.g. 'dismiss'
        })
        return image
      }
      if (this.$helper.isUrl(this.form.image)) {
        image = this.form.image
      }
      return image
    }
  },

  methods: {
    openURL,
    updateText (val) {
      this.form.description = val
    },
    // init profile page
    initProfile () {
      this.account_name = this.$route.params.accountname
      // load profile
      this.getProfileData()
    },

    memberTypeToText (type) {
      switch (type) {
        case 0:
          return 'Non-Member'
        case 1:
          return 'Member'
        case 2:
          return 'Candidate'
        case 3:
          return 'Custodian'
      }
    },

    async getProfileData () {
      let p = await this.$profiles.getProfiles([this.account_name])
      if (p && p.length && this.validateProfile(p[0].profile)) {
        // todo validate profile
        this.form = p[0].profile
        this.form.member_type = this.memberTypeToText(p[0].member_type)
        this.allow_edit = this.account_name === this.getAccountName
      } else {
        this.allow_edit = this.account_name === this.getAccountName
      }
    },

    validateProfile (profile) {
      let validkeys = Object.keys(ProfileTemplate)

      let valid = validkeys.every(function (key) {
        return profile.hasOwnProperty(key)
      })
      // loop over keys to see if types match
      if (valid) {
        console.log('Fetched profile is valid')
      } else {
        console.log('Fetched profile is not valid')
      }
      return valid
    },

    async saveProfile () {
      this.deleteEmptyLinks()
      this.form.timezone = new Date().getTimezoneOffset()

      let actions = [
        {
          account: this.$dir.getAccount(this.$dir.ACCOUNT_CUSTODIAN),
          name: 'stprofile',
          data: {
            cand: this.getAccountName,
            profile: JSON.stringify(this.form),
            dac_id: this.$dir.dacId
          }
        }
      ]

      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.saveProfileSuccessCallback()
      }
    },

    async saveProfileSuccessCallback () {
      this.is_edit = false
      await this.$profiles.removeFromCache([this.getAccountName])

      this.$store.commit('user/setProfilePicture', this.form.image)
    },

    addSocial () {
      let max = 4
      this.deleteEmptyLinks()
      if (this.form.sameAs.length < max) {
        this.form.sameAs.push({ link: '' })
      } else {
        this.maxLinksmsg = this.$t('profile.maxLinksmsg', {
          number_allowed_links: max
        })
      }
    },

    deleteEmptyLinks () {
      this.form.sameAs = this.form.sameAs.filter(item => {
        return item.link !== '' && this.$helper.isUrl(item.link)
      })
    },

    handleModalClose () {
      setTimeout(() => {
        if (!this.img_loaded) {
          this.form.image = ''
        }
      }, 300)
    },

    download (content, fileName, contentType) {
      var a = document.createElement('a')
      var file = new Blob([content], { type: contentType })
      a.href = URL.createObjectURL(file)
      a.download = fileName
      a.click()
    }
  },

  mounted: function () {
    this.initProfile()
  },
  watch: {
    $route: function () {
      this.initProfile()
    },
    getAccountName: function (val) {
      this.allow_edit = this.account_name === val
    }
  }
}
</script>
