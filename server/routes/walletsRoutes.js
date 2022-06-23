const express = require('express')
const router = express.Router()
const API = require('../controller/walletsApi')
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

router.get("/", API.fetchAllWallets)
router.get("/id/:id", API.fetchWalletByID)
router.get("/username/:username", API.fetchWalletsByUsername)
router.get("/name/:name", API.fetchWalletsByName)
router.post("/", upload, API.createWallet)
router.patch("/:id", upload, API.updateWallet)
router.delete("/:id", API.deleteWallet)


module.exports = router 