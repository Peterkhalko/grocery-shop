const userService = require("../services/user");

const userController = {
  addUser: async (req, res) => {
    const serviceResponse = await userService.addUser(req, res);
    res.send(serviceResponse);
  },

};
module.exports = userController;
