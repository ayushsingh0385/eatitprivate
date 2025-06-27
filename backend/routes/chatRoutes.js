const express = require('express');
const { handleChat } = require('../controllers/chatController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), handleChat);

module.exports = router;
