const router = require('express').Router();
const {
  updateProfile,
  getUserInfo,
} = require('../controllers/user');
const { validateUserUpdate } = require('../middlewares/validateUser');

router.get('/me', getUserInfo);
router.patch('/me', validateUserUpdate, updateProfile);

module.exports = router;
