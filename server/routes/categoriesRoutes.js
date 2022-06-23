const express = require('express')
const router = express.Router()
const API = require('../controller/categoriesApi')
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

router.get("/", API.fetchAllCategories)
router.get("/id/:id", API.fetchCategoryByID)
router.get("/username/:username", API.fetchCategoriesByUsername)
router.get("/name/:name", API.fetchCategoriesByName)
router.post("/", upload, API.createCategory)
router.patch("/:id", upload, API.updateCategory)
router.delete("/:id", API.deleteCategory)


module.exports = router 