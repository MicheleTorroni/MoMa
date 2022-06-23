const Account = require('../model/account')
const Category = require('../model/category')
const Transaction = require('../model/transaction')
const Wallet = require('../model/wallet')
const fs = require('fs')

module.exports = class API {
    // fetch all accounts
    static async fetchAllAccounts(req, res) {
        try {
            const account = await Account.find()
            res.status(200).json(account)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async fetchAccountUsernames(req, res) {
        try {
            var accountUsernames = []
            const accounts = await Account.find()
            for (const a of accounts) {
                accountUsernames.push(a.username)
            }
            res.status(200).json(accountUsernames)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // fetch account by ID
    static async fetchAccountByID(req, res) {
        const id = req.params.id
        try {
            const account = await Account.findById(id)
            res.status(200).json(account)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // fetch account by username
    static async fetchAccountByUsername(req, res) {
        const username = req.params.username
        try {
            const account = await Account.find().where('username', username)
            res.status(200).json(account)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // create an Account
    static async createAccount(req, res) {
        const account = req.body
        const imageName = req.file.filename
        account.image = imageName
        try {
            const accountAlreadyPresent = await Account.find({ username: req.body.username })
            if (accountAlreadyPresent.length == 0) {
                await Account.create(account)
                res.status(201).json({ message: 'Account created successfully' })
            }
            else {
                res.status(500).json({ message: "username already present" })
            }
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    // update an Account
    static async updateAccount(req, res) {
        const id = req.params.id
        let new_image = ''
        if (req.file != null) {
            new_image = req.file.filename
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image)
            } catch (error) {
                console.log(error)
            }
        } else {
            new_image = req.body.old_image
        }

        const newAccount = req.body
        newAccount.image = new_image

        try {
            await Account.findByIdAndUpdate(id, newAccount)
            res.status(200).json({ message: 'Account updated successfully' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // delete an account
    static async deleteAccount(req, res) {
        const id = req.params.id
        try {
            const result = await Account.findByIdAndDelete(id)
            if (result.image != '') {
                try {
                    fs.unlinkSync('./uploads/' + result.image)
                } catch (error) {
                    console.log(error)
                }
            }
            const categories = await Category.find({ 'accountFK': id })
            categories.forEach(c => {
                Transaction.find({ 'categoryFK': c._id }).remove()
            })
            await Category.find({ 'accountFK': id }).remove()

            const wallets = await Wallet.find({ 'accountFK': id })
            wallets.forEach(w => {
                Transaction.find({ 'walletFK': w._id }).remove()
            })
            await Wallet.find({ 'accountFK': id }).remove()

            res.status(200).json({ message: 'Account deleted successfully' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
}