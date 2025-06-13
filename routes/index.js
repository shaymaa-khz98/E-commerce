//Routes
const categoryRoute = require('./categoryApi')
const subCategoryRoute = require('./subCategoryApi')
const brandRoute = require('./brandApi')
const productRoute = require('./productApi')
const wishlistRoute = require('./wishlistApi')
const addressRoute = require('./addressApi')
const userRoute = require('./userApi')
const reviewRoute = require('./reviewApi')
const authRoute = require('./authApi')
const couponRoute = require('./couponApi')
const orderRoute = require('./OrderApi')
const cartRoute = require('./CartApi')


const mountRoutes = (app) => {
    app.use('/api/v1/category' ,categoryRoute)
    app.use('/api/v1/subCategory' ,subCategoryRoute)
    app.use('/api/v1/brands' ,brandRoute)
    app.use('/api/v1/products' ,productRoute)
    app.use('/api/v1/users' ,userRoute)
    app.use('/api/v1/reviews' ,reviewRoute)
    app.use('/api/v1/wishlist' ,wishlistRoute)
    app.use('/api/v1/addresses' ,addressRoute)
    app.use('/api/v1/coupons' ,couponRoute)
    app.use('/api/v1/cart' ,cartRoute)
    app.use('/api/v1/orders' ,orderRoute)
    app.use('/api/v1/authenticate' ,authRoute)

}

module.exports = mountRoutes