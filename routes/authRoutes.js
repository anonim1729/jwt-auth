const { Router } = require('express');
const { getSignUp, getLogin, postSignUp, postLogin, getLogOut } = require('../controllers/authControllers')

const router = Router();

router.get('/signup', getSignUp);
router.get('/login', getLogin);
router.post('/signup', postSignUp);
router.post('/login', postLogin);
router.get('/logout', getLogOut);


module.exports = router;