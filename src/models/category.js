const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const groceryCategorySchema = new mongoose.Schema(
  {
    categoryname: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const methods = {
  findCategory: async (req, res) => {
    try {
      const query = [];
      let stagedQuery = {}; 
      const stage = [];
  
      if (req.body.categoryid) {
        query.push({ _id: new ObjectId(req.body.categoryid) });
      }
  
      if (req.body.categoryname) {
        const regex = { $regex: `${req.body.categoryname}`, $options: 'i' };
        query.push({ categoryname: regex });
      }
      if (req.body.customquery) {
        query.push(req.body.customquery);
      }
  
      if (query.length > 0) {
        stagedQuery.$or = query;
      } else {
        stagedQuery = {};
      }
  
  
      stage.push({ $match: stagedQuery });
  
      if (req.body.skip) {
        stage.push({ $skip: Number(req.body.skip) });
      }
  
      if (req.body.limit) {
        stage.push({ $limit: Number(req.body.limit) }); // 
      }
      console.log("stage", JSON.stringify(stage, null, 4));

  
      const data = await groceryCategory.aggregate(stage);
      return data;
    } catch (error) {
      console.log("error", error);
    }
  },
  
  addCategory: async (req, res) => {
    const payload = {
      categoryname: req.body.categoryname,
      createdby: req.body.createdby,
    };
    const data = await groceryCategory.create(payload);
    return data;
  },
  //soft deleting the category since it is in one to many realtion with the prodcut, which will create issues while getting the product list if we hard delete
  deleteCategory: async (req, res) => {
    // const data = await groceryCategory.findByIdAndDelete(new ObjectId(req.body.categoryid));
    const data = await groceryCategory.findByIdAndUpdate(
      new ObjectId(req.body.categoryid),
      { $set: { isActive: false } },
      { new: true }
    );
    return data;
    //once category is delete we need to create custom job to mark all the product or update products in relation to category accordingly
  },
};
const groceryCategory = mongoose.model("Categories", groceryCategorySchema);
module.exports = groceryCategory;
module.exports.methods = methods;
