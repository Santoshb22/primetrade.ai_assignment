const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { login, register } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', upload.single("avatar"), register);
router.post('/login', login);

module.exports = router;