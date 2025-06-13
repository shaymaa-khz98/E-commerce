const express = require('express');

const authController = require('../controllers/authController');
const { 
    getCoupons, 
    getCoupon, 
    storeCoupon, 
    updateCoupon, 
    destroyCoupon, 
    softDeleteCoupon 
} = require('../controllers/couponController');
const { 
    getCouponValidator, 
    storeCouponValidator, 
    updateCouponValidator, 
    deleteCouponValidator 
} = require('../utils/validators/couponValidator');

const router = express.Router();

router.get('/', 
    getCoupons
 )
router.get('/show/:id', 
    getCouponValidator,
    getCoupon
)
router.post('/',
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    storeCouponValidator,
    storeCoupon
)
router.put('/:id',
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    updateCouponValidator,
    updateCoupon
)
router.delete('/:id',
    authController.protect,
    authController.allowedTo("admin"),
    deleteCouponValidator,
    destroyCoupon
)
router.delete('/softDelete/:id',
    authController.protect,
    authController.allowedTo("admin"), 
    deleteCouponValidator,
    softDeleteCoupon
)


module.exports = router