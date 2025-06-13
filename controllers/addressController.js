const asyncHandler = require('express-async-handler');
const { User, Product, Address } = require('../models');

// @desc    Add address for user
// @route   POST /api/v1/addresses
// @access  Protected/User
exports.addAddress = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).send({ status: 'fail', message: 'User not found' });
  }

  const address = await user.createAddress({
    alias: req.body.alias,
    details: req.body.details,
    phone: req.body.phone,
    city: req.body.city,
    postalCode: req.body.postalCode,
  });

  res.status(201).json({
    status: 'success',
    message: 'Address added successfully',
    data: address,
  });
});

// @desc    Remove address
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User
exports.removeAddress = asyncHandler(async (req, res) => {
  const {addressId} = req.params
  const address = await Address.findOne({ where :{
    id : addressId,
    userId : req.user.id
  }})
  if(!address){
    return res.status(404).send({status:'fail' ,message: 'Address not found'})
  }
  await address.destroy();
  res.status(200).json({
    status: 'success',
    message: 'Address removed successfully',
  });
});

// @desc    Get all user addresses
// @route   GET /api/v1/addresses
// @access  Protected/User
exports.getUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: {
      model: Address,
      as: 'addresses',
    },
  });

  res.status(200).json({
    status: 'success',
    results: user.addresses.length,
    data: user.addresses,
  });
});