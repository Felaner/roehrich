'use strict'

const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser')

const path = require('path');

const app = express();

const homeRoute = require('./routes/home');
const productionsRoute = require('./routes/productions');
const productRoute = require('./routes/product');
const serviceRoute = require('./routes/service');
const servicesCategoriesRoute = require('./routes/servicesCategories');
const aboutRoute = require('./routes/about');
const contactsRoute = require('./routes/contacts');

const keys = require('./keys');

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoute);
app.use('/productions', productionsRoute);
app.use('/product', productRoute);
app.use('/service', serviceRoute);
app.use('/servicesCategories', servicesCategoriesRoute);
app.use('/about', aboutRoute);
app.use('/contacts', contactsRoute);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        });
    } catch (e) {
        console.dir(e);
    }
}

start();