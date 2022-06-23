<template>
  <v-container>
    <message-confirm :text="deleteMessage" ref="messageConfirm" @confirm="deleteWallet"></message-confirm>
    <insert-value text="Insert money amount" ref="insertValue" @confirm-value="updateWallet"></insert-value>
    <v-alert close-text="Close Alert" color="green accent-4" dark dismissible v-if="this.$route.params.message">
      {{ this.$route.params.message }}
    </v-alert>
    <v-col no-gutters>
      <div class="pa-5" v-for="wallet in wallets" :key="wallet._id">
        <v-card width="100%" :color="wallet.color"
          :to="{ name: 'transactions', params: { username: this.$route.params.username, wallet: wallet.name } }">
          <v-row align="center">
            <v-btn class="ml-5" @click.prevent="openMessageConfirm(wallet)">
              <v-icon color="black" size="25">mdi-trash-can</v-icon>
            </v-btn>
            <v-card-title class="pl-5 headline" :prepend-icon="'mdi - account'">
              {{ wallet.name }} : {{ wallet.money }} €
            </v-card-title>
            <v-spacer></v-spacer>
            <v-row></v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-col style="padding-left: 0px; padding-right: 0px; margin-bottom: 5px; margin-top: 5px;">
                <v-btn class="pa-2" @click.prevent="openInsertValue(false, wallet)">
                  <v-icon color="error" size="30">mdi-cash-minus</v-icon>
                </v-btn>
              </v-col>
              <v-col style="padding-left: 5px; margin-right: 5px;margin-bottom: 5px; margin-top: 5px;">
                <v-btn class="pa-2" @click.prevent="openInsertValue(true, wallet)">
                  <v-icon color="success" size="30">mdi-cash-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-row>
        </v-card>
      </div>
    </v-col>
  </v-container>
  <floating-button @clicked="addWallet"></floating-button>
</template>

<script>
import walletsAPI from '@/Api/walletApi'
import FloatingButton from '@/components/FloatingButton.vue';
import InsertValue from '@/components/InsertValue.vue';
import MessageConfirm from '@/components/MessageConfirm'

export default {
  props: {
    update: Boolean
  },
  watch: {
    update: async function (newVal, OldVal) {
      this.wallets = await walletsAPI.getWalletsByAccountUsername(this.$route.params.username)
    }
  },
  name: 'Home',
  data() {
    return {
      deleteMessage: "Are you sure to delete Wallet and all linked transactions?",
      wallets: [],
      clickedWallet: {}
    }
  },
  components: {
    'floating-button': FloatingButton,
    'insert-value': InsertValue,
    'message-confirm': MessageConfirm
  },
  async created() {
    this.wallets = await walletsAPI.getWalletsByAccountUsername(this.$route.params.username)
  },
  methods: {
    openInsertValue(bool, wallet) {
      this.clickedWallet = wallet
      this.$refs.insertValue.open(bool)
    },
    openMessageConfirm(wallet) {
      this.clickedWallet = wallet
      this.$refs.messageConfirm.open()
    },
    addWallet() {
      this.$router.push({ name: 'add-wallet', params: { username: this.$route.params.username } })
    },
    async updateWallet(value) {
      this.clickedWallet.money = this.clickedWallet.money + value
      await walletsAPI.updateWallet(this.clickedWallet._id, this.clickedWallet)
      this.$emit('updated')
    },
    async deleteWallet() {
      await walletsAPI.deleteWallet(this.clickedWallet._id)
      this.$emit('updated')
      this.wallets = await walletsAPI.getWalletsByAccountUsername(this.$route.params.username)
    }
  }
};
</script>

<style scoped>
.v-btn {
  color: white !important;
  background-color: white !important;
  border: thin solid rgb(65, 65, 65);
}
</style>
