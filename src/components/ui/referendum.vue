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
              <q-item-label>
                  {{ data.title }}
              </q-item-label>
              <q-item-label caption>
                  <MarkdownViewer
                          :tags="[]"
                          :text="data.content.replace(/\n/g, ' ').replace(/#/g, '')"
                          :maxlen="140"
                  />
              </q-item-label>
          </q-item-section>

            <q-item-section class="q-ml-lg">
                <q-spinner-pie v-if="updating" />
                <div v-else-if="!updating">
                    <div style="height:10px;margin-bottom:10px" class="full-width">
                        <div class="bg-positive" :style="{
                        width: `${100 * (data.votes.yes / (data.votes.yes + data.votes.no + data.votes.abstain))}%`,
                        height: '10px',
                        display: 'inline-block'
                      }"></div>
                        <div class="bg-negative" :style="{
                        width: `${100 * (data.votes.no / (data.votes.yes + data.votes.no + data.votes.abstain))}%`,
                        height: '10px',
                        display: 'inline-block'
                      }"></div>
                        <div class="bg-grey-6" :style="{
                        width: `${100 * (data.votes.abstain / (data.votes.yes + data.votes.no + data.votes.abstain))}%`,
                        height: '10px',
                        display: 'inline-block'
                      }"></div>
                    </div>

                    <div>
                        <span class="text-positive">{{ $t("referendum.votes_yes") }}: <strong>{{ data.votes.yes }}</strong></span>
                        <span class="text-negative"> {{ $t("referendum.votes_no") }}: <strong>{{ data.votes.no }}</strong></span>
                        <span class="text-grey-6"> {{ $t("referendum.votes_abstain") }}: <strong>{{ data.votes.abstain }}</strong></span>
                    </div>

                </div>
                <div v-if="data.status === 0">
                    <q-linear-progress
                            v-if="percentRemaining"
                            :value="percentRemaining"
                            :color="(percentRemaining > 0.1) ? 'secondary' : 'negative'"
                            style="height: 8px"
                    />
                    <countdown
                            v-if="msRemaining && !showUpdateButton"
                            :time="Number(msRemaining)"
                            @end="countdownEnded"
                    >
                        <template slot-scope="props">
                            <div class="text-weight-light q-mb-xs">
                                <span v-if="props.days">{{ props.days }} {{$t('general.days')}}, </span>
                                <span v-if="props.hours">{{ props.hours }} {{$t('general.hours')}}, </span>
                                <span v-if="props.minutes">{{ props.minutes }} {{$t('general.minutes')}}, </span>
                                <span>{{ props.seconds }} {{$t('general.seconds')}}</span>
                            </div>
                        </template>
                    </countdown>
                    <div v-else-if="showUpdateButton" class="q-caption text-weight-light q-mb-xs text-negative">
                        This referendum has now ended. <q-btn @click.stop="updateStatus" color="info">calculate result</q-btn>
                    </div>

                </div>
            </q-item-section>

          <q-item-section side>
            <profile-pic :accountname="data.proposer" />
          </q-item-section>
        </template>
        <div class="q-pt-sm q-px-md">
            <div>{{data.id}}</div>
          <q-scroll-area
            style="height: 500px;"
            :thumb-style="{
              right: '-13px',
              borderRadius: '2px',
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
import countdown from '@chenfengyuan/vue-countdown'
export default {
  name: 'referendum',
  components: {
    MarkdownViewer,
    profilePic,
    countdown
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
      },
      percentRemaining: 0,
      updatePercentRemainingTimer: null,
      showUpdateButton: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getCustodians: 'dac/getCustodians',
      getReferendumConfig: 'dac/getReferendumConfig',
      getTokenBalance: 'user/getDacBalance'
    }),
    msRemaining () {
      // console.log(`updateMsRemaining`, this.getReferendumConfig.duration)
      let remaining = null
      if (this.data.expires) {
        const expiresMs = Date.parse(this.data.expires)
        const now = new Date().getTime()
        remaining = Math.max(0, expiresMs - now)
      }

      return remaining
    }
  },
  methods: {
    countdownEnded () {
      console.log('msRemaining ENDED')
      this.showUpdateButton = true
    },
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
    },
    async updateStatus () {
      const actions = [
        {
          account: this.referendumcontract,
          name: 'updatestatus',
          data: {
            referendum_id: this.data.id,
            dac_id: this.$dir.dacId
          }
        }
      ]
      const result = await this.$store.dispatch('user/transact', {
        actions
      })
      if (result) {
        console.log(result)
      }

      // this.$emit('referendumvote', 'abstain')
    },
    updatePercentRemaining () {
      this.showUpdateButton = false
      const expiresMs = Date.parse(this.data.expires)
      const now = new Date().getTime()
      const remaining = Math.max(0, expiresMs - now)
      if (!remaining && this.updatePercentRemainingTimer) {
        console.log(`clearing timer ${remaining}`)
        clearInterval(this.updatePercentRemainingTimer)
        this.showUpdateButton = true
      }
      this.percentRemaining = (remaining / this.getReferendumConfig.duration) / 1000
    }

  },

  mounted () {
    console.log('mounted')
    this.updatePercentRemaining()
    this.updatePercentRemainingTimer = setInterval(this.updatePercentRemaining, 1000)
  },

  watch: {
    data: function () {
      this.updatePercentRemaining()
    }
  }
}
</script>

<style lang="stylus">

</style>
