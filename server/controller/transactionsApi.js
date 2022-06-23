const Transaction = require('../model/transaction')
const Category = require('../model/category')
const Account = require('../model/account')
const Wallet = require('../model/wallet')
const fs = require('fs')

module.exports = class API {
    // fetch all transactions
    static async fetchAllTransactions(req, res) {
        try {
            const transaction = await Transaction.find()
            res.status(200).json(transaction)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // fetch transaction by ID
    static async fetchTransactionByID(req, res) {
        const id = req.params.id
        try {
            const transaction = await Transaction.findById(id)
            res.status(200).json(transaction)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async fetchTransactionsByUsername(req, res) {
        try {
            const account = await Account.find({ username: req.params.username })
            const transactions = await Transaction.find({ accountFK: account[0]._id })

            await Promise.all(transactions.map(async t => {
                const category = await Category.findById(t.categoryFK)
                t.categoryFK = category.name
                const wallet = await Wallet.findById(t.walletFK)
                t.walletFK = wallet.name
            }))

            res.status(200).json(transactions)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // create a transaction
    static async createTransaction(req, res) {
        const transaction = req.body

        try {
            await Transaction.create(transaction)
            var wallet = await Wallet.findById(transaction.walletFK)
            wallet.money = wallet.money - transaction.amount
            await Wallet.findByIdAndUpdate(wallet._id, wallet)
            res.status(201).json({ message: 'Transaction created successfully' })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    // update a transaction
    static async updateTransaction(req, res) {
        const id = req.params.id
        let new_image = ''
        if (req.file) {
            new_image = req.file.filename
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image)
            } catch (error) {
                console.log(error)
            }
        } else {
            new_image = req.body.old_image
        }

        const newTransaction = req.body
        newTransaction.image = new_image

        try {
            await Transaction.findByIdAndUpdate(id, newTransaction)
            res.status(200).json({ message: 'Transaction updated successfully' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // delete a transaction
    static async deleteTransaction(req, res) {
        const id = req.params.id
        try {
            const transaction = await Transaction.findById(id)
            var wallet = await Wallet.findById(transaction.walletFK)
            wallet.money = wallet.money + transaction.amount
            await Wallet.findByIdAndUpdate(wallet._id, wallet)
            const result = await Transaction.findByIdAndDelete(id)
            if (result.image != '') {
                try {
                    fs.unlinkSync('./uploads/' + result.image)
                } catch (error) {
                    console.log(error)
                }
            }
            res.status(200).json({ message: 'Transaction deleted successfully' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }
}