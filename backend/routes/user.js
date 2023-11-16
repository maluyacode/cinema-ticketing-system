const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { isAuthenticated, isAuthorized } = require('../middleware/auth');

const {
    getAllUser,
    register,
    login,
    logout,
    profile,
    update,
    forgotPassword,
    resetPassword
} = require('../controllers/UserController');


router.get('/users', getAllUser);
router.post('/register', upload.single("profile_pic"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/my-profile', isAuthenticated, profile);
router.put('/user/update', isAuthenticated, upload.single("profile_pic"), update);

router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

module.exports = router;