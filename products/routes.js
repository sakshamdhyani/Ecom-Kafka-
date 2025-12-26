const express = require("express");
const { createProduct, updateProduct, getAllProducts, getProductById } = require("./productController");
const router = express.Router();


router.post('/create' , createProduct);
router.put('/update' , updateProduct);
router.get('/' , getAllProducts);
router.get('/:id' , getProductById);


module.exports = router;