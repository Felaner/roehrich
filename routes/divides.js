'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, image: Image, video: Video, size: Size } = require('../models/divide')

router.get('/', async (req, res) => {
    await Divide.findAll({
        include: {
            model: Product,
            attributes: ['id', 'name']
        }
    }).then(divides => {
        res.render('divides', {
            title: 'Категории товаров',
            isProductions: true,
            divides
        });
    })
});

router.get('/:divideId', async (req, res) => {
    await Divide.findOne({
        include: {
            model: Product,
            include: {
                model: Image
            }
        },
        where: {
            id: req.params.divideId
        }
    }).then(divide => {
        res.render('divide', {
            title: `Категория "${divide.name}"`,
            divide
        });
    }).catch(e => {
        console.log(e)
    })
});

router.get('/:divideId/tovary/:productId', async (req, res) => {
    await Product.findOne({
        include: [
            {model: Image},
            {model: Video}
        ],
        where: {
            id: req.params.productId
        }
    }).then(product => {
        res.render('product', {
            title: `Товар "${product.name}"`,
            product
        });
    }).catch(e => {
        console.log(e)
    })
});

module.exports = router;