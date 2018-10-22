const uuid = require('uuid/v4');

'use strict';

module.exports = function(sequelize, Sequelize) {
  let User = sequelize.define('user',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuid()
      },
      name: {
        type: Sequelize.STRING,
        notEmpty: true
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
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

  User.beforeCreate((user, _ ) => {
    return user.dataValues.id = uuid();
  });

  return User;
};