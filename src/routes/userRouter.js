const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();
router
  .route('/top-5-ntd')
  .get(userController.topRec, userController.getAllUser);

router.post('/signup', authController.signup);
router.route('/').get(userController.getAllUser);
// .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
