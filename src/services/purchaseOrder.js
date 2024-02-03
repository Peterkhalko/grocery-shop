const { ObjectId } = require("bson");
const purchaseOrderModel = require("../models/purchaseorder");
const productModel = require("../models/product");
const purchaseOrderService = {
  createOrders: async (req, res) => {
    const result = {};
    const orderMap = req.body;
    const ordersDataSets = [];
    const ordersRejectedDataSets = [];
    const ordersInsertedLookupDataSets = [];
    const ordersRejectedLookupDataSets = [];
    try {
      for (const order of orderMap) {
        if (!order.category) {
          result.status = 400;
          result.message = "category name not provided!";
          throw result;
        }
        if (!order.createdby) {
          result.status = 400;
          result.message = "createdby is not provided!";
          throw result;
        }
        if (!order.quantity) {
          result.status = 400;
          result.message = "quantity is not provided!";
          throw result;
        }
        if (!order.productid) {
          result.status = 400;
          result.message = "productid is not provided!";
          throw result;
        }
        //implementing transactions to perform multiple operations as a single, atomic unit.
        // If any part of the transaction fails,
        //all changes made within the transaction can be rolled back
        // const session = await mongoose.startSession();
        // session.startTransaction();
        const productAvailibilityCheck = await productModel.findById(
          new ObjectId(order.productid)
        );
        if (
          productAvailibilityCheck &&
          productAvailibilityCheck.quantity >= order.quantity
        ) {
          await productModel
            .findOneAndUpdate(
              new ObjectId(order.productid),
              { $inc: { quantity: -order.quantity } },
              { new: true }
            )
            .exec()
            .then(() => {
              const payload = {
                category: new ObjectId(order.category),
                productid: order.productid,
                quantity: order.quantity,
                createdby: new ObjectId(order.createdby),
              };
              ordersDataSets.push(payload);
            })
            .catch((error) => {
              throw ("Error updating product:", error);
            });
        } else {
          ordersRejectedDataSets.push(order);
        }
      }

      const modelResponse = await purchaseOrderModel.methods.createOrders(
        ordersDataSets
      );
      if (ordersRejectedDataSets.length > 0) {
        for (const order of ordersRejectedDataSets) {
          req.body.customquery = { _id: new ObjectId(order.productid) };
          const response = await productModel.methods.getProduct(req, res);
          ordersRejectedLookupDataSets.push(...response);
        }
      }
      if (modelResponse.length > 0) {
        for (const order of modelResponse) {
          req.body.customquery = { _id: new ObjectId(order._id) };
          const response = await purchaseOrderModel.methods.getOrders(req, res);
          ordersInsertedLookupDataSets.push(...response);
        }
        result.status = 200;
        (result.message = "oreder created successfully!"),
          (result.data = ordersInsertedLookupDataSets);
        result.rejected = ordersRejectedLookupDataSets;
        return result;
      } else {
        result.status = 200;
        (result.message = "unable to create orders"),
          (result.data = modelResponse);
        result.failure = ordersRejectedLookupDataSets;
        return result;
      }
    } catch (error) {
      console.log("error",error);
      result.status = 500;
      result.data = `error message : ${error.message}`;
      result.message = `something went bad!`;
      return result;
    }
  },
  getOrders: async (req, res) => {
    const result = {};
    try {
      const modelResponse = await purchaseOrderModel.methods.getOrders(req, res);
      if (modelResponse.length > 0) {
        result.status = 200;
        (result.message = "orders fetched successfully!"),
          (result.data = modelResponse);
        result.count = modelResponse.length;

        return result;
      } else {
        result.status = 200;
        (result.message = "No orders fetched!"),
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
};
module.exports = purchaseOrderService;
