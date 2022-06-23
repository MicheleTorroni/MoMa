const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: String,
    accountFK: String,
    color: String,
    amount: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Category", categorySchema)