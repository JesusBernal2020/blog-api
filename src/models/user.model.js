const { DataTypes } = require('sequelize');
const { db } = require('../database/config');

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_changed_at',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  profileImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:
      'https://img1.wallspic.com/crops/6/9/5/8/4/148596/148596-diseador-3840x2160.jpg',
    field: 'profile_img_url',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = User;
