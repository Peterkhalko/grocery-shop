const categoryService = require("../services/category");

const categoryController = {
  addCategory: async (req, res) => {
    const serviceResponse = await categoryService.addCategory(req, res);
    res.send(serviceResponse);
  },
  findCategory: async (req, res) => {
    const serviceResponse = await categoryService.findCategory(req, res);
    res.send(serviceResponse);
  },
  deleteCategory: async (req, res) => {
    const serviceResponse = await categoryService.deleteCategory(req, res);
    res.send(serviceResponse);
  },
};
module.exports = categoryController;
