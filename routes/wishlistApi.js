const express = require('express');

const authController = require('../controllers/authController');
const { 
    addProductToWishlist, 
    removeProductFromWishlist, 
    getLoggedUserWishlist
} = require('../controllers/wishlistController');

const router = express.Router();


router.post('/',
    authController.protect,
    authController.allowedTo("user"),
   addProductToWishlist
)
router.get('/',
    authController.protect,
    authController.allowedTo("user"),
   getLoggedUserWishlist
)
router.delete('/:productId',
    authController.protect,
    authController.allowedTo("user"),
    removeProductFromWishlist
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