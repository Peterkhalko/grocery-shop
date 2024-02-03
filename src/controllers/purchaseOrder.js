const purchaseOrder = require("../services/purchaseOrder");

const purchaseOrderController = {

  createOrders: async (req, res) => {
    const serviceResponse = await purchaseOrder.createOrders(req, res);
    res.send(serviceResponse);
  },
  getOrders: async (req, res) => {
    const serviceResponse = await purchaseOrder.getOrders(req, res);
    res.send(serviceResponse);
  },

};
module.exports = purchaseOrderController;
