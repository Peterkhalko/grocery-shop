const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const purchaseOrderController = require("../controllers/purchaseOrder");
const userController = require("../controllers/user");
const categoryController = require("../controllers/category");

// route user
router.get("/", (req, res) => {
  res.send({
    statu:200,
    message:"Hello from node backend test"
  })
});
router.post("/user", (req, res) => {
  userController.addUser(req, res); //done
});

// routes category
router.post("/api/category", (req, res) => {
  categoryController.addCategory(req, res);
});
router.get("/api/category", (req, res) => {
  categoryController.findCategory(req, res);
});
router.delete("/api/category", (req, res) => {
  categoryController.deleteCategory(req, res);
});
// routes products
router.post("/api/product", (req, res) => {
  productController.addProduct(req, res);
});
router.patch("/api/product", (req, res) => {
  productController.updateProduct(req, res);
});
router.patch("/api/product/:productid", (req, res) => {
  productController.manageProduct(req, res);
});
router.delete("/api/product/:productid", (req, res) => {
  productController.deleteProduct(req, res);
});
router.get("/api/product", (req, res) => {
  productController.getProduct(req, res);
});
// routes purchase orders
router.post("/api/order", (req, res) => {
purchaseOrderController.createOrders(req, res);
});
router.get("/api/order", (req, res) => {
purchaseOrderController.getOrders(req, res);
});

module.exports = router;
