const dotenv = require('dotenv')
dotenv.config({ path: './config/.env' })
const connectDatabase = require('./config/database')
const app = require('./app')
connectDatabase()

app.listen(process.env.PORT, function () {
    console.log('server started')
})