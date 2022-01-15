'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, service: Service } = require('../models/divide')

router.get('/', async (req, res) => {
    await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    }).then(divides => {
        Service.findAll({
            attributes: ['id', 'name']
        }).then(services => {
            const menuDivides = divides.slice(0, 4)
            res.render('about', {
                title: 'О нас',
                isAbout: true,
                services,
                menuDivides,
                divides
            });
        })

    })
});

module.exports = router;