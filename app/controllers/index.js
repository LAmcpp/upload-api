const
  usersController = require('./userController'),
  authController = require('./authController'),
  itemController = require('./itemController');

module.exports = {
  auth: authController.auth,
  getUserById: usersController.getById,
  searchUsers: usersController.search,
  getCurrentUser: usersController.getCurrentUser,
  updateUser: usersController.update,
  searchItems: itemController.search,
  getItemById: itemController.getById,
  updateItem: itemController.update,
  deleteItem: itemController.delete,
  createItem: itemController.create,
  uploadItemImage: itemController.uploadImage,
  removeItemImage: itemController.removeImage
};