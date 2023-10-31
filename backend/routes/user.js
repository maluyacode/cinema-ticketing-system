const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')
const { getAllUsers, register, login } = require('../controllers/UserController')

router.post('/register', upload.single("profile_pic"), register);
router.post('/login', login);

module.exports = router;