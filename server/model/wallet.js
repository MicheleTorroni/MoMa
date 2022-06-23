const mongoose = require('mongoose')

const walletSchema = mongoose.Schema({
    name: String,
    accountFK: String,
    color: String,
    money: Number,
    created: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Wallet", walletSchema)