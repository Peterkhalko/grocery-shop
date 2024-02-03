const mongoose = require("mongoose");
const dayjs = require("dayjs");
const { ObjectId } = require("bson");
const { error } = require("winston");
const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: ObjectId,
    required: true,
    ref: "Categories",
  },
  createdby: {
    type: ObjectId,
    required: true,
    ref: "Users",
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ["kg", "ltr"]
  },
  quantity: {
    type: Number,
    required: true,
    integer: true,
    min:0,
  },
  expirydate: {
    type: mongoose.Schema.Types.Mixed,
    default: undefined,
    validate: {
      validator: function (value) {
        return value === undefined || dayjs(value).isValid();
      },
      message: "Expiry date must be a valid date or undefined.",
    },
  },
  isActive: {
    type: Boolean,
    default:true
  },
});

const methods = {
  getProduct: async (req, res) => {
    const query = [];
    let stagedQuery = {};
    const stage = [];
    if (req.body.category) {
      query.push({ category: new ObjectId(req.body.category) });
    }
    if (req.body.productname) {
      const regex = { $regex: `${req.body.productname}`, $options: 'i' };
      query.push({ productname: regex });
    }
    if (req.body.productid) {
      query.push({ _id: new ObjectId(req.body.productid) });
    }
    // if (req.body.isActive === false) {
    //   query.push({ isActive: false});
    // }else{
    //   query.push({ isActive: true});
    // }
    if (req.body.customquery) {
      query.push(req.body.customquery);
    }
    if (query.length > 0) {
      stagedQuery.$or = query;
    } else {
      stagedQuery = {};
    }
    stage.push({ $match: stagedQuery });
    stage.push({
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    });
    if (req.body.skip) {
      stage.push({ $skip: Number(req.body.skip) });
    }
    if (req.body.limit) {
      stage.push({ $skip: Number(req.body.limit) });
    }
    const data = await product.aggregate(stage);
    return data;
  },
  addProduct: async (req, res) => {
    const payload = {
      productname: req.body.productname,
      category: new ObjectId(req.body.category),
      price: req.body.price,
      unit: req.body.unit,
      quantity: req.body.quantity,
      expirydate: dayjs(req.body.expirydate),
      createdby: new ObjectId(req.body.createdby),
    };
    const data = await product.create(payload);
    return data;
  }, 
  //soft deleting the product since it is in once to many realtion with the orders, which will create issues while getting the order list if we hard delete
  deleteProduct: async (req, res) => {
    // const data = await product.findByIdAndDelete(new ObjectId(req.body.productid));
    const data = await product.findByIdAndUpdate(new ObjectId(req.params.productid),{$set:{isActive:false}},{new:true});
    return data;
    //once product is delete we need to create custom job to mark all the orders or update orders in relation to product accordingly
  },
  manageProduct: async (req, res) => {
    let update;
    let updatedQuanitity;
    const existingData = await product.findById(new ObjectId(req.params.productid));
    if (req.body.actiontype === 'increment') {
      update =  {$inc:{quantity:req.body.quantity}};
      // updatedQuanitity = existingData.quantity + req.body.quantity;
    }
    else if(req.body.actiontype === 'decrement'){
      update =  {$inc:{quantity: -req.body.quantity}};
      updatedQuanitity = existingData.quantity - req.body.quantity;

    }
    else{
      throw new Error ('action type should be increment/decrement');
    }
    if (updatedQuanitity<0) {
      throw new Error ('Result will make the quantity in negative, Please check!');

    }
    const data = await product.findOneAndUpdate(new ObjectId(req.params.productid),update,{new:true})   ;
    return data;
    
  },
  updateProduct: async (req, res) => {
    const id = new ObjectId(req.body.productid);
    const payload = {}
    if (req.body.productname) {
      payload.productname = req.body.productname;
    }
    if (req.body.price) {
      payload.price = req.body.price;
    }
    if (req.body.unit) {
      payload.unit = req.body.unit;
    }
    if (req.body.quantity) {
      payload.quantity = req.body.quantity;
    }
    if (req.body.expirydate) {
      payload.expirydate = req.body.expirydate;
    }
   
    const data = await product.findOneAndUpdate(
      {_id:id},
      {$set:payload},
      {new:true}
    );
    return data;
  },
};
const product = mongoose.model("Products", productSchema);
module.exports = product;
module.exports.methods = methods;
