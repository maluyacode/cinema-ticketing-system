const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');

const user = require('./routes/user');
const movie = require('./routes/movie');
const cinema = require('./routes/cinema');
const show = require('./routes/show');
const reservation = require('./routes/reservation');
const charts = require('./routes/charts');

const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use('/api/v1', user);
app.use('/api/v1/movie', movie);
app.use('/api/v1/cinema', cinema)
app.use('/api/v1/charts', charts)
app.use('/api/v1/show', show);
app.use('/api/v1/reservation', reservation);

module.exports = app;