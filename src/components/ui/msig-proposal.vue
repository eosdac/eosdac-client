<template>
  <div class="proposal-container">
    <q-expansion-item
        icon-toggle
        group="msigproposals"
        header-class="msigproposal_header"
        :collapse-icon="$configFile.icon.collapse"
        @show="handleIsSeenCache(true)"
    >
      <template v-slot:header>
        <q-item-section avatar>
          <q-icon
                  size="48px"
                  :name="'icon-' + matchIcon"
                  :color="getStatusColor"
          />
        </q-item-section>
        <q-item-section style="overflow: hidden">
          <q-item-label>
            <q-badge
                    v-if="!is_seen_computed"
                    transparent outline
                    color="negative">{{$t('proposal.new')}}</q-badge>
            {{ msig.title }}

          </q-item-label>
          <q-item-label caption>
            <MarkdownViewer
                    :tags="[]"
                    :text="msig.description.replace(/\n/g, ' ').replace(/#/g, '')"
                    :maxlen="140"
            />
          </q-item-label>
        </q-item-section>

        <q-item-section class="xs-hide">
          <q-item-label>{{$t('proposal.expiration')}}: </q-item-label>
          <q-item-label caption>{{
                  new Date(msig.trx.expiration).toUTCString()
                }}</q-item-label>
        </q-item-section>

        <q-item-section style="max-width: 10%">
          <q-linear-progress :value="msig.provided_approvals.length / msig.threshold" style="height:15px" color="positive" />
          <q-item-label caption @click.stop="approvals_modal = true">
            <span v-if="msig.provided_approvals" class="text-h6">{{ msig.provided_approvals.length }}/{{ msig.threshold }}</span>
          </q-item-label>
        </q-item-section>
        </template>

      <div class="row q-pa-md q-col-gutter-md">

        <div class="col-md-8">
          <q-card class="full-height">
            <q-card-section>
              <MarkdownViewer
                      :text="msig.description"
              />
            </q-card-section>
          </q-card>

        </div>
        <div class="col-md-4">
          <q-card>
            <!-- Proposal name -->
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{$t('proposal.proposal_name')}}
                  </q-item-label>
                  <q-item-label caption>
                    <a
                      target="_blank"
                      :href="$configFile.get('explorer_msig').replace('{proposer}', msig.proposer).replace('{proposal_name}', msig.proposal_name)"
                      >{{ msig.proposal_name }}</a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <!-- Proposal transaction id -->
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{$t('proposal.trx')}}
                  </q-item-label>
                  <q-item-label caption>
                    <a
                      target="_blank"
                      :href="$configFile.get('explorer_transaction').replace('{transaction_id}', msig.trxid)"
                      >{{ $helper.truncate(msig.trxid, 20) }}</a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <!-- Proposed by -->
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{$t('proposal.proposed_by')}}
                  </q-item-label>
                  <q-item-label caption>
                    <router-link :to="{ path: '/profile/' + msig.proposer }">{{msig.proposer }}</router-link>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <!-- Executed by -->
            <q-card-section v-if="msig.executer">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{$t('proposal.executed_by')}}
                  </q-item-label>
                  <q-item-label caption>
                    <router-link :to="{ path: '/profile/' + msig.executer }">{{msig.executer}}</router-link>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <!-- Executed transaction id -->
            <q-card-section v-if="msig.executed_trxid">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    {{$t('proposal.executed_trx')}}
                  </q-item-label>
                  <q-item-label caption>
                    <a
                            target="_blank"
                            :href="$configFile.get('explorer_transaction').replace('{transaction_id}', msig.executed_trxid)"
                    >{{ $helper.truncate(msig.executed_trxid, 20) }}</a>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section class="">
              <Actionparser
                      @seenAllActions="disable_approve = false"
                      :actions="msig.trx.actions"
              />
            </q-card-section>

            <q-card-actions align="right" v-if="!read_only">

              <q-btn-group v-if="msig.status === 1">
                <q-btn
                        v-if="!isApproved"
                        color="positive"
                        :label="$t('proposal.approve')"
                        @click="approveProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        v-if="isApproved"
                        color="negative"
                        :label="$t('proposal.unapprove')"
                        @click="unapproveProposal(msig.proposer, msig.proposal_name)"
                />
                <!--<q-btn
                        v-if="!isDenied"
                        color="negative"
                        :label="$t('proposal.deny')"
                        @click="denyProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        v-if="isDenied"
                        color="negative"
                        :label="$t('proposal.undeny')"
                        @click="undenyProposal(msig.proposer, msig.proposal_name)"
                />-->
                <q-btn
                        v-if="isCreator"
                        color="negative"
                        flat
                        :label="$t('proposal.cancel')"
                        @click="cancelProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        v-if="isExecutable"
                        color="info"
                        :label="$t('proposal.execute')"
                        @click="executeProposal(msig.proposer, msig.proposal_name)"
                />
              </q-btn-group>
              <q-btn-group v-if="msig.status === 3">
                <q-btn
                        v-if="isCreator"
                        color="negative"
                        :label="$t('proposal.cancel')"
                        @click="cancelProposal(msig.proposer, msig.proposal_name)"
                />
                <q-btn
                        color="positive"
                        :label="$t('proposal.resubmit')"
                        @click="resubmit(msig)"
                />
              </q-btn-group>
            </q-card-actions>
          </q-card>
        </div>

      </div>
    </q-expansion-item>

    <q-separator />

    <!-- modal for displaying approvals mobile+desktop -->
    <q-dialog minimized v-model="approvals_modal">
      <q-card>
        <!-- header -->
        <q-card-section>
          <div class="text-h6">
            {{$t('proposal.approvals')}}
          </div>
          <div v-if="msig.provided_approvals" class="text-weight-thin">needs {{ msig.threshold - msig.provided_approvals.length }} more</div>
        </q-card-section>
        <!-- content -->
        <q-card-section class="q-pa-md">
          <div class="row justify-start q-mt-sm">
            <!-- <pre>{{provided_approvals}}</pre> -->
            <div
              class="row items-center relative-position rounded-borders q-pr-md q-ma-sm"
              v-for="(c, i) in msig.provided_approvals"
              :key="i + 'p'"
            >
              <profile-pic
                :accountname="c.actor"
                :scale="0.5"
                :show_role="true"
              />
              <router-link class=" a2" :to="{ path: '/profile/' + c.actor }">
                <div class="q-ma-none" style="min-width:100px; overflow:hidden">
                  {{ c.actor }}
                </div>
                <div class="q-caption">@{{ c.permission }}</div>
              </router-link>

              <q-icon
                class="absolute"
                style="top:-5px; right:-10px"
                color="positive"
                :name="$configFile.icon.check"
                size="24px"
              />
            </div>

            <div
              class="row items-center relative-position rounded-borders q-pr-md q-ma-sm"
              v-for="(c, i) in msig.requested_approvals"
              :key="i + 'r'"
            >
              <profile-pic
                :accountname="c.actor"
                :scale="0.5"
                :show_role="true"
              />
              <router-link class="a2" :to="{ path: '/profile/' + c.actor }">
                <div class="q-ma-none" style="min-width:100px; overflow:hidden">
                  {{ c.actor }}
                </div>
                <div class="q-caption">@{{ c.permission }}</div>
              </router-link>
            </div>
            <!-- <pre>{{getmsigIsSeenCache}}</pre> -->
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- <Transaction ref="Transaction" v-on:done="transactionCallback($event)" /> -->
  </div>
</template>

<script>
import Actionparser from 'components/ui/action-parser'
import profilePic from 'components/ui/profile-pic'
import MarkdownViewer from 'components/ui/markdown-viewer'
import { openURL } from 'quasar'

import { mapGetters } from 'vuex'
export default {
  name: 'Msigproposal',
  components: {
    Actionparser,
    profilePic,
    MarkdownViewer
  },

  props: {
    msig: Object
  },

  data () {
    return {
      systemmsig: this.$configFile.get('systemmsigcontract'),
      dacmsig: this.$dir.getAccount(this.$dir.ACCOUNT_MSIGS),

      isHidden: false,
      approvals_modal: false,
      mobile_details_modal: false,

      isSeen: this.is_seen_computed,

      disable_approve: true
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'user/getAccountName',
      getMsigIsSeenCache: 'user/getMsigIsSeenCache',
      getIsCustodian: 'user/getIsCustodian',
      getSettingByName: 'user/getSettingByName',
      getAuth: 'user/getAuth',
      getCustodians: 'dac/getCustodians',
      getAuthAccountPermLevel: 'dac/getAuthAccountPermLevel'
    }),

    read_only: function () {
      return !this.getIsCustodian
    },
    getCustodianApprovals () {
      let custNames = this.getCustodians.map(c => c.cust_name)
      let custodianApprovals = this.msig.provided_approvals.filter(pa =>
        custNames.includes(pa.actor)
      )
      return custodianApprovals
    },

    isExecutable: function () {
      if (this.msig.provided_approvals) {
        let custNames = this.getCustodians.map(c => c.cust_name)
        let custodianApprovals = this.msig.provided_approvals.filter(pa =>
          custNames.includes(pa.actor)
        )
        return custodianApprovals.length >= this.msig.threshold
      } else {
        return false
      }
    },
    isApproved: function () {
      if (this.msig.provided_approvals) {
        return !!this.msig.provided_approvals.find(
          a => a.actor === this.getAccountName
        )
      } else {
        return false
      }
    },
    isDenied: function () {
      if (this.msig.denials) {
        return !!this.msig.denials.find(
          a => a.actor === this.getAccountName
        )
      } else {
        return false
      }
    },
    isCreator: function () {
      return this.getAccountName === this.msig.proposer
    },

    parseActions: function () {
      if (this.msig) {
        return this.msig.trx.actions
        // return this.provided_approvals.length > 0;
      } else {
        return false
      }
    },

    matchIcon: function () {
      const msigTypes = {
        TYPE_TRANSFER: 1,
        TYPE_NEWACCOUNT: 2,
        TYPE_CONFIG: 3,
        TYPE_COMMS: 4,
        TYPE_CODE: 5,
        TYPE_CUSTODIAN: 6,
        TYPE_DAC_OPS: 7,
        TYPE_TERMS: 8,
        TYPE_UNKNOWN: 99
      }

      let icon = 'action-default'
      switch (this.msig.type) {
        case msigTypes.TYPE_TRANSFER:
          icon = 'action-transfer'
          break
        case msigTypes.TYPE_CODE:
          icon = 'action-codechange'
          break
        case msigTypes.TYPE_CONFIG:
          icon = 'action-configupdate'
          break
        case msigTypes.TYPE_TERMS:
          icon = 'action-newmemterms'
          break
        default:
          icon = 'action-default'
          break
      }
      return icon
    },

    getStatusColor: function () {
      let statuscolor = ''
      if (this.msig.status === 1 && this.isApproved) {
        statuscolor = 'positive'
      }
      if (this.msig.status === 0) {
        statuscolor = 'negative'
      }
      if (this.isExecutable || this.msig.status === 2) {
        statuscolor = 'info'
      }
      return statuscolor
    },

    is_seen_computed: function () {
      return this.getMsigIsSeenCache.includes(this.msig.trxid)
    }
  },

  methods: {
    openURL,
    // approve a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    async approveProposal (proposer, proposalName) {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      const actions = [
        {
          account: this.systemmsig,
          name: 'approve',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            level: { actor: this.getAccountName, permission: this.getAuth }
          }
        },
        {
          account: this.dacmsig,
          name: 'approvede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            approver: this.getAccountName,
            dac_id: this.$dir.dacId
          }
        }
      ]
      if (this.$configFile.get('paycpu')) {
        actions.unshift(
          {
            account: 'eosdacpaycpu',
            name: 'cpu',
            authorization: [
              {
                actor: authAccount,
                permission: 'one'
              }
            ],
            data: {
              dac_id: this.$dir.dacId
            }
          }
        )
      }
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_approval')
      }
    },

    // unapprove a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    async unapproveProposal (proposer, proposalName) {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      let actions = [
        {
          account: this.systemmsig,
          name: 'unapprove',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            level: { actor: this.getAccountName, permission: this.getAuth }
          }
        },
        {
          account: this.dacmsig,
          name: 'unapprovede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            unapprover: this.getAccountName,
            dac_id: this.$dir.dacId
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_unapproval')
      }
    },
    // deny a proposal, just marks as an action
    async denyProposal (proposer, proposalName) {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      let actions = [
        {
          account: this.dacmsig,
          name: 'deny',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            denier: this.getAccountName,
            dac_id: this.$dir.dacId
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_deny')
      }
    },
    // undeny a proposal, just marks as an action
    async undenyProposal (proposer, proposalName) {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      let actions = [
        {
          account: this.dacmsig,
          name: 'undeny',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            undenier: this.getAccountName,
            dac_id: this.$dir.dacId
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_deny')
      }
    },
    // execute a proposal via msig relay {"proposer":0,"proposal_name":0,"executer":0}
    async executeProposal (proposer, proposalName) {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      let actions = [
        {
          account: this.systemmsig,
          name: 'exec',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            executer: this.getAccountName
          }
        },
        {
          account: this.dacmsig,
          name: 'executede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: 'one'
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            executer: this.getAccountName,
            dac_id: this.$dir.dacId
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_exec')
      }
    },

    // cancel a proposal via msig relay {"proposer":0,"proposal_name":0,"canceler":0}
    async cancelProposal (proposer, proposalName) {
      const authAccount = this.$dir.getAccount(this.$dir.ACCOUNT_AUTH)
      let actions = [
        {
          account: this.systemmsig,
          name: 'cancel',
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            canceler: this.getAccountName
          }
        },
        {
          account: this.dacmsig,
          name: 'cancellede',
          authorization: [
            { actor: this.getAccountName, permission: this.getAuth },
            {
              actor: authAccount,
              permission: this.getAuthAccountPermLevel // can be one or admin depending of the logged in user
            }
          ],
          data: {
            proposer: proposer,
            proposal_name: proposalName,
            canceler: this.getAccountName,
            dac_id: this.$dir.dacId
          }
        }
      ]
      let result = await this.$store.dispatch('user/transact', {
        actions: actions
      })
      if (result) {
        this.transactionCallback('e_cancel')
      }
    },

    transactionCallback (eType) {
      if (eType === 'e_approval') {
        this.provided_approvals = null // temporary show spinner by setting to null
        this.msig.requested_approvals = this.msig.requested_approvals.filter(
          ra => ra.actor !== this.getAccountName
        )
        this.msig.provided_approvals.push({
          actor: this.getAccountName,
          permission: this.getAuth
        })
        console.log(
          'trx will be executed in ',
          this.getSettingByName('trx_delay').value,
          'seconds'
        )
      }
      if (eType === 'e_unapproval') {
        this.provided_approvals = null // temporary show spinner by setting to null
        this.msig.provided_approvals = this.msig.provided_approvals.filter(
          pa => pa.actor !== this.getAccountName
        )
        this.msig.requested_approvals.push({
          actor: this.getAccountName,
          permission: this.getAuth
        })
        console.log(
          'trx will be executed in ',
          this.getSettingByName('trx_delay').value,
          'seconds'
        )
      }

      if (eType === 'e_cancel') {
        // hide the proposal
        this.isHidden = true
      }
      if (eType === 'e_exec') {
        console.log('executed')
        this.isHidden = true
      }
      this.mobile_details_modal = false
    },

    handleIsSeenCache (isSeenToggleBool) {
      console.log(isSeenToggleBool, this.msig.trxid)

      if (isSeenToggleBool) {
        this.isSeen = true
        this.$store.commit('user/setMsigIsSeenCache', {
          mode: 'add',
          msig_id: this.msig.trxid
        })
      } else {
        this.isSeen = false
        this.$store.commit('user/setMsigIsSeenCache', {
          mode: 'remove',
          msig_id: this.msig.trxid
        })
      }
    },
    async resubmit (msig) {
      let clone = JSON.parse(JSON.stringify(msig))
      await this.$store.dispatch('user/proposeMsig', {
        actions: clone.trx.actions,
        title: `Resubmit: ${clone.title}`,
        description: clone.description
      })
    }
  },

  mounted: function () {}
}
</script>
