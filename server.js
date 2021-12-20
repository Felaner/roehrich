'use strict'

const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2/promise');
const csrf = require('csurf');

const sequelize = require('./utils/database')

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file')
const errorHandler = require('./middleware/error');

const path = require('path');

const app = express();

const homeRoute = require('./routes/home');
const productionsRoute = require('./routes/productions');
const productRoute = require('./routes/product');
const serviceRoute = require('./routes/service');
const servicesCategoriesRoute = require('./routes/servicesCategories');
const aboutRoute = require('./routes/about');
const contactsRoute = require('./routes/contacts');
const adminRoute = require('./routes/admin');
const controlRoute = require('./routes/control');

const keys = require('./keys');

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
});

const options = {
    host: '127.0.0.1',
    port: 3306,
    user: keys.DATABASE_USER,
    password: keys.DATABASE_PASS,
    database: keys.DATABASE_NAME,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const connection = mysql.createPool(options);
const sessionStore = new MySQLStore(options);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));

app.use(flash());

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    path: '/',
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}));

app.use(fileMiddleware.fields([
    { name: 'divideImage', maxCount: 1 },
    { name: 'editDivideImage', maxCount: 1 },
    { name: 'serviceImage', maxCount: 5 },
    { name: 'editServiceImage', maxCount: 5 },
    { name: 'productImage', maxCount: 5}
]));

app.use(userMiddleware);
app.use(varMiddleware);

app.use('/', homeRoute);
app.use('/productions', productionsRoute);
app.use('/product', productRoute);
app.use('/service', serviceRoute);
app.use('/servicesCategories', servicesCategoriesRoute);
app.use('/about', aboutRoute);
app.use('/contacts', contactsRoute);
app.use('/admin', adminRoute);
app.use('/control', controlRoute);

app.use(errorHandler);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        });
    } catch (e) {
        console.dir(e);
    }
}

start();