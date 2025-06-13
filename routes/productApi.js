const express = require('express');
const { 
    getProducts, 
    getProduct, 
    store, 
    update, 
    destroy, 
    softDelete, 
    uploadProductsImages,
    resizingProcuctsImages
} = require('../controllers/ProductController');
const { 
    storeProductValidator, 
    updateProductValidator, 
    deleteProductValidator, 
    getProductValidator
} = require('../utils/validators/productValidator');

const authController = require('../controllers/authController')
const reviewApi = require('./reviewApi')

const router = express.Router();
// Post /products/productId'2'/reviews
// Get  /products/productId'2'/reviews
// Get  /products/productId'2'/reviews/:id =>'reviewId' // that mean get specific review for spesific product
router.use('/:productId/reviews' , reviewApi)

router.get('/', 
    getProducts
 )
router.get('/show/:id', 
    getProductValidator,
    getProduct
)
router.post('/',
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    uploadProductsImages,
    resizingProcuctsImages,
     storeProductValidator,
    store
)
router.put('/:id', 
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    uploadProductsImages,
    resizingProcuctsImages,
    updateProductValidator,
    update
)
router.delete('/:id',
    authController.protect,
    authController.allowedTo("admin"),
    deleteProductValidator,
    destroy
)
router.delete('/softDelete/:id', 
    authController.protect,
    authController.allowedTo("admin" ),
    deleteProductValidator,
    softDelete
)


module.exports = router