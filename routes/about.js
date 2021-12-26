'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product } = require('../models/divide')

router.get('/', async (req, res) => {
    await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    }).then(divides => {
        const menuDivides = divides.slice(0, 4)
        res.render('about', {
            title: 'О нас',
            isAbout: true,
            menuDivides
        });
    })
});

module.exports = router;