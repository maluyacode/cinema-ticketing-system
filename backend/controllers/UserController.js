const User = require('../models/User');
const cloudinary = require('cloudinary');
const crypto = require('crypto');
const sendToken = require('../utils/jsonWebToken')
const sendEmail = require('../utils/sendEmail')
const ImageCloudinary = require('../utils/ImageCloudinary');

exports.getAllUser = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        sucess: true,
        users
    })
}

exports.register = async (req, res, next) => {
    console.log(req);
    const profile_pic = await ImageCloudinary.uploadSingle(req.body.profile_pic, 'movie-ticketing-system/profiles');

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        profile_pic
    });

    if (!user) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create an account'
        })
    }

    sendToken(user, 200, res);
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' })
    }

    const user = await User.findOne({ email }).select('+password'); // get user including password

    if (!user) {
        return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    const passwordMatched = await user.comparePassword(password); // check if the password is matched to the user account

    if (!passwordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    sendToken(user, 200, res)
}

exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        sucess: true,
        message: 'Logged Out'
    })
}

exports.profile = async (req, res, next) => {
    return res.status(200).json(req.user);
}

exports.update = async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if (req.file) {
        const user = await User.findById(req.user.id);
        const res = await cloudinary.v2.uploader.destroy(user.profile_pic.public_id);

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'profiles', // folder name in cloudinary, if not exist it will create automatically.
            width: 200, // convert the width of image to 200 pixel
            crop: "scale",
        });

        newUserData.profile_pic = {
            public_id: result.public_id,
            url: result.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    if (!user) {
        return res.status(401).json({ message: "User not updated" });
    }

    res.status(200).json({
        success: true,
        user
    })

}

exports.forgotPassword = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })
    }
    // Get reset token
    const resetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${process.env.REACT_PUBLIC_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow: <a href="${resetUrl}">${resetUrl}</a> If you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: `${process.env.APP_NAME} Password Recovery`,
            message,
        })

        return res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
        // return next(new ErrorHandler(error.message, 500))
    }
}

exports.resetPassword = async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })
        // return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })
        // return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
}

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(400).json({ message: 'Old password is incorrect' })

    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)
}

exports.destroy = async (req, res, next) => {

}