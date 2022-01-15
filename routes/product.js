
const express = require("express");
const router = express.Router();

const { createProduct, productById, readProduct, removeProduct, 
    updateProduct, listProducts, listRelatedProducts, 
    listProductCategories, listProductsBySearch, productPhoto, listSearch } = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// Having Middlewares so that the admin can only create product
// No idea why it gave an error for a callback function even though it worked fine for other routes

router.get("/product/:productId", readProduct)
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, createProduct);
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, removeProduct)
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, updateProduct)
router.get("/products", listProducts);
router.get("/products/related/:productId", listRelatedProducts);
router.get("/products/categories", listProductCategories)
router.post("/products/by/search", listProductsBySearch)
router.get("/products/search", listSearch)
router.get("/products/photo/:productId", productPhoto)

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;