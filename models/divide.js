const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const divide = sequelize.define('Divide', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        allowNull: false,
        type: Sequelize.STRING
    },
    srcImage: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const service = sequelize.define('Service', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        allowNull: false,
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

const product = sequelize.define('Product', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    weight: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    volume: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    environ: {
        type: Sequelize.STRING,
        allowNull: true
    },
    temp: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    material: {
        type: Sequelize.STRING,
        allowNull: true
    },
    connect: {
        type: Sequelize.STRING,
        allowNull: true
    },
    diameter: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    dimension: {
        type: Sequelize.STRING,
        allowNull: true
    },
    gost: {
        type: Sequelize.STRING,
        allowNull: true
    },
    pressure: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    depth: {
        type: Sequelize.STRING,
        allowNull: true
    },
    externalDiameter: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

divide.hasMany(product, {foreignKey : 'DivideId'});
product.belongsTo(divide, {foreignKey : 'DivideId'});

const image = sequelize.define('Image', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    srcImage: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ProductId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreignKey : true
    },
    ServiceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreignKey : true
    }
});

product.hasMany(image, {foreignKey : 'ProductId'});
image.belongsTo(product, {foreignKey : 'ProductId'});

service.hasMany(image, {foreignKey : 'ServiceId'});
image.belongsTo(service, {foreignKey : 'ServiceId'});

const video = sequelize.define('Video', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    href: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey : true
    }
});

product.hasMany(video, {foreignKey : 'ProductId'});
video.belongsTo(product, {foreignKey : 'ProductId'});

const size = sequelize.define('Size', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    size: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey : true
    }
})

product.hasMany(size, {foreignKey : 'ProductId'});
size.belongsTo(product, {foreignKey : 'ProductId'});

module.exports = {
    divide, service, product, image, video, size
}