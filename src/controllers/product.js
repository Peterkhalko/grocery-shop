const productService = require("../services/product");

const productController = {
  addProduct: async (req, res) => {
    const serviceResponse = await productService.addProduct(req, res);
    res.send(serviceResponse);
  },
  getProduct: async (req, res) => {
    const serviceResponse = await productService.getProduct(req, res);
    res.send(serviceResponse);
  },
  updateProduct: async (req, res) => {
    const serviceResponse = await productService.updateProduct(req, res);
    res.send(serviceResponse);
  },
  manageProduct: async (req, res) => {
    const serviceResponse = await productService.manageProduct(req, res);
    res.send(serviceResponse);
  },
  deleteProduct: async (req, res) => {
    const serviceResponse = await productService.deleteProduct(req, res);
    res.send(serviceResponse);
  },
};
module.exports = productController;
