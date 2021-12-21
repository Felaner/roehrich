'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, image: Image, video: Video, size: Size } = require('../models/divide')

router.get('/', async (req, res) => {
    const divides = await Divide.findAll({
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

router.get('/:id', async (req, res) => {
    const divide = await Divide.findOne({
        include: {
            model: Product,
            include: {
                model: Image
            }
        },
        where: {
            id: req.params.id
        }
    })
    res.render('divide', {
        title: `Категория "${divide.name}"`,
        divide
    });
});

router.get('/:id/:id', async (req, res) => {
    const product = await Product.findOne({
        include: {
            model: Image
        },
        where: {
            id: req.params.id
        }
    })
    res.render('product', {
        title: `Товар "${product.name}"`,
        product
    });
});

module.exports = router;