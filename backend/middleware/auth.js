const User = require('../models/User')
const jwt = require("jsonwebtoken")

exports.isAuthenticated = async (req, res, next) => {

    if (req.headers.authorization) {
        req.cookies.token = req.headers.authorization
    }
    const { token } = req.cookies
    // console.log(token)

    // if (!token) {
    //     return next(new ErrorHandler('Login first to access this resource.', 401))
    // }

    if (!token) {
        return res.status(401).json({ message: 'Login first to access this resource' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id);

    next()
};

exports.isAuthorized = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role (${req.user.role}) is not allowed to acccess this resource` })
        }
        next()
    }
}