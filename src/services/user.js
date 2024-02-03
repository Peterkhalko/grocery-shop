const user = require('../models/user')
const jwtutil = require('../utils/jwttoken')
const userService = {
   addUser: async (req, res) => {
    const result = {};
    try {
      if (!req.body.username) {
        result.status = 400;
        result.message = "username not provided!";
        return result;
      }
      if (!req.body.userrole) {
        result.status = 400;
        result.message = "userrole is not provided!";
        return result;
      }
      const modelResponse = await user.methods.addUser(req, res);
      if (modelResponse) {
        const token = jwtutil(req,res);
        result.status = 200;
        (result.message = "user created successfully!"),
          (result.data = modelResponse);
          result.token = token;
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
module.exports = userService;
