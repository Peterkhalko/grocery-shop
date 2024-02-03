const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    userrole: {
      type: String,
      required:true
    },
  },
  {
    timestamps: true,
  }
);

const methods = {
  addUser: async (req, res) => {
    const payload = {
      username: req.body.username,
      userrole: req.body.userrole,
    };
    const data = await user.create(payload);
    return data;
  },
};
const user = mongoose.model("Users", userSchema);
module.exports = user;
module.exports.methods = methods;
