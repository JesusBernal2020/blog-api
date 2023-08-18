const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const PostImg = db.define('PostImgs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    postImgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'disabled'),
        defaultValue: 'active',
        allowNull: false,
    },
})


module.exports = PostImg;