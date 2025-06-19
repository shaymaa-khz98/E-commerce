
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const asyncHandler = require("../utils/asyncHandler");
const factory = require('./handlersFactory');
const ApiError = require("../utils/apiError");

const  Order = require("../models/orderModel");
const  Product = require("../models/productModel");
const CartItem = require("../models/CartItem");
const Cart = require("../models/CartModel");
const  User = require("../models/userModel");


exports.createCashOrder = asyncHandler(async(req,res,next)=>{
    const taxPrice = 0;
    const shippingPrice = 0;

    // 1) Get cart based on cartId
   const cart = await Cart.findByPk(req.params.cartId, {
  include: [
    {
      model: CartItem,
      as: 'cartItems',
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['sold', 'quantity'],
        },
      ],
    },
  ],
});

    // console.log('Beforeeeee' , cart.cartItems)

    if(!cart) {
        return res.status(404).send({status:'fail',message:'Cart not Found'})
    }

    // 2) Get order price (check for discounts)
    const cartPrice = cart.totalPriceAfterDiscount || cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) Create order 
    const order = await Order.create({
        userId: req.user.id,
        shippingAddress : req.body.shippingAddress,
        totalOrderPrice,
        paymentMethodType :'cash'
    })

    // 4) Update product stock and sold count 

    for(item of cart.cartItems) {
        console.log()
        await Product.increment(
         { sold : item.quantity },
         { where: { id: item.productId }},
      )
        await Product.decrement(
         { quantity: item.quantity },
         { where: { id: item.productId }},
      )
    }
    await CartItem.update(
      { orderId: order.id },
      { where: { cartId: cart.id } }
    );

    // 5) Clear the cart 
    // await CartItem.destroy({ where: { cartId: cart.id } });
    await Cart.destroy({ where: {id :cart.id}})

    res.status(201).send({
        status: 'success',
        data: order
    })
})
exports.filterOrderForLoggedUser = asyncHandler(async(req,res,next) =>{
    if(req.user.role === "user"){
        req.filterObj = {userId : req.user.id}
    }
    next();
})


exports.getAllOrders = factory.getAll(Order,"Order" ,
    {
      model: CartItem,
      as: 'cartItems',
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    },
)
exports.getSpecificOrder = factory.getOne(Order,
    [
        {
            model:User,
            as:"user",
            attributes:["id" , "name" , "email","profileImg"]
        },
        {
      model: CartItem,
      as: 'cartItems',
      attributes:["productId"],
      include: [
        {
          model: Product,
          as: 'product',
          attributes:["title" ,"imageCover"]

        },
      ],
    }],
)

exports.updateOrderToPaid = asyncHandler(async(req,res,next) => {
    const order = await Order.findByPk(req.params.id);

    if(!order) {
        return res.status(404).send({status:'fail' ,message:'No Order for this id'})
    }

    // Update Order To Paid

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).send({status:'success' , data : updatedOrder})
})
exports.updateOrderToDelivered = asyncHandler(async(req,res,next) => {
    const order = await Order.findByPk(req.params.id);

    if(!order) {
        return res.status(404).send({status:'fail' ,message:'No Order for this id'})
    }

    // Update Order To Delivered

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).send({status:'success' , data : updatedOrder})
})

exports.checkoutSession = asyncHandler(async(req,res,next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
// 1) Get cart by ID 
  const cart = await Cart.findByPk(req.params.cartId);
  if(!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}` , 404)
    )
  }

  // 2) Calculate total order price 
  const cartPrice = cart.totalPriceAfterDiscount ?? cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice ;
;

  // 3) Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name,
          },
          unit_amount: Math.round(totalOrderPrice * 100), // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/success.html`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: {
      ...req.body.shippingAddress,
    },
  });

  // 4) Send session in response
   res.status(200).json({ status: 'success', session });

})

exports.createCardOrder = asyncHandler(async (session) => {
  console.log("📦 Creating order from session:", session.id);
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  // 1) Find cart and user
  const cart = await Cart.findByPk(cartId, {
    include: [{ 
      model: CartItem ,
      as:'cartItems', 
  
      include: [{model: Product, as: 'product'}] 
    }]
  });

  if (!cart) throw new Error("Cart not found");

  const user = await User.findOne({
    where: { email: session.customer_email }
  });

  if (!user) throw new Error("User not found");

  // 2) Create order
  const order = await Order.create({
    userId: user.id,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: new Date(),
    paymentMethodType: 'card',
  });

  // 3) Create OrderItems based on cartItems (if needed)
  const cartItems = cart.cartItems;

  for (const item of cartItems) {
      await Product.increment(
      { sold: item.quantity },
      { where: { id: item.productId } }
    );

    await Product.decrement(
      { quantity: item.quantity },
      { where: { id: item.productId } }
    );
   }

  // 5) Delete the cart and its items
  await CartItem.destroy({ where: { cartId } });
  await Cart.destroy({ where: { id: cartId } });
});


exports.webhookCheckOut = asyncHandler(async(req,res,next) => {

  console.log('11111111111111111')
    const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ تحققنا من Stripe، الآن نتعامل مع الأحداث
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // 🟢 هنا تنشئي Order في قاعدة البيانات بناءً على بيانات session
    console.log("💵 Payment Success, session:", session);

    // مثال:
    // const order = await Order.create({
    //   userEmail: session.customer_email,
    //   cartId: session.client_reference_id,
    //   totalAmount: session.amount_total / 100
    // });
    await exports.createCardOrder(session)

  }

  res.status(200).json({ received: true });
})