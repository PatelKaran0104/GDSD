const { query, body } = require('express-validator');

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

// POST /messages
const sendMessageValidation = [
  body('sender_id')
    .isInt({ min: 1 })
    .withMessage('Valid sender ID is required'),
  body('receiver_id')
    .isInt({ min: 1 })
    .withMessage('Valid receiver ID is required'),
  body('product_id')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters'),
];

module.exports = {
  getChatMessagesValidation,
  getUserChatsValidation,
  sendMessageValidation
};