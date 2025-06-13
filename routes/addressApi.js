const express = require('express');

const authController = require('../controllers/authController');
const { addAddress, removeAddress, getUserAddresses } = require('../controllers/addressController');

const router = express.Router();


router.post('/',
    authController.protect,
    authController.allowedTo("user"),
   addAddress
)
router.get('/',
    authController.protect,
    authController.allowedTo("user"),
    getUserAddresses
   
)
router.delete('/:addressId',
    authController.protect,
    authController.allowedTo("user"),
    removeAddress
)

module.exports = router