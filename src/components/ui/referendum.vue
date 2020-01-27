<template>
  <div>
    <!--desktop-->
      <q-expansion-item icon-toggle>
        <template slot="header">
          <q-item-section side>
            <div class="row full-height items-center q-col-gutter-md">
              <div>
                <q-btn
                        class="vote-yes-btn"
                        icon="icon-ui-6"
                        round
                        color="positive"
                        :title="$t('referendum.vote_yes')"
                        @click.stop="voteYes" />
              </div>
              <div>
                <q-btn
                        class="vote-no-btn"
                        icon="icon-false"
                        round
                        color="negative"
                        :title="$t('referendum.vote_no')"
                        @click.stop="voteNo" />
              </div>
              <div>
                <q-btn
                        class="vote-abstain-btn"
                        icon="icon-false"
                        round
                        color="text-grey-6"
                        :title="$t('referendum.vote_abstain')"
                        @click.stop="voteAbstain" />
              </div>

            </div>
          </q-item-section>

          <q-item-section>
            <div class="q-ml-lg">
              <div class="text-h6">
                {{ data.title }}
              </div>
              <q-spinner-pie v-if="updating" />
              <div class="row q-gutter-md" v-else-if="!updating">
                <span class="text-positive">{{ $t("referendum.votes_yes") }}: <strong>{{ data.votes.yes }}</strong></span>
                <span class="text-negative">{{ $t("referendum.votes_no") }}: <strong>{{ data.votes.no }}</strong></span>
                <span class="text-grey-6">{{ $t("referendum.votes_abstain") }}: <strong>{{ data.votes.abstain }}</strong></span>
              </div>

            </div>
          </q-item-section>
          <q-item-section>
            {{data.expires}}
            {{data.status}}
          </q-item-section>

          <q-item-section side>
            <profile-pic :accountname="data.proposer" />
          </q-item-section>
        </template>
        <div class="q-pt-sm q-px-md">
          <q-scroll-area
            style="height: 500px;"
            :thumb-style="{
              right: '-13px',
              borderRadius: '2px',
              background: '--q-color-positive',
              width: '10px'
            }"
          >
            <MarkdownViewer
              v-if="data.content"
              :text="data.content"
            />
          </q-scroll-area>
        </div>
      </q-expansion-item>
    <q-separator />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import profilePic from 'components/ui/profile-pic'
import MarkdownViewer from 'components/ui/markdown-viewer'
export default {
  name: 'referendum',
  components: {
    MarkdownViewer,
    profilePic
  },

  props: {
    data: Object,
    updating: Boolean
  },

  data () {
    return {
      referendumcontract: this.$dir.getAccount(this.$dir.ACCOUNT_REFERENDUM),
      proposer: this.data.proposer || '',
      title: this.data.title || '',
      content: this.data.content || '',
      votes: {
        yes: 0,
        no: 0,
        abstain: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getCustodians: 'dac/getCustodians',
      getCustodianConfig: 'dac/getCustodianConfig',
      getTokenBalance: 'user/getDacBalance'
    })
  },
  methods: {
    getActions (vote) {
      return [
        {
          account: this.referendumcontract,
          name: 'vote',
          data: {
            voter: this.getAccountName,
            referendum_id: this.data.id,
            vote,
            dac_id: this.$dir.dacId
          }
        }
      ]
    },
    async voteYes () {
      const actions = this.getActions(1)
      const result = await this.$store.dispatch('user/transact', {
        actions
      })
      if (result) {
        console.log(result)
      }

      this.$emit('referendumvote', 'yes')
    },
    async voteNo () {
      const actions = this.getActions(2)
      const result = await this.$store.dispatch('user/transact', {
        actions
      })
      if (result) {
        console.log(result)
      }

      this.$emit('referendumvote', 'no')
    },
    async voteAbstain () {
      const actions = this.getActions(3)
      const result = await this.$store.dispatch('user/transact', {
        actions
      })
      if (result) {
        console.log(result)
      }

      this.$emit('referendumvote', 'abstain')
    }
  },
  watch: {}
}
</script>

<style lang="stylus">

</style>
