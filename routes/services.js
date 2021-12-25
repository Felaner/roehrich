'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { service: Service, image: Image, video: Video} = require('../models/divide')

router.get('/', async (req, res) => {
    await Service.findAll({
        include: {
            model: Image,
            order: [
                [Image, 'id', 'ASC']
            ]
        }
    }).then(services => {
        res.render('services', {
            title: 'Услуги',
            isServicesCategories: true,
            services
        });
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
        res.render('service', {
            title: `Услуга "${service.name}"`,
            isService: true,
            service
        });
    })
});

module.exports = router;