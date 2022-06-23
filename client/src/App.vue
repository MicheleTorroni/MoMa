<template>
  <v-app id="inspire">

    <login-page v-if="userLogOn == false" @login="login"></login-page>
    <application v-if="userLogOn == true" @logout="userLogOn = false" @update-account="updateAccount"
      :account="account"></application>

  </v-app>
</template>

<script>
import application from './views/ApplicationPage.vue'
import loginPage from './views/LoginPage.vue'

export default {
  data: () => ({
    userLogOn: false,
    account: {}
  }),
  components: {
    'application': application,
    'login-page': loginPage
  },
  methods: {
    updateAccount(newAccount) {
      this.account = newAccount
    },
    login(account) {
      this.userLogOn = true
      this.account = account
      this.$router.push({ name: 'home', params: { username: this.account.username } })
    }
  }
}
</script>

<style>
div[data-app='true'] {
  background: url('./assets/download.jpg') no-repeat center center fixed !important;
  background-size: cover;
}

.clickable :hover {
  cursor: pointer;
}
</style>