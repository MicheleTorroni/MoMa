const express = require('express')
const router = express.Router()
const API = require('../controller/accountsApi')
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

router.get("/", API.fetchAllAccounts)
router.get("/usernames", API.fetchAccountUsernames)
router.get("/id/:id", API.fetchAccountByID)
router.get("/username/:username", API.fetchAccountByUsername)
router.post("/", upload, API.createAccount)
router.patch("/:id", upload, API.updateAccount)
router.delete("/:id", API.deleteAccount)


module.exports = router 