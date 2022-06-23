<template>
    <v-container>
        <message-confirm :text="deleteMessage" ref="messageConfirm" @confirm="deleteTransaction"></message-confirm>
        <!-- FILTERS -->
        <v-btn pb-5 class="filters-button" @click.prevent="changeFiltersVisibility()" v-if="!showFilters">
            <v-icon color="white">mdi-eye</v-icon>
            Show Filters
        </v-btn>
        <v-card class="pa-5 d-flex align-center justify-center" v-if="showFilters" color="deep-orange accent-4">
            <v-row align="center">
                <v-spacer></v-spacer>
                <v-select bg-color="white" ma-5 class="unexpandable" :items="categories" item-title="name"
                    item-value="name" label="Category" v-model="category" hide-details>
                    <template v-slot:prepend>
                        <v-icon color="white">mdi-shopping</v-icon>
                    </template>
                </v-select>
                <v-spacer></v-spacer>
                <v-select bg-color="white" class="unexpandable" :items="wallets" item-title="name" item-value="name"
                    label="Wallet" v-model="wallet" hide-details>
                    <template v-slot:prepend>
                        <v-icon color="white">mdi-wallet</v-icon>
                    </template>
                </v-select>
                <v-spacer></v-spacer>
                <v-text-field bg-color="white" class="unexpandable" type="date" label="From Date" v-model="fromDate"
                    hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-text-field bg-color="white" class="unexpandable" type="date" label="To Date" v-model="toDate"
                    hide-details>
                </v-text-field>
                <v-spacer></v-spacer>
                <v-card-actions class="filters-actions">
                    <v-btn @click.prevent="resetFilters()" color="white" v-if="showFilters">
                        <v-icon>mdi-filter-off</v-icon>
                        Reset Filters
                    </v-btn>
                    <v-btn @click.prevent="changeFiltersVisibility()" color="white" v-if="showFilters">
                        <v-icon>mdi-eye-off</v-icon>
                        Hide Filters
                    </v-btn>
                </v-card-actions>
            </v-row>

        </v-card>

        <!-- CARDS -->
        <v-col no-gutters>
            <v-row>
                <v-col cols="auto" class="pa-10" v-for="transaction in transactions.filter(t => visible(t))"
                    :key="transaction._id">
                    <v-card dense class="transaction-card">
                        <v-row>
                            <v-spacer></v-spacer>
                            <div style="min-width: 0">
                                <v-card-title class="pl-5 headline" :prepend-icon="'mdi - account'">
                                    {{ transaction.name }}
                                </v-card-title>
                            </div>
                            <v-spacer></v-spacer>
                        </v-row>
                        <br>
                        <v-row>
                            <v-card-content>
                                <div class="icon-div-green">
                                    <v-icon>mdi-cash-usd</v-icon>
                                </div>
                                {{ transaction.amount }} €
                            </v-card-content>
                        </v-row>
                        <v-row v-if="category == undefined">
                            <v-card-content>
                                <div class="icon-div-blue">
                                    <v-icon>mdi-shopping</v-icon>
                                </div>
                                {{ transaction.categoryFK }}
                            </v-card-content>
                        </v-row>
                        <v-row v-if="wallet == undefined">
                            <v-card-content>
                                <div class="icon-div-brown">
                                    <v-icon>mdi-wallet</v-icon>
                                </div>
                                {{ transaction.walletFK }}
                            </v-card-content>
                        </v-row>
                        <v-row>
                            <v-card-content>
                                <div class="icon-div-amber">
                                    <v-icon>mdi-calendar</v-icon>
                                </div>
                                {{ transaction.date.slice(0, 10) }}
                            </v-card-content>
                        </v-row>
                        <v-divider></v-divider>
                        <div @click.prevent="openMessageConfirm(transaction)">
                            <v-btn class="delete-button" width="100%">
                                <v-icon>mdi-trash-can</v-icon>
                                Delete
                            </v-btn>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-container>
    <floating-button @clicked="addTransaction"></floating-button>
</template>

<script>
import transactionsAPI from '@/Api/transactionApi'
import walletAPI from '@/Api/walletApi'
import categoryAPI from '@/Api/categoryApi'
import FloatingButton from '@/components/FloatingButton.vue'
import MessageConfirm from '@/components/MessageConfirm'

export default {
    props: {
        update: Boolean
    },
    watch: {
        update: async function (newVal, OldVal) {
            this.wallet = this.$route.params.wallet
            this.category = this.$route.params.category
            try {
                this.transactions = await transactionsAPI.getTransactionsByAccountUsername(this.$route.params.username)
            } catch (e) {
                console.log(e.message)
            }
            try {
                this.wallets = await walletAPI.getWalletsByAccountUsername(this.$route.params.username)
                this.categories = await categoryAPI.getCategoriesByAccountUsername(this.$route.params.username)
            } catch (e) {
                console.log(e.message)
            }
        }
    },
    name: 'Home',
    data() {
        return {
            deleteMessage: "Are you sure to delete Transaction?",
            category: undefined,
            categories: [],
            wallet: undefined,
            wallets: [],
            transactions: [],
            clickedTransaction: {},
            fromDate: undefined,
            toDate: undefined,
            showFilters: true
        }
    },
    components: {
        'floating-button': FloatingButton,
        'message-confirm': MessageConfirm
    },
    async created() {
        this.wallet = this.$route.params.wallet
        this.category = this.$route.params.category
        try {
            this.transactions = await transactionsAPI.getTransactionsByAccountUsername(this.$route.params.username)
        } catch (e) {
            console.log(e.message)
        }
        try {
            this.wallets = await walletAPI.getWalletsByAccountUsername(this.$route.params.username)
            this.categories = await categoryAPI.getCategoriesByAccountUsername(this.$route.params.username)
        } catch (e) {
            console.log(e.message)
        }
    },
    methods: {
        changeFiltersVisibility() {
            this.showFilters = !this.showFilters
        },
        addTransaction() {
            this.$router.push({ name: 'add-transaction', params: { username: this.$route.params.username } })
        },
        async deleteTransaction() {
            await transactionsAPI.deleteTransaction(this.clickedTransaction._id)
            console.log('updated')
            this.transactions = await transactionsAPI.getTransactionsByAccountUsername(this.$route.params.username)
        },
        visible(transaction) {
            var result = true
            if (this.category != undefined && transaction.categoryFK != this.category) result = false
            if (this.wallet != undefined && transaction.walletFK != this.wallet) result = false
            if (this.fromDate != undefined && transaction.date < this.fromDate) result = false
            if (this.toDate != undefined && transaction.date > this.toDate) result = false
            return result
        },
        openMessageConfirm(transaction) {
            this.clickedTransaction = transaction
            this.$refs.messageConfirm.open()
        },
        resetFilters() {
            this.category = undefined
            this.wallet = undefined
            this.fromDate = undefined
            this.toDate = undefined
        }
    }
};
</script>

<style scoped>
.unexpandable {
    margin: 5px !important;
}

@media (max-width: 479px) {
    .unexpandable {
        min-width: 150px !important;
        max-width: 160px !important;
        margin: 5px !important;
    }
}

.v-input__details {
    display: none !important;
}

.v-select__details {
    display: none !important;
}

.v-icon {
    opacity: 100 !important;
}

.filters-button {
    color: white !important;
    background-color: #FF3D00;
}

.delete-button {
    color: red !important;
    background-color: white;
}

.filters-actions {
    display: grid !important;
}

.filters-actions .v-btn {
    margin-left: 0px;
}

.icon-div-brown {
    display: inline-block;
    border-radius: 20%;
    background-color: #795548;
    color: white;
}

.icon-div-green {
    display: inline-block;
    border-radius: 20%;
    background-color: #00BFA5;
    color: white;
}

.icon-div-blue {
    display: inline-block;
    border-radius: 20%;
    background-color: #0D47A1;
    color: white;
}

.icon-div-amber {
    display: inline-block;
    border-radius: 20%;
    background-color: #FFB300;
    color: white;
}

.v-card-content {
    padding-top: 5px !important;
}
</style>
