'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, service: Service, image: Image, video: Video} = require('../models/divide')

router.get('/', async (req, res) => {
    await Service.findAll({
        include: {
            model: Image,
            order: [
                [Image, 'id', 'ASC']
            ]
        }
    }).then(services => {
        Divide.findAll({
            attributes: ['id', 'name', 'srcImage'],
            include: [{
                model: Product,
                attributes: ['id', 'name']
            }]
        }).then(divides => {
            const menuDivides = divides.slice(0, 4)
            res.render('services', {
                title: 'Услуги',
                isServicesCategories: true,
                services,
                menuDivides
            });
        })
    })
});

router.get('/:id', async (req, res) => {
    await Service.findOne({
        include: [{
            model: Image,
            order: [
                [Image, 'id', 'ASC']
            ]
        }, {
            model: Video,
        }],
        where: {
            id: req.params.id
        }
    }).then(service => {
        Divide.findAll({
            attributes: ['id', 'name', 'srcImage'],
            include: [{
                model: Product,
                attributes: ['id', 'name'],
                include: {
                    model: Image,
                    attributes: ['id', 'srcImage']
                },
                order: ['Image', 'id', 'ASC']
            }]
        }).then(divides => {
            const menuDivides = divides.slice(0, 4)
            res.render('service', {
                title: `Услуга "${service.name}"`,
                isService: true,
                service,
                menuDivides
            });
        })
    })
});

module.exports = router;