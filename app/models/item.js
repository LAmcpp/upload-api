const
  uuid = require('uuid/v4'),
  type = require('../constants').ITEM_TYPE;

'use strict';

module.exports = function(sequelize, Sequelize) {
  let Item = sequelize.define(type,
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuid()
      },
      title: {
        type: Sequelize.STRING,
        notEmpty: true
      },
      description: {
        type: Sequelize.STRING,
        notEmpty: true
      },
      image: {
        type: Sequelize.STRING,
        notEmpty: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    },
    {
      underscored: true,
      timestamps: true
    }
  );

  Item.beforeCreate((item, _ ) => {
    return item.dataValues.id = uuid();
  });

  return Item;
};