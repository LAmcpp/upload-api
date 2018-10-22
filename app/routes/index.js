const
  express = require('express'),
  router = express.Router();

const
  controller = require('../controllers/index'),
  userValidation = require('../controllers/middlewares/userValidation'),
  itemValidation = require('../controllers/middlewares/itemValidation'),
  userRegistration = require('../controllers/middlewares/userRegistration'),
  authValidation = require('../controllers/middlewares/authValidation');

router.post('/login/', [
  userValidation.login,
  controller.auth
]);

router.post('/register/', [
  userValidation.registration,
  userValidation.hasUnusedEmail,
  userRegistration,
  controller.auth
]);

router.get('/me/', [
  authValidation.tokenValidation,
  controller.getCurrentUser
]);

router.put('/me/', [
  authValidation.tokenValidation,
  userValidation.update,
  controller.updateUser
]);

router.get('/user/:id', [
  authValidation.tokenValidation,
  userValidation.getById,
  controller.getUserById
]);

router.get('/user/', [
  authValidation.tokenValidation,
  userValidation.search,
  controller.searchUsers
]);

router.get("/item/", [
  itemValidation.searchValidation,
  controller.searchItems
]);

router.get("/item/:id", [
  controller.getItemById
]);

router.put("/item/:id", [
  authValidation.tokenValidation,
  itemValidation.updateValidation,
  controller.updateItem
]);

router.delete("/item/:id", [
  authValidation.tokenValidation,
  controller.deleteItem
]);

router.put("/item/", [
  authValidation.tokenValidation,
  controller.createItem
]);

router.post("/item/:id/image/", [
  authValidation.tokenValidation,
  itemValidation.uploadValidation,
  controller.uploadItemImage
]);

router.delete("/item/:id/image/", [
  authValidation.tokenValidation,
  controller.removeItemImage
]);

module.exports = router;