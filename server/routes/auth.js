const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const auth = require('../middleware/auth');  // ✅ correctly imported

router.post('/register', validateRegister, authController.registerUser);
router.post('/login', validateLogin, authController.loginUser);
router.get('/me', auth, authController.getCurrentUser); // ✅ corrected
router.post('/logout', authController.logoutUser);
router.get('/', auth, authController.getCurrentUser);

module.exports = router;
