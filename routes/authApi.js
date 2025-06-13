const express = require('express');
const { signup, login, forgotPssword, verifyPassResetCode, resetPassword } = require('../controllers/authController');
const { signupValidator, loginValidator } = require('../utils/validators/authValidator');


const router = express.Router();


router.post('/signup',
    signupValidator,
   signup
)
router.post('/login',
    loginValidator,
   login
)
router.post('/forgotPassword',
   forgotPssword
)
router.post('/verifyResetCode',
   verifyPassResetCode
)
router.put('/resetPassword',
   resetPassword
)


module.exports = router