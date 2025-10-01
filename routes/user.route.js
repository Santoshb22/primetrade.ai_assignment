const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { login, register, logout, generateNewRefreshToken } = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', upload.single("avatar"), register);
router.post('/login', login);
router.post('/logout',verifyToken, logout);
router.post('/refresh-token', generateNewRefreshToken);


module.exports = router;