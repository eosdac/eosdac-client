<template>
  <div>
    <!--desktop-->
      <q-expansion-item
        icon-toggle
        label="First"
        group="candidates"
        header-class="candidate_header"
      >
        <template slot="header">
          <q-item-section side>
            <div class="row full-height items-center q-col-gutter-md">
              <div>
                <q-btn
                        v-if="!data.selected"
                        class="vote-btn"
                        icon="icon-plus"
                        round
                        color="primary"
                        @click.stop="$emit('clickvotefor')"
                /><q-btn
                      v-else
                      class="vote-btn"
                      icon="icon-ui-6"
                      round
                      color="positive"
                      @click.stop="$emit('clickunvotefor')"
              />
              </div>
              <div>
                <profile-pic :accountname="data.candidate_name" />
              </div>

            </div>
          </q-item-section>

          <q-item-section>
            <div class="q-ml-lg">
              <router-link class="text-h6" :to="{ path: '/profile/' + data.candidate_name }">
                {{ data.candidate_name }}
              </router-link>
              <span
                class="text-h6"
                v-if="
                  data.profile &&
                    (data.profile.givenName != '' ||
                      data.profile.familyName != '')
                "
                >({{ data.profile.givenName }}
                {{ data.profile.familyName }})</span
              >
              <br />
              <span>
                <span>{{ $t("candidate.votes") }}:</span>
                {{ $helper.toLocaleNumber(data.total_votes / 10000) }}
              </span>
              <span>
                <span class="q-pl-md">{{ $t("candidate.staked") }}:</span>
                {{ $helper.assetToLocaleNumber(data.locked_tokens) }}
              </span>
            </div>
          </q-item-section>
        </template>
        <div
          class="q-pt-sm q-px-md"
          style="border-top:1px solid grey; overflow-x: hidden"
        >
          <q-scroll-area
            style="width: 100%; height: 300px;"
            :thumb-style="{
              right: '-13px',
              borderRadius: '2px',
              backgroundColor: 'var(--q-color-primary)',
              width: '10px',
              opacity: 0.8
            }"
            class="inline-doc"
          >
            <div class="q-my-md">
              <div class="float-right">
                <span
                  >{{ $t("candidate.requestedpay") }}: </span
                >{{ $helper.assetToLocaleNumber(data.requestedpay) }}
              </div>
            </div>
            <!--<div class="q-body-1" style="overflow:hidden; white-space: pre-wrap;" v-if="data.profile !== undefined">{{data.profile.description}}</div>-->
            <MarkdownViewer
              v-if="data.profile"
              :tags="[
                'h1',
                'h2',
                'h3',
                'italic',
                'bold',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                'anchor',
                'orderedlist',
                'unorderedlist'
              ]"
              :text="data.profile.description"
            />
          </q-scroll-area>
          <div class="row justify-between items-center full-height q-pb-sm">
            <q-separator v-if="sociallinks && sociallinks.length" />
            <SocialLinks :links="sociallinks" />
            <a target="_blank" :href="website" class="a2">{{ website }}</a>
          </div>
        </div>
      </q-expansion-item>
    <q-separator color="warning" v-if="position == getCustodianConfig.numelected - 1" />
    <q-separator v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SocialLinks from 'components/ui/social-links'
import profilePic from 'components/ui/profile-pic'
// import voteAnimation from 'components/ui/vote-animation'
import MarkdownViewer from 'components/ui/markdown-viewer'
export default {
  name: 'Candidate',
  components: {
    SocialLinks,
    MarkdownViewer,
    // voteAnimation,
    profilePic
  },

  props: {
    data: Object,
    position: Number
  },

  data () {
    return {
      profileImage: this.data.profile.image || this.$profiles.default_avatar,
      sociallinks: this.data.profile.sameAs
        ? this.data.profile.sameAs.map(p => p.link)
        : [],
      website: this.data.profile.url || '',
      profilemodal: false,
      vote_delta: 0
    }
  },
  computed: {
    ...mapGetters({
      getCustodians: 'dac/getCustodians',
      getCustodianConfig: 'dac/getCustodianConfig',
      getTokenBalance: 'user/getDacBalance'
    }),
    is_custodian () {
      if (this.getCustodians) {
        return this.getCustodians.find(
          c => this.data.candidate_name === c.cust_name
        )
      } else {
        return false
      }
    }
  },
  methods: {},
  watch: {
    'data.total_votes': function (newVal, oldVal) {
      this.vote_delta = parseInt(newVal) - parseInt(oldVal)
    }
  }
}
</script>
<style lang="stylus">
/*@import '~variables'*/

.candidate_header{
  height:80px;
  border-radius:2px;
}

.selected_candidate{
  border:2px solid var(--q-color-positive);
  transition : border 400ms ease;
}

.unselected_candidate{
  border:2px solid transparent;
  transition : border 400ms ease;
}
</style>
