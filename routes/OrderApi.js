const express = require('express');

const authController = require('../controllers/authController');
const { createCashOrder, getAllOrders, filterOrderForLoggedUser, getSpecificOrder, updateOrderToPaid, updateOrderToDelivered, checkoutSession } = require('../controllers/orderController');
const { getSpesificOrderValidator } = require('../utils/validators/OrderValidator');

const router = express.Router();


router.post('/:cartId',
    authController.protect,
    authController.allowedTo("user"),
    createCashOrder
)
router.get('/',
    authController.protect,
    authController.allowedTo("user" ,"admin" ,"manager"),
    filterOrderForLoggedUser,
    getAllOrders
)
router.get('/:id',
    authController.protect,
    authController.allowedTo("user" ,"admin" ,"manager"),
    getSpesificOrderValidator,
    getSpecificOrder
)
router.put('/:id/pay',
    authController.protect,
    authController.allowedTo("admin" ,"manager"),
    updateOrderToPaid
)
router.put('/:id/deliver',
    authController.protect,
    authController.allowedTo("admin" ,"manager"),
    updateOrderToDelivered
)
router.get('/checkout-session/:cartId',
    authController.protect,
    authController.allowedTo("user"),
    checkoutSession
)


module.exports = router