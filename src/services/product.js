const productModel = require("../models/product");
const category = require("../models/category");
const proeductService = {
  addProduct: async (req, res) => {
    const result = {};
    try {
      if (!req.body.productname) {
        result.status = 400;
        result.message = "product name not provided!";
        return result;
      }
      if (!req.body.categoryid) {
        result.status = 400;
        result.message = "categoryid is not provided!";
        return result;
      }
      if (!req.body.createdby) {
        result.status = 400;
        result.message = "createdby is not provided!";
        return result;
      }
      if (!req.body.price) {
        result.status = 400;
        result.message = "price not provided!";
        return result;
      }
      if (!req.body.unit) {
        result.status = 400;
        result.message = "unit not provided!";
        return result;
      }
      if (!req.body.quantity) {
        result.status = 400;
        result.message = "quantity not provided!";
        return result;
      }
      req.body.catid = req.body.category;
      const categoryExistsCheck = await category.methods.findCategory(req, res);
      //   check if category is null or inActive before making entry for store items
      if (
        categoryExistsCheck.length == 0 ||
        categoryExistsCheck[0]?.isActive == false
      ) {
        result.status = 400;
        result.message = "category does not exists!";
        result.data = categoryExistsCheck;
        return result;
      }
      const modelResponse = await productModel.methods.addProduct(req, res);
      if (modelResponse) {
        req.body={};
        req.body.productid = modelResponse._id;
        const modalLookupResponse = await productModel.methods.getProduct(req, res);
        result.status = 200;
        (result.message = "product item created successfully!"),
          (result.data = modalLookupResponse);
        return result;
      }
    } catch (error) {
      result.status = 500;
      result.message = `something went bad!`;
      result.data = `error message : ${error.message}`;
      return result;
    }
  },
  getProduct: async (req, res) => {
    const result = {};
    try {
      //   if (!req.body.name) {
      //     result.status = 400;
      //     result.message = "grocery name not provided!";
      //     return result;
      //   }

      const modelResponse = await productModel.methods.getProduct(req, res);
      if (modelResponse.length > 0) {
        result.status = 200;
        (result.message = "product fetched successfully!"),
          (result.data = modelResponse);
        result.count = modelResponse.length;

        return result;
      } else {
        result.status = 200;
        (result.message = "No product fetched!"),
          (result.data = modelResponse);
        result.count = modelResponse.length;
        return result;
      }
    } catch (error) {
      result.status = 500;
      result.message = `something went bad!`;
      result.data = `error message : ${error.message}`;
      return result;
    }
  },
  updateProduct: async (req, res) => {
    const result = {};
    try {
        if (!req.body.productid) {
          result.status = 400;
          result.message = "productid not provided!";
          return result;
        }

      const modelResponse = await productModel.methods.updateProduct(req, res);
      if (modelResponse) {
        result.status = 200;
        (result.message = "product updated successfully!"),
          (result.data = modelResponse);
        result.count = modelResponse.length;

        return result;
      } else {
        result.status = 200;
        (result.message = "No product udpated!"),
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
 
   deleteProduct: async (req, res) => {
    const result = {};
    try {
      if (!req.params.productid) {
        result.status = 400;
        result.message = "productid not provided!";
        return result;
      }

      const modelResponse = await productModel.methods.deleteProduct(req, res);
      if (modelResponse) {
        result.status = 200;
        (result.message = "product deleted successfully!"),
          (result.data = modelResponse);
        return result;
      }
      if (!modelResponse) {
        result.status = 404;
        (result.message = "unable to delete product!"),
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
  manageProduct: async (req, res) => {
    const result = {};
    try {
      if (!req.body.actiontype) {
        result.status = 400;
        result.message = "actiontype not provided!";
        return result;
      }
      if (!req.body.quantity) {
        result.status = 400;
        result.message = "quantity not provided!";
        return result;
      }
      if (!req.params.productid) {
        result.status = 400;
        result.message = "productid not provided!";
        return result;
      }

      const modelResponse = await productModel.methods.manageProduct(req, res);
      if (modelResponse) {
        result.status = 200;
        (result.message = "product updated successfully!"),
          (result.data = modelResponse);
        return result;
      }
      if (!modelResponse) {
        result.status = 404;
        (result.message = "unable to update product!"),
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
module.exports = proeductService;
