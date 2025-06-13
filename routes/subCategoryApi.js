const express =require('express');

const { 
    getSubCategories, 
    store, 
    update, 
    softDelete, 
    destroy, 
    setCategoryIdToBody, 
    createFilterObj 
} = require('../controllers/SubCaregoryController');
const { 
    deleteSubCategoryValidator, 
    updateSubCategoryValidator, 
    getSubCategoryValidator, 
    storeSubCategoryValidator
} = require('../utils/validators/subCategoryValidator');

const authController = require('../controllers/authController')



const router = express.Router({ mergeParams: true });

router.get('/', 
    createFilterObj,
    getSubCategories
 )
router.get('/show/:id', 
    getSubCategoryValidator,
    getSubCategories
)
router.post('/',
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    setCategoryIdToBody,
    storeSubCategoryValidator, 
    store
)
router.put('/:id', 
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    updateSubCategoryValidator,
    update
)
router.delete('/:id',
    authController.protect,
    authController.allowedTo("admin"),
    deleteSubCategoryValidator,
    destroy
)
router.delete('/softDelete/:id',
    authController.protect,
    authController.allowedTo("admin"), 
    deleteSubCategoryValidator,
    softDelete
)

module.exports = router