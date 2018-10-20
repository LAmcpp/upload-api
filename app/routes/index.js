const
  express = require('express'),
  router = express.Router();
const
  controller = require('../controllers/index'),
  userValidation = require('../controllers/middlewares/userValidation'),
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
  controller.auth,
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

router.get("/item/", [controller.searchItems]);
router.get("/item/:id", [controller.getItemById]);
router.put("/item/:id", [controller.updateItem]);
router.delete("/item/:id", [controller.deleteItem]);
router.post("/item/:id", [controller.createItem]);
router.post("/item/:id/image/", [controller.uploadItemImage]);
router.delete("/item/:id/image/", [controller.removeItemImage]);

module.exports = router;