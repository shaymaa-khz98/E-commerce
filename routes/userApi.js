const express = require('express');

const { 
    getUsers, 
    getUser, 
    uploadUserImage, 
    store, 
    update, 
    destroy, 
    softDelete, 
    resizingImage, 
    getLoggedUserData, 
    updateLoggedUserPassword, 
    updateLoggedUserData, 
    deActivateLoggedUserData, 
    reactivateAccount 
} = require('../controllers/userController');
const { 
    storeUserValidator, 
    changeUserPasswordValidator, 
    deleteUserValidator, 
    updateUserValidator, 
    getUserValidator, 
    updateLoggedUserValidator
} = require('../utils/validators/userValidator');

const authController = require('../controllers/authController');
const { onlyAdminRoleEdit } = require('../middlewares/onlyAdminRoleEdit');

const router = express.Router();
// router.use(authController.protect) // that's mean  all routes needs to be loging in

router.get('/getMe',
    authController.protect,
    getLoggedUserData , 
    getUser
);
router.put(
    '/changeMyPassword',
    authController.protect,
    changeUserPasswordValidator,
    updateLoggedUserPassword
 );
router.put(
    '/updateMyData',
    authController.protect,
    uploadUserImage,
    resizingImage,
    updateLoggedUserValidator,
    updateLoggedUserData
 );
 router.put(
    '/deActivationMe',
    authController.protect,
    deActivateLoggedUserData
 );
 router.put(
    '/reActivationMe',
    authController.softProtect,
    reactivateAccount
 );

router.get('/',
    authController.protect,
    authController.allowedTo("admin" , "manager"),
    getUsers
 )

router.get('/show/:id',
    authController.protect,
    authController.allowedTo("admin" , "manager"), 
   getUserValidator,
   getUser
)

router.post('/',
    authController.protect,
    authController.allowedTo("admin"),
    uploadUserImage,
    resizingImage,
    storeUserValidator,
    store
)
router.put('/:id',
    authController.protect,
    authController.allowedTo("admin"),
    onlyAdminRoleEdit,
    update
)
router.delete('/:id',
    authController.protect,
    authController.allowedTo("admin"),
   deleteUserValidator,
   destroy
)
router.delete('/softDelete/:id',
    authController.protect,
    authController.allowedTo("admin"), 
   deleteUserValidator,
   softDelete
)


module.exports = router