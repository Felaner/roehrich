'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('productions', {
        title: 'Категория товаров',
        isProductions: true
    });
});

module.exports = router;