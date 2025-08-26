const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/messages/:id', auth, messageController.createMessage);
router.get('/messages', auth, messageController.getMessages);

module.exports = router;