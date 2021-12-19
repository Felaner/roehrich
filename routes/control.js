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

// Категории
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
            srcImage: `images/divides/${filename}.webp`,
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

router.get('/edit-divide', auth, async (req, res) => {
    const divide = await Divide.findAll()
    res.render('control/divides', {
        title: 'Редактирование категорий',
        divide
    });
});

router.get('/edit-divide/:id', auth, async (req, res) => {
    const divide = await Divide.findByPk(req.params.id);
    res.render('control/editDivide', {
        title: `Редактирование категории "${divide.name}"`,
        editSuccess: req.flash('editSuccess'),
        divide
    });
});

router.post('/edit-divide/:id', auth, async (req, res) => {
    const {divideName} = req.body;

    try {
        if (req.files['editDivideImage']) {
            await Divide.findOne({
                attributes: ['srcImage'],
                where: {
                    id: req.params.id
                }
            }).then(result => {
                fs.rmSync(result.srcImage, { recursive: true, force: true });
            })
            const dirname = `public/images/divides`
            const filename = req.files['editDivideImage'][0].originalname.substr(0, req.files['editDivideImage'][0].originalname.lastIndexOf('.'));
            await sharp(req.files['editDivideImage'][0].buffer)
                .rotate()
                .toFormat('webp')
                .webp({ quality: 90 })
                .withMetadata()
                .toFile(dirname + `/${filename}.webp`)
            await Divide.update(
                {
                    srcImage: `images/divides/${filename}.webp`,
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            ).catch(err => {
                console.log(err)
            });
        }
        await Divide.update(
            {
                name: divideName
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(result => {
            req.flash('editSuccess', "Категория успешно изменена")
            res.redirect(`/control/edit-divide/${req.params.id}`);
        })
    } catch (e) {
        console.dir(e)
    }
});

// Услуги
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
                srcImage: `images/services/${filename}.webp`,
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

router.get('/edit-service', auth, async (req, res) => {
    const service = await Service.findAll({
        include: {
            model: Image
        },
        order: [
            [Image, 'id', 'ASC']
        ]
    })
    res.render('control/services', {
        title: 'Редактирование услуг',
        service
    });
});

router.get('/edit-service/:id', auth, async (req, res) => {
    const service = await Service.findByPk(req.params.id);
    res.render('control/editService', {
        title: `Редактирование услуги "${service.name}"`,
        editSuccess: req.flash('editSuccess'),
        service
    });
});

router.post('/edit-service/:id', auth, async (req, res) => {
    const {serviceName, serviceDescription, servicePrice} = req.body;

    try {
        if (req.files['editServiceImage']) {
            await Image.findAll({
                attributes: ['srcImage'],
                where: {
                    ServiceId: req.params.id
                }
            }).then(result => {
                result.forEach(el => {
                    fs.rmSync(el.srcImage, { recursive: true, force: true });
                })
            })
            const dirname = `public/images/services`

            await req.files['editServiceImage'].forEach(el => {
                const filename = el.originalname.substr(0, el.originalname.lastIndexOf('.'));
                sharp(el.buffer)
                    .rotate()
                    .toFormat('webp')
                    .webp({ quality: 90 })
                    .withMetadata()
                    .toFile(dirname + `/${filename}.webp`)
                Image.create({
                        srcImage: `images/services/${filename}.webp`,
                        ServiceId: req.params.id
                }).catch(err => {
                    console.log(err)
                });
            })
        }
        await Service.update(
            {
                name: serviceName,
                description: serviceDescription,
                price: servicePrice
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(result => {
            req.flash('editSuccess', 'Услуга успешно изменена')
            res.redirect(`/control/edit-service/${req.params.id}`);
        })
    } catch (e) {
        console.dir(e)
    }
});

// Товары
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
                srcImage: `images/products/${filename}.webp`,
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

router.get('/edit-product', auth, async (req, res) => {
    const divide = await Divide.findAll({
        include: [{
            model: Product,
            include: [{
                model: Image
            }],
            order: [
                [Image, 'id', 'ASC']
            ]
        }],
        order: [
            [Product, 'id', 'ASC']
        ]
    })
    res.render('control/products', {
        title: 'Редактирование товаров',
        divide
    });
});

router.get('/edit-product/:id', auth, async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    res.render('control/editProduct', {
        title: `Редактирование товара "${product.name}"`,
        editSuccess: req.flash('editSuccess'),
        product
    });
});

router.post('/edit-product/:id', auth, async (req, res) => {
    const {serviceName, serviceDescription, servicePrice} = req.body;

    try {
        if (req.files['editServiceImage']) {
            await Image.findAll({
                attributes: ['srcImage'],
                where: {
                    ServiceId: req.params.id
                }
            }).then(result => {
                result.forEach(el => {
                    fs.rmSync(el.srcImage, { recursive: true, force: true });
                })
            })
            const dirname = `public/images/services`

            await req.files['editServiceImage'].forEach(el => {
                const filename = el.originalname.substr(0, el.originalname.lastIndexOf('.'));
                sharp(el.buffer)
                    .rotate()
                    .toFormat('webp')
                    .webp({ quality: 90 })
                    .withMetadata()
                    .toFile(dirname + `/${filename}.webp`)
                Image.create({
                    srcImage: `images/services/${filename}.webp`,
                    ServiceId: req.params.id
                }).catch(err => {
                    console.log(err)
                });
            })
        }
        await Service.update(
            {
                name: serviceName,
                description: serviceDescription,
                price: servicePrice
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(result => {
            req.flash('editSuccess', 'Услуга успешно изменена')
            res.redirect(`/control/edit-service/${req.params.id}`);
        })
    } catch (e) {
        console.dir(e)
    }
});

// Видео
router.get('/add-video', auth, (req, res) => {
    res.render('control/addVideo', {
        title: 'Добавление видео'
    });
});

router.post('/add-video', auth, async (req, res) => {
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

router.get('/edit-video', auth, async (req, res) => {
    const video = await Video.findAll()
    res.render('control/videos', {
        title: 'Редактирование видео',
        video
    });
});

module.exports = router;