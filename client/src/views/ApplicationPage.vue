<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
            <v-list-item lines="two">
                <v-list-item-header>
                    <v-list-item-title>Menu</v-list-item-title>
                </v-list-item-header>
            </v-list-item>
            <v-divider></v-divider>
            <v-list density="compact">
                <v-list-item v-for="(item, i) in items" :key="i" :value="item" active-color="primary"
                    :input-value="selectedItem" @click="pushRoute(item.routeName, item.params)">
                    <v-list-item-avatar start>
                        <v-icon :icon="item.icon"></v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list-item class="clickable" @click.prevent="this.$refs.dialog.open()" :selected-item="selectedItem">
                <v-list-item-avatar start>
                    <v-icon icon="mdi-logout-variant"></v-icon>
                </v-list-item-avatar>
                <v-list-item-title text="'Log Out'"> Log Out</v-list-item-title>
            </v-list-item>
        </v-navigation-drawer>

        <v-app-bar app class="fixed-bar" fixed>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title @click="openHomeView" class="toolbar-title clickable">
                MoMa</v-toolbar-title>
            <v-spacer></v-spacer>
            <div class="clickable" @click="openAccountView">
                <p class="account-username "> {{ account.username }} </p>
            </div>
            <v-avatar size="40" class="account-image clickable" readonly @click="openAccountView">
                <v-img :src="`http://localhost:5000/${account.image}`">
                </v-img>
            </v-avatar>
        </v-app-bar>


        <v-main>
            <socket-io-message :username="this.$props.account.username" @update="updateChild = !updateChild"
                ref="socket">
            </socket-io-message>
            <router-view @logout="this.$emit('logout')" @update-account="updateAccount" :update="updateChild"
                @updated="$refs.socket.emit('updated')">
            </router-view>
        </v-main>


        <app-dialog :text="logOutMessage" ref="dialog" @confirm="logOut"></app-dialog>
    </v-app>


</template>

<script>
import Dialog from '../components/MessageConfirm.vue'
import SocketIoMessage from '@/components/SocketIoMessage.vue'

export default {
    props: {
        account: Object
    },
    data: (instance) => ({
        drawer: null,
        selectedItem: [2],
        items: [
            { title: 'Categories', icon: 'mdi-shopping', routeName: "home", params: { username: instance.account.username, updateChild: instance.updateChild } },
            { title: 'Wallets', icon: 'mdi-wallet', routeName: "wallets", params: { username: instance.account.username } },
            { title: 'Transactions', icon: 'mdi-cash-register', routeName: "transactions", params: { username: instance.account.username } },
            { title: 'Account', icon: 'mdi-account', routeName: "account", params: { username: instance.account.username } },
        ],
        logOutMessage: "Are you sure you want to logout? all the unsaved changes will be deleted",
        dialog: false,
        updateChild: false,
    }),
    components: {
        appDialog: Dialog,
        socketIoMessage: SocketIoMessage,
    },
    methods: {
        updateAccount(newAccount) {
            this.$emit('update-account', newAccount)
        },
        logOut() {
            this.$emit('logout')
        },
        openHomeView() {
            this.selectedItem = 1
            this.$router.push({ name: 'home', params: { username: this.account.username } })
        },
        openAccountView() {
            this.selectedItem = 4
            this.$router.push({ name: 'account', params: { username: this.account.username } })
        },
        pushRoute(routeName, params) {
            this.$router.push({ name: routeName, params: params })
        }
    }
}
</script>

<style scoped>
.account-image {
    border: 2px solid #455A64;
}

.account-username {
    padding-right: 10px;
}

.v-app-bar {
    position: fixed;
    position: -webkit-sticky;
    /* for Safari */
    top: 6em;
    z-index: 1;
}
</style>