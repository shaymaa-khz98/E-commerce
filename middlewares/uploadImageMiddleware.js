const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () =>{
//DiskStorage engine
// const multerStorage = multer.diskStorage({
//   //Sets the folder to save uploaded files 
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/categories'); 
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     //uuidv4 for uniqueness
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
//     // cb(null, Date.now() + '-' + file.originalname); // rename the file
//     cb(null, filename)
//   }
// });



// Memory Storage engine
const multerStorage = multer.memoryStorage();
const multerFilter = function(req,file,cb) {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  } else{
    cb(new ApiError('Only Images allowed' , 400), false)
  }
}

const upload = multer({storage : multerStorage , fileFilter: multerFilter})
// console.log('hhhhhhhhhhhhhhhhhhh',upload)
return upload;

}

exports.uploadSingleImage = (fieldName)=> multerOptions().single(fieldName)
 
exports.uploadMixOfImages = (arrayOfFields)=> multerOptions().fields(arrayOfFields);
  