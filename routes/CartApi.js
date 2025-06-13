const express = require('express');

const authController = require('../controllers/authController');
const { addProductToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, updateCartItemQuantity, applyCoupon } = require('../controllers/CartController');

const router = express.Router();

// router.get('/', 
//     getBrands
//  )
// router.get('/show/:id', 
//     getBrandValidator,
//     getBrand
// )
router.post('/',
    authController.protect,
    authController.allowedTo("user"),
    addProductToCart
)
router.get('/',
    authController.protect,
    authController.allowedTo("user"),
    getLoggedUserCart
)
router.delete('/:itemId',
    authController.protect,
    authController.allowedTo("user"),
    removeSpecificCartItem
)
router.delete('/',
    authController.protect,
    authController.allowedTo("user"),
    clearCart
)
router.put('/applyCoupon',
    authController.protect,
    authController.allowedTo("user"),
    applyCoupon
)
router.put('/:itemId',
    authController.protect,
    authController.allowedTo("user"),
    updateCartItemQuantity
)

// router.put('/:id',
//     authController.protect,
//     authController.allowedTo("admin" , "manager"),
//     uploadCategoryImage,
//     resizingImage,
//     updateBrandValidator,
//     update
// )
// router.delete('/:id',
//     authController.protect,
//     authController.allowedTo("admin"),
//     deleteBrandValidator,
//     destroy
// )
// router.delete('/softDelete/:id',
//     authController.protect,
//     authController.allowedTo("admin"), 
//     deleteBrandValidator,
//     softDelete
// )


module.exports = router