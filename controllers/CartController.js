const { Op } = require("sequelize");
const { Product } = require("../models");
const CartItem = require("../models/CartItem");
const Cart = require("../models/CartModel");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const calcTotalCartPrice = async(cart) =>{
    const item = await CartItem.findAll({ where:{cartId : cart.id},
    });
      //  console.log("Warrrd",item)

    let totalPrice = 0;
    item.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    await cart.save();
}

exports.addProductToCart = asyncHandler(async(req,res,next) => {
 const {productId ,color} = req.body;
 const userId = req.user.id
// 1) Find product
const product = await Product.findByPk(productId)
  if(!product) {
      return res.status(404).send({status:'fail' , message:'product not found'})
   }
// 2) Find or Create cart for the user
let cart = await Cart.findOne({ where:{ userId },  include: {
    model: CartItem,
    as: 'cartItems',
  },
})

if(!cart) {
   cart = await Cart.create({userId})
}
// 3) Check if product with same color exists in cart

let existingItem = await CartItem.findOne({
    where:{
      cartId: cart.id,
      productId: productId,
      color: color,
    }   
})
if(existingItem){
  // Product exists => increment quantity
  existingItem.quantity+=1;
  await existingItem.save();      
} else{
 // Product does not exist => add new item
 await CartItem.create({
    cartId: cart.id,
    productId: productId,
    quantity:1,
    color,
    price: product.price,
 })
}

// 4) Recalculate cart total
calcTotalCartPrice(cart);

const updatedCart = await Cart.findByPk(cart.id,{
  include:{ 
    model: CartItem,
    as: 'cartItems',
     include:{
    model: Product,
    as: 'product',
   }
}
})
res.status(200).send({
    status:'success',
    message:'Product addedd to cart successfully',
    numOfCartItems: updatedCart.cartItems.length,
    data:updatedCart
 })
})  

exports.getLoggedUserCart = asyncHandler(async(req,res,next) => {
  const cart = await Cart.findOne({ 
    where:{ 
      userId : req.user.id 
    }, 
    include:{
      model: CartItem,
      as: 'cartItems',
      include:{
      model: Product,
      as: 'product',
   }}
  });

  res.status(200).send({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart
 })
})

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  // 1) Find User's Cart
  const cart = await Cart.findOne({where:{ userId }})

  if(!cart){
    return res.status(404).send({status:'faild' , message:'Cart Not Found'})
  }

  // 2) Delete the specific cartItem with id and cart.id
  await CartItem.destroy({where: {
    id: itemId,
    cartId: cart.id
  }})

  // 3) Recalculate total Cart price
  await calcTotalCartPrice(cart);

  // 4) send update cart response
  const updatedItems = await CartItem.findAll({where:{cartId: cart.id}});

  res.status(200).send({
    status:'success',
    numOfCartItems: updatedItems.length,
    data: updatedItems
 })
})

exports.clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ where: { userId } });

  if (!cart) {
    return res.status(204).send();
  }

  // Delete all cart items
  await CartItem.destroy({ where: { cartId: cart.id } });

  // Delete the cart
  await Cart.destroy({ where: { id: cart.id } });

  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async(req,res,next)=>{
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const quantity = req.body.quantity;

  const cart = await Cart.findOne({ where:{ userId }})
  
  if(!cart){
    return res.status(404).send({status:'fail' , message:'Cart Not Found'})
  }
// Find spesefic Cart item
  const cartItem = await CartItem.findOne({where:{
    id: itemId,
    cartId: cart.id
  }})

  if(!cartItem){
      return res.status(404).send({
       status: 'fail',
       message: 'Cart item not found',
  })
} 

// Update the quantity
await cartItem.update({quantity})

const updatedItems = await CartItem.findAll({
   where: { cartId: cart.id },
  include: {
    model: Product,
    as: "product",
  }
})
calcTotalCartPrice(cart)

  res.status(200).send({
    status:'success',
    numOfCartItems: updatedItems.length,
    data: updatedItems
 }) 
})

exports.applyCoupon = asyncHandler(async(req,res,next)=>{
  const userId = req.user.id;
  const coupon = await Coupon.findOne({
    where:{
      name : req.body.coupon,
      expire :  { [Op.gt]: Date.now() }
    }})

    if(!coupon){
      return next(new ApiError('Coupon is invalid or expired'))
    }

    const cart = await Cart.findOne({where:{userId},
      include:{
        model: CartItem,
        as: 'cartItems',
      }
    });

    const totalPrice = cart.totalCartPrice

    //Calculate price after "priceAfterDiscount"
    const totalPriceAfterDiscount = (
      totalPrice - (totalPrice * coupon.discount) / 100)
      .toFixed(2); //99.23

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
    res.status(200).send({
      status:"success",
      numOfCartItems:cart.cartItems.length,
      data : cart
    })

})
