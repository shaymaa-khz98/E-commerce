const User = require('./userModel');
const Product = require('./productModel');
const sequelize = require('../config/database');
const Review = require('./reviewModel');
const Address = require('./addressModel');
const CartItem = require('./CartItem');
const Cart = require('./CartModel');
const Order = require('./orderModel');

// Define relationships
Review.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  as: 'user', // single user in each review
});

User.hasMany(Review, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  as: 'reviews', // Multiple reviews by the user
});


Review.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    allowNull: false,
  },
  as: 'product', // A single product in each review
});

Product.hasMany(Review, {
  foreignKey: {
    name: 'productId',
    allowNull: false,
  },
  as: 'reviews', // Multiple reviews for the product
});

// Wishlist (many-to-many)
User.belongsToMany(Product, {
  through: 'Wishlist',
  as: 'wishlist',
  foreignKey: 'userId',
});
Product.belongsToMany(User, {
  through: 'Wishlist',
  as: 'wishlistedBy',
  foreignKey: 'productId',
});

// Addresses (one-to-many)
User.hasMany(Address, { 
  as: 'addresses', 
  foreignKey: 'userId' 
});
Address.belongsTo(User, { 
  foreignKey: 'userId' 
});

// Associations
Cart.hasMany(CartItem, { 
  foreignKey: 'cartId', 
  onDelete: 'CASCADE',
  as: 'cartItems',
  hooks: true, 
});
CartItem.belongsTo(Cart, { 
  foreignKey: 'cartId', 
  as: 'cart',
  onDelete: 'CASCADE',
  constraints: true,
});

// Cart belongs to User
Cart.belongsTo(User, 
  { foreignKey: 'userId',
     as: 'user' 
  });
User.hasOne(Cart, { 
  foreignKey: 'userId', 
  as: 'cart' 
});

// CartItem belongs to Product
CartItem.belongsTo(Product, { 
  foreignKey: 'productId', 
  as: 'product' 
});
Product.hasMany(CartItem, { 
  foreignKey: 'productId', 
  as: 'cartItems' 
});

// Order belongs to User
Order.belongsTo(User, { 
  foreignKey: 'userId' 
}); 
User.hasMany(Order, { 
  foreignKey: 'userId' 
});

Order.hasMany(CartItem, { 
  foreignKey: 'orderId', 
  as: 'cartItems' 
});
CartItem.belongsTo(Order, { 
  foreignKey: 'orderId' 
});

module.exports = {
  sequelize,
  User,
  Product,
  Review,
  Address,
  Order
};
