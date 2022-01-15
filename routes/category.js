
const express = require("express");
const router = express.Router();

const { createCategory, categoryById, readCategory, updateCategory, removeCategory, listCategory } = require("../controllers/category");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// Having Middlewares so that the admin can only create categories

router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, createCategory);
router.get("/category/:categoryId", readCategory);
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, updateCategory);
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, removeCategory);
router.get("/categories", listCategory);

// Parameter Middlewares

router.param("userId", userById);
router.param("categoryId", categoryById);

module.exports = router;