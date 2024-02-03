
const category = require("../models/category");
const categoryService = {
  addCategory: async (req, res) => {
    const result = {};
    try {
      if (!req.body.categoryname) {
        result.status = 400;
        result.message = "category name not provided!";
        return result;
      }
      if (!req.body.createdby) {
        result.status = 400;
        result.message = "createdby is not provided!";
        return result;
      }
      const modelResponse = await category.methods.addCategory(req, res);
      if (modelResponse) {
        result.status = 200;
        (result.message = "category created successfully!"),
          (result.data = modelResponse);
        return result;
      }
    } catch (error) {
      result.status = 500;
      result.message = `something went bad!`;
      result.data = `error message : ${error.message}`;
      return result;
    }
  },
  findCategory: async (req, res) => {
    const result = {};
    try {
      const modelResponse = await category.methods.findCategory(req, res);
      if (modelResponse.length > 0) {
        result.status = 200;
        (result.message = "category fetched successfully!"),
          (result.data = modelResponse);
        return result;
      } else {
        result.status = 200;
        (result.message = "No category available!"),
          (result.data = modelResponse);
        return result;
      }
    } catch (error) {
      result.status = 500;
      result.message = `something went bad!`;
      result.data = `error message : ${error.message}`;
      return result;
    }
  },
  deleteCategory: async (req, res) => {
    const result = {};
    try {
      if (!req.body.categoryid) {
        result.status = 400;
        result.message = "categoryid not provided!";
        return result;
      }

      const modelResponse = await category.methods.deleteCategory(req, res);
      if (modelResponse) {
        result.status = 200;
        (result.message = "category deleted successfully!"),
          (result.data = modelResponse);
        return result;
      }
      if (!modelResponse) {
        result.status = 404;
        (result.message = "unable to find category"),
          (result.data = modelResponse);
        return result;
      }
    } catch (error) {
      result.status = 500;
      result.message = `something went bad!`;
      result.data = `error message : ${error.message}`;
      return result;
    }
  }, 
};
module.exports = categoryService;
