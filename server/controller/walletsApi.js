const Wallet = require('../model/wallet')
const Account = require('../model/account')
const Transaction = require('../model/transaction')
const fs = require('fs')

module.exports = class API {
    // fetch all wallets
    static async fetchAllWallets(req, res) {
        try {
            const wallets = await Wallet.find()
            await Promise.all(wallets.map(async c => {
                const account = await Account.findById(c.accountFK)
                c.accountFK = account.username
            }))
            res.status(200).json(wallets)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async fetchWalletsByAccountID(req, res) {
        const accountID = req.params.accountID
        try {
            const account = await Account.findById(accountID)
            const wallets = await Wallet.find().where('accountFK', accountID)
            wallets.map(c => {
                c.accountFK = account.username
            })
            res.status(200).json(wallets)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // fetch wallet by ID
    static async fetchWalletByID(req, res) {
        const id = req.params.id
        try {
            const wallet = await Wallet.findById(id)
            res.status(200).json(wallet)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // fetch wallet by name
    static async fetchWalletsByUsername(req, res) {
        const username = req.params.username
        try {
            const account = await Account.find().where('username', username)
            const wallets = await Wallet.find().where('accountFK', account[0]._id)
            wallets.map(c => {
                c.accountFK = account.username
            })
            res.status(200).json(wallets)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async fetchWalletsByName(req, res) {
        const walletName = req.params.name
        try {
            const wallets = await Wallet.find().where('name', walletName)
            res.status(200).json(wallets[0])
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // create an Wallet
    static async createWallet(req, res) {
        const wallet = req.body
        try {
            await Wallet.create(wallet)
            res.status(201).json({ message: 'Wallet created successfully' })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    // update a Wallet
    static async updateWallet(req, res) {
        const wallet = req.body
        const id = req.params.id
        try {
            await Wallet.findByIdAndUpdate(id, wallet)
            res.status(200).json({ message: 'Wallet updated successfully' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // delete a wallet
    static async deleteWallet(req, res) {
        const id = req.params.id
        try {
            await Wallet.findByIdAndDelete(id)
            await Transaction.find({ 'walletFK': id }).remove()
            res.status(200).json({ message: 'Wallet deleted successfully' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
}