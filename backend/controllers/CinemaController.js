const Cinema = require('../models/Cinema');
const cloudinary = require('cloudinary');
const ImageCloudinary = require('../utils/ImageCloudinary')

exports.create = async (req, res, next) => {

    const { name, location, capacity, seat_layout, screen_type } = req.body;

    const images= await ImageCloudinary.uploadMultiple(req.files, 'movie-ticketing-system/cinemas');

    const cinema = await Cinema.create({
        name,
        location,
        capacity,
        seat_layout: JSON.parse(seat_layout),
        screen_type: JSON.parse(screen_type),
        images
    });
    

    if (!cinema) {
        return res.status(400).json({
            success: false,
            message: "Cinema not created"
        })
    }

    res.status(200).json({
        success: true,
        message: "Cinema created successfully",
        cinema
    })
}