const express = require('express');
const { 
    getBrands, 
    store,
    update, 
    destroy, 
    softDelete, 
    uploadCategoryImage, 
    resizingImage, 
    getBrand
} = require('../controllers/BrandController');
const { 
    storeBrandValidator, 
    getBrandValidator, 
    updateBrandValidator, 
    deleteBrandValidator 
} = require('../utils/validators/brandValidator');
const authController = require('../controllers/authController')

const router = express.Router();

router.get('/', 
    getBrands
 )
router.get('/show/:id', 
    getBrandValidator,
    getBrand
)
router.post('/',
    authController.protect,
    authController.allowedTo("admin" , "manager","user"),
    uploadCategoryImage,
    resizingImage,
     storeBrandValidator,
    store
)
router.put('/:id',
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    uploadCategoryImage,
    resizingImage,
    updateBrandValidator,
    update
)
router.delete('/:id',
    authController.protect,
    authController.allowedTo("admin"),
    deleteBrandValidator,
    destroy
)
router.delete('/softDelete/:id',
    authController.protect,
    authController.allowedTo("admin"), 
    deleteBrandValidator,
    softDelete
)


module.exports = router