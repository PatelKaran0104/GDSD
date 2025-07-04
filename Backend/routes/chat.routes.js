const express = require('express');
const router = express.Router();
const controller = require('../controllers/chat.controller');
const validateRequest = require('../middleware/validateRequest');
const {
  getChatMessagesValidation,
  getUserChatsValidation,
  sendMessageValidation
} = require('../validator/chat.validator');

// Routes
router.get('/messages', getChatMessagesValidation, validateRequest, controller.getChatMessages); 
router.post('/messages', sendMessageValidation, validateRequest, controller.sendMessage);
router.get('/chats', getUserChatsValidation, validateRequest, controller.getUserChats);

module.exports = router;
