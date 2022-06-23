const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
    name: String,
    categoryFK: String, //FK
    walletFK: String, //FK
    accountFK: String,
    amount: Number,
    date: Date,
    created: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Transaction", transactionSchema)