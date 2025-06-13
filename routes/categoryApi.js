const express =require('express');
const { 
    getCategories, 
    getCategory, 
    store, 
    update, 
    destroy, 
    softDelete, 
    uploadCategoryImage,
    resizingImage
} = require('../controllers/CategoryController');
const { 
    getCategoryValidator, 
    storeCategoryValidator, 
    updateCategoryValidator, 
    deleteCategoryValidator 
} = require('../utils/validators/categoryValidator');

const subCategoryApi = require('./subCategoryApi')
const authController = require('../controllers/authController')
const router = express.Router();

router.get('/', getCategories)
router.get('/show/:id', 
    getCategoryValidator,
    getCategory
)
router.post('/',
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    uploadCategoryImage,
    resizingImage,
    storeCategoryValidator, 
    store
)
router.put('/:id', 
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    uploadCategoryImage,
    resizingImage,
    updateCategoryValidator,
    update
)
router.delete('/:id',
    authController.protect,
    authController.allowedTo("admin"),
    deleteCategoryValidator,
    destroy 
)
router.delete('/softDelete/:id',
    authController.protect,
    authController.allowedTo("admin"),
    deleteCategoryValidator,
    softDelete
)

router.use('/:categoryId/subCategory' , subCategoryApi)
module.exports = router