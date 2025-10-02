const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { login, register, logout, generateNewRefreshToken, editProfile, editAvatar, getProfile } = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', upload.single("avatar"), register);
router.post('/login', login);
router.post('/logout',verifyToken, logout);
router.post('/refresh-token', generateNewRefreshToken);
router.put('/edit-profile', verifyToken, editProfile); 
router.put('/edit-avatar', verifyToken, upload.single("avatar"), editAvatar);   
router.get('/profile', verifyToken, getProfile);;

module.exports = router;