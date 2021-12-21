'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('divides', {
        title: 'Категория товаров',
        isProductions: true
    });
});

router.get('/product', (req, res) => {
    res.render('product', {
        title: 'Товар №1',
        isProduct: true
    });
});

module.exports = router;