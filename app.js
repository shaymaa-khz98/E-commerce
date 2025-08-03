const express = require('express');
const dotenv = require('dotenv');
dotenv.config()


const applySecurityMiddleware = require('./config/security');
const sequelize = require('./config/database');
const ApiError = require('./utils/apiError')
const globalError = require('./middlewares/errorMiddlewares')

// //Routes
const mountRoutes = require('./routes')

//INSTANCE
const app = express();



app.get('/' ,(req,res)=>{
    res.send('Our API')
    console.log('////////////')
})

//MIDDLWARES

applySecurityMiddleware(app);


//Routes
mountRoutes(app);

app.all('*' ,(req,res,next) =>{
    // const err = new Error(`Cant find this rout : ${req.originalUrl}`)
    next(new ApiError(`Cant find this rout : ${req.originalUrl}`, 400))
})

//Global error handling middlewares
app.use(globalError);

sequelize
.sync({force:false})    
.then(()=>{ 
    console.log("Connected to Database & Tables Created Successfully");
   const server = app.listen(5000 , ()=>{
     console.log('Server Started : 5000')
    })

}) 
.catch((error)=>{
    console.log('connection Authentication error '+error)
})

// Events => list => callback(err) ***For NON-Express Error
process.on('unhandledRejection',(err)=>{
    console.error(`UnhandledRejection Errors : ${err}`)
    // server.close(()=>{
    //     console.erro
    // })
    // process.exit(1);
})