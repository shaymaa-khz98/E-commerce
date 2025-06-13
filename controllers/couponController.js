
const Coupon = require('../models/couponModel');
const factory = require('./handlersFactory');

exports.getCoupons = factory.getAll(Coupon);
exports.getCoupon = factory.getOne(Coupon);

exports.storeCoupon = factory.storeOne(Coupon);  
exports.updateCoupon = factory.updateOne(Coupon);
exports.destroyCoupon = factory.deleteOne(Coupon);
exports.softDeleteCoupon = factory.softDeleteOne(Coupon);