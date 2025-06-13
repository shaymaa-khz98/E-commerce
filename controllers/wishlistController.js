const asyncHandler = require('express-async-handler');
const { User, Product } = require('../models');

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const user = await User.findByPk(req.user.id);
  const product = await Product.findByPk(productId);

  if (!user || !product) {
    return res.status(404).json({ status: 'fail', message: 'User or Product not found' });
  }

  await user.addWishlist(product); // Will only add if not already in wishlist (Sequelize handles deduplication)

const wishlist = await user.getWishlist({
  joinTableAttributes: [], // this works in Sequelize v6+ insted of this through: { attributes: [] }
});

res.status(200).json({
  status: 'success',
  message: 'Product added successfully to your wishlist.',
  data: wishlist
});
});

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const user = await User.findByPk(req.user.id);
  const product = await Product.findByPk(productId);

  if (!user || !product) {
    return res.status(404).json({ status: 'fail', message: 'User or Product not found' });
  }

  await user.removeWishlist(product);

  const wishlist = await user.getWishlist({
  joinTableAttributes: [], 
  });

  res.status(200).json({
    status: 'success',
    message: 'Product removed successfully from your wishlist.',
    data: wishlist,
  });
});

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    include: {
      model: Product,
      as: 'wishlist',
      through: { attributes: [] },
    },
  });

  res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: user.wishlist,
  });
});


