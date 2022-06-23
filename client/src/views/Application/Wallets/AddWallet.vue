<template>

    <v-container>
        <v-row no-gutters>
            <v-col sm="10" class="mx-auto">
                <v-card class="pa-2">
                    <v-card-title> Add Wallet</v-card-title>
                    <v-divider></v-divider>
                    <v-form ref="form" @submit.prevent="submitForm" class="pa-5" enctype="multipart/form-data">
                        <v-text-field label="Wallet Name" v-model="wallet.name" prepend-icon="mdi-wallet"
                            :rules="rules">
                        </v-text-field>
                        <v-text-field label="Money" v-model="wallet.money" prepend-icon="mdi-cash-usd" :rules="rules">
                        </v-text-field>
                        <v-select :items="colors" item-title="title" item-value="value" item-color="blue"
                            :bg-color="color" label="Color" prepend-icon="mdi-format-color-fill" v-model="color">
                        </v-select>
                        <v-alert close-text="Close Alert" color="warning" v-if="message">
                            {{ message }}
                        </v-alert>
                        <v-col class="text-right">
                            <v-btn @click="addWallet" class="mt-3" color="success">Add Wallet</v-btn>
                        </v-col>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import accountApi from '@/Api/accountApi'
import walletApi from '@/Api/walletApi'

export default {
    props: {
        update: Boolean
    },
    watch: {
        update: async function (newVal, OldVal) {
            const wallets = await walletApi.getWalletsByAccountUsername(this.$route.params.username)
            for (const w of wallets) {
                this.walletNamesUsed.push(w.name)
            }
        }
    },
    data() {
        return {
            rules: [(value) => !!value || "This field is required!"],
            wallet: {
                name: "My New Wallet",
                color: "",
                money: 0
            },
            message: "",
            walletNamesUsed: [],
            color: 'success',
            colors: [
                { title: 'green', value: 'success' },
                { title: 'white', value: 'white' },
                { title: 'red', value: 'error' },
                { title: 'blue', value: 'primary' },
                { title: 'orange', value: 'warning' },
                { title: 'acquamarina', value: 'secondary' },
            ]
        }
    },
    async created() {
        const wallets = await walletApi.getWalletsByAccountUsername(this.$route.params.username)
        for (const w of wallets) {
            this.walletNamesUsed.push(w.name)
        }
    },
    methods: {
        async addWallet() {
            if (this.wallet.name != "") {
                if (!this.walletNamesUsed.includes(this.wallet.name)) {
                    try {
                        const account = await accountApi.getAccountByUsername(this.$route.params.username)
                        const newWallet = {
                            name: this.wallet.name,
                            color: this.color,
                            money: this.wallet.money,
                            accountFK: account[0]._id
                        }
                        await walletApi.addWallet(newWallet)
                        this.$router.push({ name: 'wallets', params: { username: this.$route.params.username } })
                        this.$emit('updated')
                    } catch (err) {
                        console.log(err.message)
                    }
                } else {
                    this.message = "Chosen wallet name is already in use"
                }
            }
        }
    }
}
</script>
