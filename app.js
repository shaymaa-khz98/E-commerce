const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const morgan = require('morgan')
const cors = require('cors');
const compression = require('compression');


const sequelize = require('./config/database');
const ApiError = require('./utils/apiError')
const globalError = require('./middlewares/errorMiddlewares')

// //Routes
const mountRoutes = require('./routes')

//INSTANCE
const app = express();

// Enable CORS for all origins "enables other domains to access your application"
app.use(cors());
app.options('*', cors()) // include before other routes
/* 
this is the default configuration about corse() ...
{
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
*/ 

//Compress all responses
app.use(compression());

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev')); 
    console.log(`mode ${process.env.NODE_ENV}`)
}  


app.get('/' ,(req,res)=>{
    res.send('Our API')
    console.log('////////////')
})

//MIDDLWARES
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('uploads'))

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