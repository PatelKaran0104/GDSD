const { query } = require('express-validator');

// GET /messages
const getChatMessagesValidation = [
  query('chat_id')
    .isInt({ min: 1 })
    .withMessage('Valid chat ID is required'),
];

// GET /chats
const getUserChatsValidation = [
  query('user_id')
    .isInt({ min: 1 })
    .withMessage('Valid user ID is required'),
];

module.exports = {
  getChatMessagesValidation,
  getUserChatsValidation
}; 