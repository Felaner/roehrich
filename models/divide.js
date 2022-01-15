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
    diameter: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    pressure: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    depth: {
        type: Sequelize.STRING,
        allowNull: true
    },
    externalDiameter: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    count: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    environ: {
        type: Sequelize.STRING,
        allowNull: true
    },
    temp: {
        type: Sequelize.FLOAT,
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
    dimension: {
        type: Sequelize.STRING,
        allowNull: true
    },
    price: {
        type: Sequelize.FLOAT,
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
    url: {
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

product.hasMany(video, {foreignKey : 'ProductId'});
video.belongsTo(product, {foreignKey : 'ProductId'});

service.hasMany(video, {foreignKey : 'ServiceId'});
video.belongsTo(service, {foreignKey : 'ServiceId'});

const size = sequelize.define('Size', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    ProductId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey : true
    },
    weight: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    volume: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    gost: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

product.hasMany(size, {foreignKey : 'ProductId'});
size.belongsTo(product, {foreignKey : 'ProductId'});

module.exports = {
    divide, service, product, image, video, size
}