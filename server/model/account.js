const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
    username: String,
    password: String,
    image: String,
    created: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Account", accountSchema)