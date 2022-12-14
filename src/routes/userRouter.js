const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/top-5-ntd')
  .get(userController.topRec, userController.getAllUser);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.route('/').get(authController.protect, userController.getAllUser);
// .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    userController.deleteUser
  );

module.exports = router;
