const ApiError = require("../utils/apiError");

const globalError = (err,req,res,next)=>{
    console.log("ppppppppp",{err})
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // res.status(404).send({status:false , message:"Not Foundddd" , error : err})
    // res.status(err.statusCode).send({ 
    //     status: err.status ,
    //      error: err , 
    //      message: err.message ,
    //      stack: err.stack
    //     });
const handleJwtInvalidSignature = ()=> {
   return new ApiError('Invalid Token , please login again ...' , 401);
}
const handleJwtExpired = ()=> {
   return new ApiError('Expired Token , please login again ...' , 401);
}

    if(process.env.NODE_ENV === 'development'){
        sendErrorForDev(err,res);
    }else{
        if(err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if(err.name === 'TokenExpiredError') err = handleJwtExpired();
      sendErrorForProd(err,res);
    } 
}

const sendErrorForDev = (err , res) =>{

    return res.status(err.statusCode).send({
        status: err.status ,
         error: err , 
         message: err.message ,
         stack: err.stack
    })
}

const sendErrorForProd = (err,res) =>{
    return res.status(err.statusCode).send({
        status: err.status ,
        message: err.message

    })
}
module.exports = globalError;