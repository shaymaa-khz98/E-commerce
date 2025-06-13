const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/express-validator");
const { Order } = require("../../models");

exports.getSpesificOrderValidator = [
  check("id")
    .isInt()
    .withMessage("ID must be an integer")
    .custom(async (val , {req}) => {
      if(req.user.role === 'user') {
        const order = await Order.findByPk(val);
      if (!order) {
        return Promise.reject(`No order found with id: ${val}`);
      }
      // Check if the logged-in user is the order owner
      if (order.userId !== req.user.id) {
        return Promise.reject('You are not allowed to perform this action');
      }
    }
    return true;
  }),
  validatorMiddleware,
];