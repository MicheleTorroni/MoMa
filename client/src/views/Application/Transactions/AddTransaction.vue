<template>

    <v-container>
        <v-row no-gutters>
            <v-col sm="10" class="mx-auto">
                <v-card class="pa-2">
                    <v-card-title> Add Transaction</v-card-title>
                    <v-divider></v-divider>
                    <v-form ref="form" @submit.prevent="submitForm" class="pa-5" enctype="multipart/form-data">
                        <v-text-field label="Transaction Name" v-model="transaction.name" prepend-icon="mdi-note"
                            :rules="rules">
                        </v-text-field>
                        <v-text-field type="number" label="Money Amount" v-model="transaction.amount"
                            prepend-icon="mdi-cash" :rules="rules">
                        </v-text-field>
                        <v-text-field type="date" label="Transaction Date" v-model="transaction.date" :rules="rules"
                            prepend-icon="mdi-calendar">
                        </v-text-field>
                        <v-select bg-color="white" mb-22 :items="categories" item-title="name" item-value="_id"
                            label="Category" v-model="category" hide-details prepend-icon="mdi-shopping" :rules="rules">
                        </v-select>
                        <v-select bg-color="white" :items="wallets" item-title="name" item-value="_id" label="Wallet"
                            v-model="wallet" hide-details prepend-icon="mdi-wallet" :rules="rules">
                        </v-select>
                        <v-alert color="error" dismissible v-if="message">
                            {{ message }}
                        </v-alert>
                        <v-col class="text-right">
                            <v-btn @click="addTransaction" class="mt-3" color="success">Add Transaction</v-btn>
                        </v-col>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import accountApi from '@/Api/accountApi'
import transactionApi from '@/Api/transactionApi'
import walletAPI from '@/Api/walletApi'
import categoryAPI from '@/Api/categoryApi'

export default {
    props: {
        update: Boolean
    },
    watch: {
        update: async function (newVal, OldVal) {
            try {
                this.wallets = await walletAPI.getWalletsByAccountUsername(this.$route.params.username)
                this.categories = await categoryAPI.getCategoriesByAccountUsername(this.$route.params.username)
                if (this.wallets.length == 0 || this.categories.length == 0) {
                    this.message = "Create at least one category and one wallet in order to create a transaction"
                }
            } catch {
            }
        }
    },
    data() {
        return {
            rules: [(value) => !!value || "This field is required!"],
            transaction: {
                name: "My New Transaction",
                amount: "0",
                date: "",
                accountFK: "",
                categoryFK: "",
                walletFK: ""
            },
            category: undefined,
            categories: [],
            wallet: undefined,
            wallets: [],
            message: ""
        }
    },
    async created() {
        try {
            this.wallets = await walletAPI.getWalletsByAccountUsername(this.$route.params.username)
            this.categories = await categoryAPI.getCategoriesByAccountUsername(this.$route.params.username)
            if (this.wallets.length == 0 || this.categories.length == 0) {

                this.message = "Create at least one category and one wallet in order to create a transaction"
            }
        } catch {
        }
    },
    methods: {
        async addTransaction() {

            if (this.transaction.name != "" && this.transaction.amount != "" && this.transaction.date != ""
                && this.category != undefined && this.wallet != undefined) {
                try {
                    const account = await accountApi.getAccountByUsername(this.$route.params.username)
                    const newTransaction = {
                        name: this.transaction.name,
                        amount: this.transaction.amount,
                        date: this.transaction.date,
                        accountFK: account[0]._id,
                        categoryFK: this.category,
                        walletFK: this.wallet
                    }
                    await transactionApi.addTransaction(newTransaction)
                    this.$router.push({ name: 'transactions', params: { username: this.$route.params.username } })
                    this.$emit('updated')
                } catch (err) {
                    console.log(err.message)
                }
            }
            else {
                this.message = "Fill all the fields in order to create a Transaction"
            }
        }
    }
}
</script>

<style scoped>
.v-select {
    margin-bottom: 27px !important;
}
</style>