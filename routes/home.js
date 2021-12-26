'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, service: Service, product: Product, image: Image } = require('../models/divide')

router.get('/', async (req, res) => {
    await Divide.findAll({
        include: [{
            model: Product,
            include: {
                model: Image
            },
            order: ['Image', 'id', 'ASC']
        }]
    }).then(divides => {
        const menuDivides = divides.slice(0, 4)
        const products = divides.slice(0, 6)
        Service.findAll({
            include: {
                model: Image
            }
        }).then(services => {
            const homeServices = services.slice(0, 6)
            res.render('home', {
                title: 'Главная',
                isHome: true,
                menuDivides,
                products,
                homeServices
            });
        }).catch(e => {
            console.log(e)
        })
    }).catch(e => {
        console.log(e)
    })
});

module.exports = router;