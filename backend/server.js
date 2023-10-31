const dotenv = require('dotenv')
dotenv.config({ path: './config/.env' })

const app = require('./app')


app.listen(process.env.PORT, function () {
    console.log('server started')
})