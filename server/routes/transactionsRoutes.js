const express = require('express')
const router = express.Router()
const API = require('../controller/transactionsApi')
const multer = require('multer')

//multer middleware
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    }
})

let upload = multer({
    storage: storage
}).single("image")

router.get("/", API.fetchAllTransactions)
router.get("/:id", API.fetchTransactionByID)
router.get("/username/:username", API.fetchTransactionsByUsername)
router.post("/", upload, API.createTransaction)
router.patch("/:id", upload, API.updateTransaction)
router.delete("/:id", API.deleteTransaction)

module.exports = router 