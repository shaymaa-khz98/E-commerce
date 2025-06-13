const { validationResult } = require("express-validator")

const validatorMiddleware = (req,res,next)=>{
    const validator = validationResult(req);
    if(!validator.isEmpty()){
      return res.status(400).send({status:false ,
        message : validator.array({onlyFirstError:true})[0].msg})
     
    }

    next(); // So if there is No validator error , So go tho the next => getCategory middlewares
}

module.exports = validatorMiddleware;