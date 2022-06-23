const Category = require('../model/category')
const Account = require('../model/account')
const Wallet = require('../model/wallet')
const Transaction = require('../model/transaction')
const fs = require('fs')

module.exports = class API {
    // fetch all categories
    static async fetchAllCategories(req, res) {
        try {
            const categories = await Category.find()
            await Promise.all(categories.map(async c => {
                const account = await Account.findById(c.accountFK)
                c.accountFK = account.username
            }))
            res.status(200).json(categories)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async fetchCategoriesByAccountID(req, res) {
        const accountID = req.params.accountID
        try {
            const account = await Account.findById(accountID)
            const categories = await Category.find().where('accountFK', accountID)
            categories.map(c => {
                c.accountFK = account.username
            })
            res.status(200).json(categories)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // fetch category by ID
    static async fetchCategoryByID(req, res) {
        const id = req.params.id
        try {
            const category = await Category.findById(id)
            res.status(200).json(category)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // fetch category by name
    static async fetchCategoriesByUsername(req, res) {
        const username = req.params.username
        try {
            const account = await Account.find().where('username', username)
            const categories = await Category.find().where('accountFK', account[0]._id)
            await Promise.all(categories.map(async c => {
                c.accountFK = account.username
                const transactions = await Transaction.find().where('categoryFK', c._id)
                for (const t of transactions) {
                    c.amount = c.amount + t.amount
                }
            }))
            res.status(200).json(categories)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    static async fetchCategoriesByName(req, res) {
        const categoryName = req.params.name
        try {
            const categories = await Category.find().where('name', categoryName)
            res.status(200).json(categories[0])
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // create an Category
    static async createCategory(req, res) {
        const category = req.body
        try {
            await Category.create(category)
            res.status(201).json({ message: 'Category created successfully' })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }

    // update a Category
    static async updateCategory(req, res) {
        const category = req.body
        const id = req.params.id
        try {
            await Category.findByIdAndUpdate(id, category)
            res.status(200).json({ message: 'Category updated successfully' })
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    }

    // delete a category
    static async deleteCategory(req, res) {
        const id = req.params.id
        try {
            await Category.findByIdAndDelete(id)
            const transactions = await Transaction.find().where('categoryFK', id)
            await Promise.all(transactions.map(async t => {
                var wallet = await Wallet.findById(t.walletFK)
                wallet.money = wallet.money + t.amount
                await Wallet.findByIdAndUpdate(t.walletFK, wallet)
            }))
            await Transaction.find({ 'categoryFK': id }).remove()
            res.status(200).json({ message: 'Category deleted successfully' })
        } catch (error) {
            console.log(error)
            res.status(404).json({ message: error.message })
        }
    }
}