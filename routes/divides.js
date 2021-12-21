'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, image: Image, video: Video, size: Size } = require('../models/divide')

router.get('/', async (req, res) => {
    const divides = await Divides.findAll({
        include: {
            model: Product,
            attributes: ['id', 'name']
        }
    })
    res.render('divides', {
        title: 'Категория товаров',
        isProductions: true,
        divides
    });
});

router.get('/product', (req, res) => {
    res.render('product', {
        title: 'Товар №1',
        isProduct: true
    });
});

module.exports = router;