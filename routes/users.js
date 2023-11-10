const userRouter = require('express').Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');
const { updateUserValidation } = require('../middlewares/validation');

userRouter.get('/me', getUser);
userRouter.patch('/me', updateUserValidation, updateUser);

module.exports = userRouter;
