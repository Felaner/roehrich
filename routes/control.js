'use strict'

const {Router} = require('express');
const router = Router();
const fs = require('fs');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const { divide: Divide, service: Service, product: Product, image: Image, video: Video, size: Size } = require('../models/divide')

router.get('/', auth, async (req, res) => {
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
            res.render('control/control', {
                title: 'Управление сайтом',
                isControl: true,
                services,
                divides,
                menuDivides
            });
        })
    })
});

// Категории
router.get('/add-divide', auth, async (req, res) => {
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
            res.render('control/addDivide', {
                title: 'Добавление категорий',
                services,
                divides,
                menuDivides
            });
        })
    })
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
            res.render('control/divides', {
                title: 'Редактирование категорий',
                deleteSuccess: req.flash('deleteSuccess'),
                services,
                divides,
                menuDivides
            });
        })
    })
});

router.get('/edit-divide/:id', auth, async (req, res) => {
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    const divide = await Divide.findByPk(req.params.id);
    Service.findAll({
        attributes: ['id', 'name']
    }).then(services => {
        res.render('control/editDivide', {
            title: `Редактирование категории "${divide.name}"`,
            editSuccess: req.flash('editSuccess'),
            services,
            divide,
            divides,
            menuDivides
        });
    })
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

router.post('/edit-divide/:id/remove', auth, async (req, res) => {
    try {
        await Divide.findOne({
            where: {
                id: req.params.id
            }
        }).then(result => {
            try {
                fs.rmSync('public/' + result.srcImage, { recursive: true, force: true });
            } catch (error) {
                console.error(error)
            }
        }).catch(e => {
            console.log(e)
        })
        await Product.findAll({
            include: {
                model: Image
            },
            where: {
                DivideId: req.params.id
            }
        }).then(result => {
            result.forEach(el => {
                try {
                    el.Images.forEach(img => {
                        fs.rmSync('public/' + img.srcImage, {recursive: true, force: true});
                    })
                    Image.destroy({
                        where: {
                            ProductId: el.id
                        }
                    })
                } catch (error) {
                    console.error(error)
                }
            });
            Product.destroy({
                where: {
                    DivideId: req.params.id
                }
            }).then(result => {
                Divide.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then(result => {
                    req.flash('deleteSuccess', 'Категория успешно удалена')
                    res.redirect('/control/edit-divide');
                });
            })
        })
    } catch (e) {
        console.log(e)
    }
});

// Услуги
router.get('/add-service', auth, async (req, res) => {
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
            res.render('control/addService', {
                title: 'Добавление услуг',
                services,
                menuDivides,
                divides
            });
        })
    })
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
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    Service.findAll({
        attributes: ['id', 'name']
    }).then(services => {
        res.render('control/services', {
            title: 'Редактирование услуг',
            deleteSuccess: req.flash('deleteSuccess'),
            services,
            service,
            divides,
            menuDivides
        });
    })
});

router.get('/edit-service/:id', auth, async (req, res) => {
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    const service = await Service.findByPk(req.params.id);
    Service.findAll({
        attributes: ['id', 'name']
    }).then(services => {
        res.render('control/editService', {
            title: `Редактирование услуги "${service.name}"`,
            editSuccess: req.flash('editSuccess'),
            services,
            service,
            divides,
            menuDivides
        });
    })
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

router.post('/edit-service/:id/remove', auth, async (req, res) => {
    try {
        await Image.findAll({
            where: {
                ServiceId: req.params.id
            }
        }).then(result => {
            result.forEach(el => {
                fs.rmSync('public/' + el.srcImage, {recursive: true, force: true});
                Image.destroy({
                    where: {
                        id: el.id
                    }
                })
            });
            Service.destroy({
                where: {
                    id: req.params.id
                }
            }).then(result => {
                req.flash('deleteSuccess', 'Услуга успешно удалена')
                res.redirect('/control/edit-service');
            });
        })
    } catch (e) {
        console.log(e)
    }
});

// Товары
router.get('/add-product', auth, async (req, res) => {
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    Service.findAll({
        attributes: ['id', 'name']
    }).then(services => {
        res.render('control/addProduct', {
            title: 'Добавление товаров',
            addSuccess: req.flash('addSuccess'),
            services,
            divides,
            menuDivides
        });
    })
});

router.post('/add-product', auth, async (req, res, next) => {
    try {
        if (!req.files['productImage']) {
            req.flash('fileError', "Добавьте изображения для товара");
            return res.status(400).render('control/addProduct', {
                title: 'Добавление товаров',
                fileError: req.flash('fileError')
            });
        }
        const {productName, productCategory, productDescription, productEnviron, productTemp, productPressure,
            productMaterial, productConnect,
            productLength, productExternalDiameter, productDiameter, productDiameter1, productDiameter2, productDepth, productWeight,  productCount, productPrice,
            productGost, productDimension} = req.body
        const divideId = await Divide.findOne({
            attributes: ['id'],
            where: {
                name: productCategory
            }
        })
        console.log(req.body)
        await Product.create({
            DivideId: divideId.id,
            name: productName, category: productCategory, description: productDescription,
            environ: productEnviron, temp: productTemp, material: productMaterial,
            connect: productConnect, pressure: productPressure, dimension: productDimension, gost: productGost
        }).then(result => {
            if (Array.isArray(productWeight)) {
                for(let i = 0; i < productWeight.length; i++){
                    Size.create({
                        ProductId: result.id,
                        length: productLength[i],
                        externalDiameter: productExternalDiameter[i],
                        diameterDy: productDiameter[i],
                        diameterDy1: productDiameter1[i],
                        diameterDy2: productDiameter2[i],
                        depth: productDepth[i],
                        weight: productWeight[i],
                        count: productCount[i],
                        price: productPrice[i]
                    })
                }
            } else if ((productWeight !== undefined)) {
                Size.create({
                    ProductId: result.id,
                    length: productLength,
                    externalDiameter: productExternalDiameter,
                    diameterDy: productDiameter,
                    diameterDy1: productDiameter1,
                    diameterDy2: productDiameter2,
                    depth: productDepth,
                    weight: productWeight,
                    count: productCount,
                    price: productPrice
                })
            } else {
                next()
            }
        })
    .catch(err => {
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
        res.redirect('/control/add-product')
    } catch (e) {
        console.log(e)
    }
});

router.get('/edit-product', auth, async (req, res) => {
    const divides = await Divide.findAll({
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
    const menuDivides = divides.slice(0, 4)
    Service.findAll({
        attributes: ['id', 'name']
    }).then(services => {
        res.render('control/products', {
            title: 'Редактирование товаров',
            deleteSuccess: req.flash('deleteSuccess'),
            editSuccess: req.flash('editSuccess'),
            services,
            divides,
            menuDivides
        });
    })
});

router.get('/edit-product/:id', auth, async (req, res) => {
    const product = await Product.findOne({
        include: [{
            model: Size
        }],
        where: {
            id: req.params.id
        }
    });
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    Service.findAll({
        attributes: ['id', 'name']
    }).then(services => {
        res.render('control/editProduct', {
            title: `Редактирование товара "${product.name}"`,
            services,
            divides,
            product,
            menuDivides
        });
    })
});

router.post('/edit-product/:id', auth, async (req, res, next) => {
    const {productName, productCategory, productDescription, productEnviron, productTemp, productPressure,
        productMaterial, productConnect,
        productLength, productExternalDiameter, productDiameter, productDiameter1, productDiameter2, productDepth, productWeight,  productCount, productPrice,
        productGost, productDimension} = req.body

    const divideId = await Divide.findOne({
        attributes: ['id'],
        where: {
            name: productCategory
        }
    })
    try {
        if (req.files['editProductImage']) {
            const dirname = `public/images/products`

            await req.files['editProductImage'].forEach(el => {
                const filename = el.originalname.substr(0, el.originalname.lastIndexOf('.'));
                sharp(el.buffer)
                    .rotate()
                    .toFormat('webp')
                    .webp({ quality: 90 })
                    .withMetadata()
                    .toFile(dirname + `/${filename}.webp`)
                Image.create({
                    srcImage: `images/products/${filename}.webp`,
                    ProductId: req.params.id
                }).catch(err => {
                    console.log(err)
                });
            })
        }
        console.log(req.body)
        await Product.update(
            {
                DivideId: divideId.id,
                name: productName, category: productCategory, description: productDescription,
                environ: productEnviron, temp: productTemp, material: productMaterial,
                connect: productConnect, pressure: productPressure, dimension: productDimension, gost: productGost
            },
            {
                where: {
                    id: req.params.id
                }
            }
        ).then(result => {
            Size.destroy({
                where: {
                    ProductId: req.params.id
                }
            }).then(e => {
                if (Array.isArray(productWeight)) {
                    for(let i = 0; i < productWeight.length; i++){
                        Size.create({
                            ProductId: req.params.id,
                            length: productLength[i],
                            externalDiameter: productExternalDiameter[i],
                            diameterDy: productDiameter[i],
                            diameterDy1: productDiameter1[i],
                            diameterDy2: productDiameter2[i],
                            depth: productDepth[i],
                            weight: productWeight[i],
                            count: productCount[i],
                            price: productPrice[i]
                        })
                    }
                } else if ((productWeight !== undefined)) {
                    Size.create({
                        ProductId: req.params.id,
                        length: productLength,
                        externalDiameter: productExternalDiameter,
                        diameterDy: productDiameter,
                        diameterDy1: productDiameter1,
                        diameterDy2: productDiameter2,
                        depth: productDepth,
                        weight: productWeight,
                        count: productCount,
                        price: productPrice
                    })
                } else {
                    next()
                }
            })
        }).then(result => {
            req.flash('editSuccess', 'Товар успешно изменен')
            res.redirect(`/control/edit-product`);
        })
    } catch (e) {
        console.dir(e)
    }
});

router.post('/edit-product/:id/remove', auth, async (req, res) => {
    try {
        await Product.findAll({
            include: {
                model: Image
            },
            where: {
                id: req.params.id
            }
        }).then(result => {
            result.forEach(el => {
                try {
                    el.Images.forEach(img => {
                        fs.rmSync('public/' + img.srcImage, {recursive: true, force: true});
                    })
                    Image.destroy({
                        where: {
                            ProductId: el.id
                        }
                    })
                } catch (error) {
                    console.error(error)
                }
            });
            Product.destroy({
                where: {
                    id: req.params.id
                }
            }).then(result => {
                req.flash('deleteSuccess', 'Товар успешно удален')
                res.redirect('/control/edit-product');
            });
        })
    } catch (e) {
        console.log(e)
    }
});

// Видео
router.get('/add-video', auth, async (req, res) => {
    const products = await Product.findAll({
        attributes: ['name']
    })
    const services = await Service.findAll({
        attributes: ['id', 'name']
    })
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    res.render('control/addVideo', {
        title: 'Добавление видео',
        addSuccess: req.flash('addSuccess'),
        products, services, divides, menuDivides
    });
});

router.post('/add-video', auth, async (req, res) => {
    const {videoUrl, videoSelect, videoServiceSelect} = req.body
    let productId = null, serviceId = null
    if (videoSelect !== '' && videoSelect !== undefined) {
        const product = await Product.findOne({
            attributes: ['id'],
            where: {
                name: videoSelect
            }
        }).catch(err => {
            console.log(err)
        })
        productId = product.id
    }
    if (videoServiceSelect !== '' && videoServiceSelect !== undefined) {
        const service = await Service.findOne({
            attributes: ['id'],
            where: {
                name: videoServiceSelect
            }
        }).catch(err => {
            console.log(err)
        })
        serviceId = service.id
    }
    await Video.create({
        url: videoUrl,
        ProductId: productId,
        ServiceId: serviceId
    }).catch(err => {
        console.log(err)
    })
    req.flash('addSuccess', "Видео успешно добавлено");
    res.redirect('/control/add-video');
})

router.get('/edit-video', auth, async (req, res) => {
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    const video = await Video.findAll({
        attributes: ['id'],
        include: [{
            model: Product,
            attributes: ['id', 'name'],
            include: [{
                model: Image
            }],
            order: [
                [Image, 'id', 'ASC']
            ]
        }, {
            model: Service,
            attributes: ['id', 'name'],
            include: [{
                model: Image
            }],
            order: [
                [Image, 'id', 'ASC']
            ]
        }],
        order: [
            [Product, 'id', 'ASC'],
            [Service, 'id', 'ASC']
        ]
    }).catch(e => {
        console.log(e)
    })
    Service.findAll({
        attributes: ['id', 'name']
    }).then(services => {
        res.render('control/videos', {
            title: 'Редактирование видео',
            deleteSuccess: req.flash('deleteSuccess'),
            video, divides, menuDivides, services
        });
    })
});

router.get('/edit-video/:id', auth, async (req, res) => {
    const divides = await Divide.findAll({
        attributes: ['id', 'name', 'srcImage'],
        include: [{
            model: Product,
            attributes: ['id', 'name']
        }]
    })
    const menuDivides = divides.slice(0, 4)
    const video = await Video.findByPk(req.params.id);
    const products = await Product.findAll({
        attributes: ['id', 'name']
    })
    const services = await Service.findAll({
        attributes: ['id', 'name']
    })
    const productsSelected = await Product.findOne({
        attributes: ['id', 'name'],
        where: {
            id: video.ProductId
        }
    })
    const servicesSelected = await Service.findOne({
        attributes: ['id', 'name'],
        where: {
            id: video.ServiceId
        }
    })
    let selectedObj
    if (!productsSelected) {
        selectedObj = `услуги "${servicesSelected.name}"`
    } else if (!servicesSelected) {
        selectedObj = `товара "${productsSelected.name}"`
    } else {
        selectedObj = `товара "${productsSelected.name}" и услуги "${servicesSelected.name}"`
    }
    res.render('control/editVideo', {
        title: `Редактирование видео для ${selectedObj}`,
        editSuccess: req.flash('editSuccess'),
        video,
        productsSelected,
        products,
        servicesSelected,
        services,
        divides,
        menuDivides
    });
});

router.post('/edit-video/:id', auth, async (req, res) => {
    const {videoUrl, videoSelect, videoServiceSelect} = req.body;
    let productId = null, serviceId = null
    if (videoSelect !== '') {
        let product = await Product.findOne({
            attributes: ['id'],
            where: {
                name: videoSelect
            }
        })
        productId = product.id
    }
    if (videoServiceSelect !== '') {
        let service = await Service.findOne({
            attributes: ['id'],
            where: {
                name: videoServiceSelect
            }
        })
        serviceId = service.id
    }
    console.log(serviceId)
    try {
        await Video.update(
            {
                url: videoUrl,
                ProductId: productId,
                ServiceId: serviceId
            },
            {
                where: {
                    id: req.params.id
                }
            }).catch(err => {
            console.log(err)
            }
        )
        req.flash('editSuccess', "Видео успешно изменено")
        res.redirect(`/control/edit-video/${req.params.id}`);
    } catch (e) {
        console.dir(e)
    }
});

router.post('/edit-video/:id/remove', auth, async (req, res) => {
    try {
        Video.destroy({
            where: {
                id: req.params.id
            }
        }).then(result => {
            req.flash('deleteSuccess', 'Видео успешно удалено')
            res.redirect('/control/edit-video');
        });
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;