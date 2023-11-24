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
    resetPassword,
    getSingleUser,
    updateUserByAdmin,
    destroy,
    loginWithGoogle
} = require('../controllers/UserController');


router.get('/users', isAuthenticated, isAuthorized('admin'), getAllUser);
router.get('/single-user/:id', isAuthenticated, isAuthorized('admin'), getSingleUser)
router.put('/user/update-by-admin/:id', isAuthenticated, isAuthorized('admin'), upload.array("images"), updateUserByAdmin);
router.delete('/user/delete/:id', isAuthenticated, isAuthorized('admin'), upload.array("images"), destroy);

router.post('/register', upload.array("images"), register);
router.post('/login', login);
router.post('/login-with-google', loginWithGoogle);
router.get('/logout', logout);
router.get('/my-profile', isAuthenticated, profile);
router.put('/user/update', isAuthenticated, upload.array("images"), update);

router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

module.exports = router;