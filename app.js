const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//DB Connection 
connectDB();

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

// Handlebars Helpers
const { formatDate } = require('./helpers/hbs');

// Handlebars
app.engine('.hbs', exphbs({ helpers: { formatDate, }, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);