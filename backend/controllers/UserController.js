const User = require('../models/User');
const cloudinary = require('cloudinary');
const crypto = require('crypto');
const sendToken = require('../utils/jsonWebToken')
const sendEmail = require('../utils/sendEmail')
const ImageCloudinary = require('../utils/ImageCloudinary');
const { OAuth2Client } = require('google-auth-library');
const { response } = require('express');

const client = new OAuth2Client({ clientId: process.env.GOOGLE_API_TOKEN })

exports.getAllUser = async (req, res, next) => {

    try {

        const users = await User.find();

        res.status(200).json({
            sucess: true,
            users
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }

}

exports.getSingleUser = async (req, res, next) => {

    try {
        const { id } = req.params

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not created"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }

}

exports.updateUserByAdmin = async (req, res, next) => {

    try {

        const { name, email, password, role } = req.body;
        const { id } = req.params

        const newUserData = {
            name,
            email,
            password,
            role
        }

        if (password === '') {
            delete newUserData.password
        }

        const user = await User.findById(id)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        let images;

        if (req.files.length > 0) {
            let imagesUrl
            if (user.images) {
                imagesUrl = user.images.flatMap(image => image.public_id)
                for (i in imagesUrl) {
                    await cloudinary.v2.uploader.destroy(imagesUrl[i]);
                }
            }
            images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/movies');
            newUserData.images = images
        }

        const updatedUser = await User.findByIdAndUpdate(id, newUserData, {
            new: true,
            runValidators: true
        })

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create an account'
            })
        }

        res.status(200).json({
            success: true,
            user: updatedUser
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }
}

exports.register = async (req, res, next) => {

    try {

        const { name, email, password, role } = req.body;

        let images;
        if (req.files.length > 0) {
            images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/profiles');
        }

        const user = await User.create({
            name,
            email,
            password,
            images,
            role
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create an account'
            })
        }

        sendToken(user, 200, res);

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email & password' })
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
    return res.status(200).json({
        success: true,
        user: req.user,
        message: 'Pogi mo diyan ah'
    });
}

exports.update = async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findById(req.user.id)

    let images;

    if (req.files.length > 0) {
        let imagesUrl
        if (user.images) {
            imagesUrl = user.images.flatMap(image => image.public_id)
            for (i in imagesUrl) {
                await cloudinary.v2.uploader.destroy(imagesUrl[i]);
            }
        }
        images = await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/movies');
        newUserData.images = images
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })

    if (!user) {
        return res.status(401).json({ message: "User not updated" });
    }

    res.status(200).json({
        success: true,
        user: updatedUser
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
    const { id } = req.params;

    try {

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }


}

exports.loginWithGoogle = async (req, res, next) => {
    try {

        const { credential } = req.body;

        const { payload } = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_API_TOKEN });
        console.log(payload)
        if (payload.email_verified) {
            const { email, name, picture, iss } = payload

            const user = await User.findOne({ email });

            const image = {
                url: picture,
                public_id: iss
            }

            if (!user) {
                const newUser = await User.create({
                    name,
                    email,
                    images: [image],
                    password: email + process.env.JWT_SECRET
                })
                sendToken(newUser, 200, res)

            } else {
                sendToken(user, 200, res)
            }
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: `Error occured, contact the developer for inquiries`,
        })
    }
}