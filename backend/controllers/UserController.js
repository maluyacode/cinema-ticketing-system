const cloudinary = require('cloudinary')
const User = require('../models/User')
const sendToken = require('../utils/jsonWebToken')

exports.getAllUsers = (req, res, next) => {
    res.send("Final Route")
}

exports.register = async (req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'profiles', // folder name in cloudinary, if not exist it will create automatically.
        width: 200, // convert the width of image to 200 pixel
        crop: "scale",
    });

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        profile_pic: {
            public_id: result.public_id,
            url: result.secure_url,
        }
    });

    if (!user) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create an account'
        })
    }

    sendToken(user, 200, res);
}
