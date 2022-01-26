'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const { divide: Divide, product: Product, service: Service, image: Image, video: Video, size: Size } = require('../models/divide')

router.get('/', async (req, res) => {
    await Divide.findAll({
        include: {
            model: Product,
            attributes: ['id', 'name']
        }
    }).then(divides => {
        Service.findAll({
            attributes: ['id', 'name']
        }).then(services => {
            const menuDivides = divides.slice(0, 4)
            res.render('divides', {
                title: 'Категории товаров',
                isProductions: true,
                services,
                divides,
                menuDivides
            });
        })
    })
});

router.get('/:divideId/tovary', async (req, res) => {
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
        Divide.findAll({
            include: {
                model: Product,
                attributes: ['id', 'name']
            }
        }).then(divides => {
            Service.findAll({
                attributes: ['id', 'name']
            }).then(services => {
                const menuDivides = divides.slice(0, 4)
                res.render('divide', {
                    title: `Категория "${divide.name}"`,
                    services,
                    divide,
                    menuDivides,
                    divides
                });
            })
        })
    }).catch(e => {
        console.log(e)
    })
});

function arrayRandElement(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

router.get('/:divideId/tovary/:productId', async (req, res) => {
    await Product.findOne({
        include: [
            {model: Image},
            {model: Video},
            {
                model: Size,
                order: [
                    [Size, 'diameterDy', 'ASC'],
                    [Size, 'length', 'ASC']
                ]
            }
        ],
        where: {
            id: req.params.productId
        }
    }).then(product => {
        Divide.findAll({
            include: {
                model: Product,
                attributes: ['id', 'name']
            }
        }).then(divides => {
            Divide.findOne({
                include: {
                    model: Product,
                    attributes: ['id', 'name'],
                    include: {
                        model: Image
                    }
                },
                where: {
                    id: req.params.divideId
                }
            }).then(thisDivide => {
                thisDivide.arrayProducts = arrayRandElement(thisDivide.Products)
                Service.findAll({
                    attributes: ['id', 'name']
                }).then(services => {
                    const menuDivides = divides.slice(0, 4)
                    res.render('product', {
                        title: `Товар "${product.name}"`,
                        services,
                        product,
                        menuDivides,
                        divides,
                        thisDivide
                    });
                })
            })
        })
    }).catch(e => {
        console.log(e)
    })
});

module.exports = router;