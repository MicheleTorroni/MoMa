import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  //CATEGORIES
  {
    path: '/categories/:username',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Categories/Categories.vue')
  },
  {
    path: '/add-category/*',
    name: 'add-category',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Categories/AddCategory.vue'),
  },
  {
    path: '/edit-category/*',
    name: 'edit-category',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Categories/EditCategory.vue')
  },
  //WALLETS
  {
    path: '/wallets/:username',
    name: 'wallets',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Wallets/Wallets.vue')
  },
  {
    path: '/add-wallet/*',
    name: 'add-wallet',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Wallets/AddWallet.vue')
  },
  //TRANSACTIONS
  {
    path: '/transactions/*',
    name: 'transactions',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Transactions/Transactions.vue')
  },
  {
    path: '/add-transaction/*',
    name: 'add-transaction',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Transactions/AddTransaction.vue')
  },
  {
    path: '/account/:username',
    name: 'account',
    component: () => import(/* webpackChunkName: "about" */ '../views/Application/Account.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
