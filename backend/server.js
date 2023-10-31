const app = require('./app')
const dotenv = require('dotenv')
dotenv.config({ path: './config/.env' })
const cloudinary = require('cloudinary');

const connectDatabase = require('./config/database')

connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, function () {
    console.log('server started')
})