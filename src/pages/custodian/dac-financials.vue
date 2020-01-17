<template>
  <q-page class="q-pa-md">
    <p>
      {{$t('dac_financials.intro')}}
    </p>

    <div class="row q-col-gutter-md">
      <div class="col-lg-3"
              v-for="(account, i) in financialaccounts"
              :key="`fc${i}`"
      >
        <financial-account
                :accountname="account.account"
                :description="account.description"
                :default_contract="account.contract"
                :default_symbol="account.symbol"
        />
      </div>

      <div v-if="financialaccounts.length <= 1" class="col-lg-9">
        <div class="text-h6">{{$t('dac_financials.treasury_explainer_header')}}</div>
        <div class="q-my-md">{{$t('dac_financials.treasury_explainer')}}</div>
        <div class="q-my-md">{{$t('dac_financials.treasury_explainer_to_fund')}}</div>
        <div class="text-h5 q-my-md">{{$dir.getAccount($dir.ACCOUNT_TREASURY)}}</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-xs-12 col-lg-6">
        <q-card>
          <q-card-section class="bg-primary q-pa-xs">
            <q-item>
              <q-item-section avatar>
                <q-icon :name="$configFile.icon.dactoken" />
              </q-item-section>
              <q-item-section class="text-h6">
                {{ $t("dac_financials.propose_transfer") }}
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section>
              <div class="relative-position">
                <div class="cust_only_overlay" v-if="!getIsCustodian">
                  <q-icon name="lock" class="q-mr-xs" />
                  {{ $t("dac_financials.cust_only") }}
                </div>
                <div class="q-pa-md">
                  <msig-transfer
                          @onsubmit="addToQueue($event)"
                          ref="msigTransferForm"
                          :from_accounts="financialaccounts.map(fa => fa.account)"
                  />
                </div>
              </div>
          </q-card-section>
        </q-card>

      </div>

      <div class="col-xs-12 col-lg-6">
        <q-card>
          <q-card-section class="bg-primary q-pa-xs">
            <q-item>
              <q-item-section avatar>
                <q-icon :name="$configFile.icon.dactoken" />
              </q-item-section>
              <q-item-section class="text-h6">
                {{ $t("dac_financials.trx_que") }}
              </q-item-section>
              <q-item-section side>
                <q-btn flat round dense icon="more_vert" :disable="!getIsCustodian" v-if="trxQueue.length > 1">
                  <q-popup-proxy v-if="getIsCustodian">
                    <q-list highlight>
                      <q-item class="cursor-pointer q-body-1 ">
                        <q-item-section>
                          <label
                                  for="myInput"
                                  class="cursor-pointer full-width"
                          >
                            {{ $t("dac_financials.import_file") }}
                          </label>
                          <input
                                  id="myInput"
                                  type="file"
                                  style="display:none"
                                  ref="inputFile"
                                  accept=".json,application/json"
                                  @input="handleFileInput"
                          />
                        </q-item-section>
                      </q-item>
                      <q-item
                              class="cursor-pointer q-body-1"
                              v-close-popup
                              @click.native="downloadReport"
                      >
                        <q-item-section>{{ $t("dac_financials.export") }}</q-item-section>
                      </q-item>
                      <q-item
                              class="cursor-pointer q-body-1"
                              v-close-popup
                              @click.native="clearQueue"
                      >
                        <q-item-section>{{ $t("dac_financials.clear") }}</q-item-section>
                      </q-item>
                      <q-item

                              class="cursor-pointer q-body-1"
                              v-close-popup
                              @click.native="proposeAll"
                      >
                        <q-item-section>{{ $t("dac_financials.exec") }}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-popup-proxy>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section>
              <div class="relative-position">
                <div class="cust_only_overlay" v-if="!getIsCustodian">
                  <q-icon name="lock" class="q-mr-xs" />
                  {{ $t("dac_financials.cust_only") }}
                </div>

                <q-scroll-area
                        style="height: 380px; padding-bottom:8px"
                        :thumb-style="getThumbStyle()"
                        :delay="1500"
                >
                  <q-list dense no-border separator highlight>
                    <div
                            v-if="trxQueue.length === 0"
                            class="text-weight-thin text-center q-body-1 q-mt-md"
                    >
                      {{ $t("dac_financials.empty_queue") }}
                    </div>
                    <q-item
                            v-for="(trx, i) in trxQueue"
                            :key="`trx${i}`"
                            class="animate-fade"
                    >
                      <q-item-section side>
                        <q-btn
                                v-if="trx.status === 0"
                                icon="close"
                                flat
                                dense
                                color="negative"
                                @click="removeFromQueue(i)"
                        />
                        <q-spinner v-if="trx.status === 1" color="primary" />
                        <q-btn
                                v-if="trx.status === 2"
                                icon="check"
                                flat
                                dense
                                color="positive"
                        />
                        <q-btn
                                v-if="trx.status === 3"
                                icon="edit"
                                flat
                                dense
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ trx.title }}</q-item-label>
                        <q-item-label caption>
                          <span>{{ trx.from }}</span>
                          <span class="text-weight-thin"> > </span>
                          <span>{{ trx.to }}</span>
                          <q-chip
                                  dense
                                  class="text-weight-thin on-right q-caption"
                          >
                            <span>{{ `${trx.asset.quantity}` }}</span>
                            <span class="text-weight-bold">
                          {{ trx.asset.symbol }}
                        </span>
                          </q-chip>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                                v-if="trx.status === 0 || trx.status === 3"
                                :label="$t('dac_financials.edit')"
                                size="sm"
                                dense
                                flat
                                color="info"
                                class="q-mr-xs"
                                @click="editQueueItem(i)"
                                :disabled="trx.status === 3"
                                :loading="trx.status === 3"
                        />
                        <q-btn
                                v-if="trx.status === 0 || trx.status === 3"
                                :label="$t('dac_financials.send')"
                                size="sm"
                                flat
                                dense
                                color="positive"
                                @click="proposeTransfer(i)"
                                :disabled="trx.status === 3"
                        />
                        <q-btn
                                v-if="trx.status === 2"
                                :label="$t('dac_financials.view')"
                                size="sm"
                                flat
                                dense
                                color="positive"
                                @click="viewTrx(trx.trx_id)"
                        />
                        <span class="animate-pop" v-if="trx.status === 1">
                      <q-spinner color="primary" />
                      <span class="q-caption q-ml-sm">{{
                        $t("dac_financials.signing")
                      }}</span>
                    </span>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-scroll-area>
              </div>
          </q-card-section>
        </q-card>

      </div>
      <!-- end trx qeue -->

      <!-- <div class="col-xs-12 col-lg-6">
        <div class="round-borders shadow-4 overflow-hidden">
          <div
            class="bg-primary q-pa-sm row justify-between items-center"
            style="height:50px"
          >
            <q-icon
              :name="$configFile.icon.dactoken"
              size="24px"
            />
            <span>Open Payments</span>
            <help-btn
              content="Fill in the form to propose a transfer from one of the DAC accounts. The transfers will be submitted to the blockchain as multisignature proposals. The custodians need to vote before the transfer can be executed."
              title="Propose Transfer"
              size="sm"
            />
          </div>
          <div class="relative-position">
            <div class="q-pa-md">
              <custodian-payments />
            </div>
          </div>
        </div>
      </div> -->
      <!-- end open payments -->
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import financialAccount from 'components/ui/financial-account'
// import helpBtn from 'components/controls/help-btn'
import msigTransfer from 'components/controls/msig-transfer'
// import { saveAs } from 'file-saver'
// import custodianPayments from "components/controls/custodian-payments";
import { colors, Notify, openURL } from 'quasar'

export default {
  name: 'dacFinancials',
  components: {
    msigTransfer,
    // helpBtn,
    financialAccount
    // custodianPayments
  },
  data () {
    return {
      financialaccounts: [
        {
          'account': this.$dir.getAccount(this.$dir.ACCOUNT_TREASURY),
          'contract': this.$configFile.get('systemtokencontract'),
          'symbol': this.$configFile.get('systemtokensymbol')
        }
      ],
      permissions_map: [],

      trxQueue: this.$store.state.user.msigTransferQeue
    }
  },

  computed: {
    ...mapGetters({
      getMsigTransferQeue: 'user/getMsigTransferQeue',
      getIsCustodian: 'user/getIsCustodian'
    })
  },
  methods: {
    openURL,
    // status 0 = waiting for exec; 1 = sending; 2 = success; 3 = edit;
    addToQueue (el) {
      if (el.status === undefined) {
        el.status = 0
      }
      this.$store.commit('user/setMsigTransferQeue', {
        mode: 'add',
        qeue_entry: el
      })
    },
    removeFromQueue (queueIndex) {
      this.$store.commit('user/setMsigTransferQeue', {
        mode: 'remove',
        qeue_entry: queueIndex
      })
    },
    clearQueue () {
      this.$store.commit('user/setMsigTransferQeue', { mode: 'clear' })
    },
    editQueueItem (queueIndex) {
      // check if there is already an item being edited
      let check = this.trxQueue.find(qi => qi.status === 3)
      if (check) check.status = 0

      let queueItem = this.trxQueue[queueIndex]
      queueItem.status = 3
      this.$refs.msigTransferForm.setFormFieldsEdit(queueItem)
    },
    async handleFileInput () {
      let file = this.$refs.inputFile.files[0]
      console.log(file)
      // this.filename = file.name;
      // this.filesize = `${(file.size / 1024).toFixed(2)}KB`;
      let content = await new Promise((resolve) => {
        var fr = new FileReader()
        fr.onload = function (result) {
          return resolve(result)
        }
        fr.readAsText(file, `utf8`)
      })

      try {
        content = JSON.parse(content)
      } catch (e) {
        alert('Malformed import file !!', e)
        return
      }

      for (let i = 0; i < content.length; i++) {
        let entry = content[i]
        // be sure precision is correct
        entry.asset.amount = parseFloat(entry.asset.amount).toFixed(
          entry.asset.precision
        )
        if (entry.trx_id !== undefined && entry.trx_id !== '') {
          entry.status = 2 // if trxid is present set status to executed
        }
        this.addToQueue(entry)
      }
      document.getElementById('myInput').value = ''
    },

    async getPermissions (accountname) {
      let fromPermissions = this.permissions_map.find(
        pm => pm.account === accountname
      )
      if (fromPermissions) return fromPermissions.permissions

      try {
        const res = await this.$eosApi.rpc.get_account(accountname)
        const accountPermissions = res.permissions

        if (accountPermissions) {
          this.permissions_map.push({
            account: accountname,
            permissions: accountPermissions
          })
          return accountPermissions
        }
      } catch (e) {
        throw new Error(`Failed to get account ${accountname}`)
      }
    },

    async proposeAll () {
      this.$store.commit('ui/setEnableTransactionOverlay', false)
      for (let i = 0; i < this.trxQueue.length; i++) {
        // only propose if not proposed yet
        if (this.trxQueue[i].status === 0) {
          await this.proposeTransfer(i)
        } else {
          console.log(`already proposed`, this.trxQueue[i])
        }
      }
      this.$store.commit('ui/setEnableTransactionOverlay', true)
    },

    async proposeTransfer (trxIndex) {
      let trxData = this.trxQueue[trxIndex]

      // set status to the sending state 1
      trxData.status = 1

      let permission = 'active' // default to active
      let fromPermissions
      try {
        fromPermissions = await this.getPermissions(trxData.from)
      } catch (e) {
        console.log(`Could not get account for ${trxData.from}`, e)
        Notify.create({
          message: `Could not get account for ${trxData.from}`,
          timeout: 2000,
          type: 'negative',
          position: 'bottom-right'
        })
      }

      if (fromPermissions) {
        const hasXfer = !!fromPermissions.find(fp => fp.perm_name === 'xfer')
        permission = hasXfer ? `xfer` : `active`
      }

      let action = {
        account: trxData.asset.contract,
        name: 'transfer',
        data: {
          from: trxData.from,
          to: trxData.to,
          quantity: `${trxData.asset.quantity} ${trxData.asset.symbol}`,
          memo: trxData.memo.trim()
        },
        authorization: [
          {
            actor: trxData.from,
            permission: permission
          }
        ]
      }

      let res = await this.$store.dispatch('user/proposeMsig', {
        actions: [action],
        title: trxData.title,
        description: trxData.description
      })
      if (res) {
        console.log(res)
        trxData.status = 2
        trxData.trx_id = res.transaction_id
        trxData.proposal_name = res.proposal_name
        trxData.block_time = res.transaction.processed.block_time
      } else {
        console.log(res)
        trxData.status = 0
      }
    },

    getThumbStyle () {
      return {
        right: '0px',
        borderRadius: '0px',
        background: colors.getBrand('primary'),
        width: '5px',
        opacity: 1
      }
    },

    getChunkSize () {
      // col-xs-12 col-sm-6 col-lg-4
      let size = 1
      if (this.$q.screen.gt.xs) {
        size = 2
      }
      if (this.$q.screen.gt.sm) {
        size = 3
      }
      return size
    },

    downloadReport () {
      if (this.trxQueue.length === 0) return
      let data = JSON.parse(JSON.stringify(this.trxQueue))
      data.forEach(d => {
        delete d.status
      })
      // let blob = new Blob([JSON.stringify(data, null, 4)], {
      //   type: 'text/plain;charset=utf-8'
      // })
      // saveAs(blob, 'msig_report.json')
    },
    viewTrx (trxId) {
      openURL(this.$configFile.get('explorer_transaction').replace('{transaction_id}', trxId))
    }
  }
}
</script>

<style>
.cust_only_overlay {
  background-color: #333333;
  opacity: 0.9;
  font-size: 18px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
