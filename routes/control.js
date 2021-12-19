'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const { divide: Divide, service: Service, product: Product, image: Image, video: Video, size: Size } = require('../models/divide')

router.get('/', auth, (req, res) => {
    res.render('control/control', {
        title: 'Управление сайтом',
        isControl: true
    });
});

router.get('/add-divide', auth, (req, res) => {
    res.render('control/addDivide', {
        title: 'Добавление категорий'
    });
});

router.post('/add-divide', auth, async (req, res) => {
    try {
        if (!req.files['divideImage']) {
            req.flash('fileError', "Добавьте фото категории");
            return res.status(400).render('control/addDivide', {
                title: 'Добавление категорий',
                fileError: req.flash('fileError')
            });
        }
        const {divideName} = req.body
        const dirname = `public/images/divides`
        const filename = req.files['divideImage'][0].originalname.substr(0, req.files['divideImage'][0].originalname.lastIndexOf('.'));
        await sharp(req.files['divideImage'][0].buffer)
            .rotate()
            .toFormat('webp')
            .webp({ quality: 90 })
            .withMetadata()
            .toFile(dirname + `/${filename}.webp`)
        await Divide.create({
            name: divideName,
            srcImage: dirname + `/${filename}.webp`,
        }).catch(err => {
            console.log(err)
        });
        req.flash('addSuccess', "Категория успешно добавлена");
        res.status(200).render('control/addDivide', {
            title: 'Добавление категорий',
            addSuccess: req.flash('addSuccess')
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/add-service', auth, (req, res) => {
    res.render('control/addService', {
        title: 'Добавление услуг'
    });
});

router.post('/add-service', auth, async (req, res) => {
    try {
        if (!req.files['serviceImage']) {
            req.flash('fileError', "Добавьте изображения для услуги");
            return res.status(400).render('control/addService', {
                title: 'Добавление услуг',
                fileError: req.flash('fileError')
            });
        }
        const {serviceName, serviceDescription, servicePrice} = req.body
        await Service.create({
            name: serviceName,
            description: serviceDescription,
            price: servicePrice
        }).catch(err => {
            console.log(err)
        })
        const serviceId = await Service.findOne({
            attributes: ['id'],
            where: {
                name: serviceName
            }
        }).catch(err => {
            console.log(err)
        })
        const dirname = `public/images/services`
        await req.files['serviceImage'].forEach(img => {
            const filename = img.originalname.substr(0, img.originalname.lastIndexOf('.'));
            sharp(img.buffer)
                .rotate()
                .toFormat('webp')
                .webp({ quality: 90 })
                .withMetadata()
                .toFile(dirname + `/${filename}.webp`)
            Image.create({
                srcImage: dirname + `/${filename}.webp`,
                ServiceId: serviceId.id
            }).catch(err => {
                console.log(err)
            });
        })
        req.flash('addSuccess', "Услуга успешно добавлена");
        res.status(200).render('control/addService', {
            title: 'Добавление услуг',
            addSuccess: req.flash('addSuccess')
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/add-product', auth, (req, res) => {
    res.render('control/addProduct', {
        title: 'Добавление товаров'
    });
});

router.post('/add-product', auth, async (req, res) => {
    try {
        if (!req.files['productImage']) {
            req.flash('fileError', "Добавьте изображения для товара");
            return res.status(400).render('control/addProduct', {
                title: 'Добавление товаров',
                fileError: req.flash('fileError')
            });
        }
        const {productName, productCategory, productDescription,
            productCount, productWeight, productVolume,
            productEnviron, productTemp, productMaterial,
            productConnect, productDiameter, productDimension,
            productGost, productPressure, productDepth, productExternalDiameter,
            productPrice} = req.body
        await Product.create({
            name: productName, category: productCategory, description: productDescription,
            count: productCount, weight: productWeight, volume: productVolume,
            environ: productEnviron, temp: productTemp, material: productMaterial,
            connect: productConnect, diameter: productDiameter, dimension: productDimension,
            gost: productGost, pressure: productPressure, depth: productDepth,
            externalDiameter: productExternalDiameter, price: productPrice
        }).catch(err => {
            console.log(err)
        })
        const productId = await Product.findOne({
            attributes: ['id'],
            where: {
                name: productName
            }
        }).catch(err => {
            console.log(err)
        })
        const dirname = `public/images/products`
        await req.files['productImage'].forEach(img => {
            const filename = img.originalname.substr(0, img.originalname.lastIndexOf('.'));
            sharp(img.buffer)
                .rotate()
                .toFormat('webp')
                .webp({ quality: 90 })
                .withMetadata()
                .toFile(dirname + `/${filename}.webp`)
            Image.create({
                srcImage: dirname + `/${filename}.webp`,
                ProductId: productId.id
            }).catch(err => {
                console.log(err)
            });
        })
        req.flash('addSuccess', "Товар успешно добавлен");
        res.status(200).render('control/addProduct', {
            title: 'Добавление товаров',
            addSuccess: req.flash('addSuccess')
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/add-video', auth, (req, res) => {
    res.render('control/addVideo', {
        title: 'Добавление видео'
    });
});

router.post('/add-product', auth, async (req, res) => {
    const {videoUrl, videoSelect} = req.body
    const productId = await Product.findOne({
        attributes: ['id'],
        where: {
            name: videoSelect
        }
    }).catch(err => {
        console.log(err)
    })
    await Video.create({
        url: videoUrl,
        ProductId: productId.id
    }).catch(err => {
        console.log(err)
    })
    req.flash('addSuccess', "Видео успешно добавлено");
    res.status(200).render('control/addVideo', {
        title: 'Добавление видео',
        addSuccess: req.flash('addSuccess')
    });
})

module.exports = router;