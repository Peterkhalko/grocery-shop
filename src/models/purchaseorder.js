const mongoose = require("mongoose");
const dayjs = require("dayjs");
const { ObjectId } = require("bson");
const purchaseOrderSchema = new mongoose.Schema(
  {
    createdby: {
      type: ObjectId,
      required: true,
    },
    category: {
      type: ObjectId,
      required: true,
      ref: "Categories",
    },

    productid: {
      type: ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const methods = {
  getOrders: async (req, ref) => {
    const query = [];
    const stagedQuery = {};
    const stage = [];
    if (req.body.id) {
      query.push({ _id: new ObjectId(req.body.id) });
    }
    if (req.body.category) {
      query.push({ category: new ObjectId(req.body.category) });
    }
    if (req.body.createdby) {
      query.push({ createdby: new ObjectId(req.body.createdby) });
    }
    if (req.body.productid) {
      query.push({ productid: new ObjectId(req.body.productid) });
    } 
    if (req.body.quantity) {
      query.push({ quantity: req.body.quantity});
    }
    if (req.body.customquery) {
      query.push(req.body.customquery);
    }
    if (query.length > 0) {
      stagedQuery.$or = query;
    } else {
      stagedQuery = [...query];
    }
    stage.push({ $match: stagedQuery });
    stage.push({
      $lookup: {
        from: "products",
        localField: "productid",
        foreignField: "_id",
        as: "productDetails",
      },
    });
    stage.push({
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    });
    stage.push({
      $lookup: {
        from: "users",
        localField: "createdby",
        foreignField: "_id",
        as: "userDetails",
      },
    });
    stage.push({
      $project: {
        createdby: 0,
        category: 0,
        productid: 0,
      },
    });
    if (req.body.skip) {
      stage.push({ $skip: Number(req.body.skip) });
    }
    if (req.body.limit) {
      stage.push({ $skip: Number(req.body.limit) });
    }
    const data = await purchaseOrder.aggregate(stage);
    return data;
  },
  createOrders: async (ordersDataSets) => {
    const data = await purchaseOrder.create(ordersDataSets);
    return data;
  },
};
const purchaseOrder = mongoose.model("Purchaseorders", purchaseOrderSchema);
module.exports = purchaseOrder;
module.exports.methods = methods;
