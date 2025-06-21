const { Op } = require('sequelize');
const { chat, message, productlisting, mediafile, user } = require('../models');

exports.getUserChats = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.error('user_id query parameter is required', 400);
    }

    const chatRecords = await chat.findAll({
      attributes: ['chat_id', 'created_at'],
      where: {
        [Op.or]: [
          { product_owner_id: user_id },
          { other_person_id: user_id }
        ]
      },
      include: [
        {
          model: productlisting,
          as: 'product',
          include: [
            {
              model: mediafile,
              as: 'mediafiles',
              attributes: ['file_path'],
              where: { is_approved: true },
              required: false
            }
          ]
        },
        {
          model: message,
          as: 'lastMessage',
          attributes: ['message_id', 'content', 'sender_id', 'receiver_id', 'created_at']
        },
        {
          model: user,
          as: 'owner',
          attributes: ['id', 'username', 'email', 'createdAt']
        },
        {
          model: user,
          as: 'otherPerson',
          attributes: ['id', 'username', 'email', 'createdAt']
        }
      ],
      order: [['chat_id', 'DESC']]
    });

    // Transform and clean output
    const result = chatRecords.map(chat => {
      const json = chat.toJSON();
      const media = json.product?.mediafiles || [];
      json.product.image_url = media.length > 0 ? media[0].file_path : null;
      delete json.product.mediafiles; // Optional: remove full media array
      return json;
    });

    return res.success('User chats fetched successfully', result, 200);
  } catch (error) {
    return res.error(error.message || 'Failed to fetch user chats', 500);
  }
};


exports.getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.query;
    if (!chat_id) return res.error('chat_id query parameter is required', 400);

    const chatRecord = await chat.findByPk(chat_id);

    if (!chatRecord) {
      return res.success('No messages yet. Chat can be started.', [], 200);
    }

    const messages = await message.findAll({
      where: { chat_id },
      order: [['message_id', 'ASC']]
    });

    return res.success('Messages fetched successfully', messages, 200);
  } catch (error) {
    return res.error(error.message || 'Failed to fetch messages', 500);
  }
};


exports.sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, product_id, content } = req.body;

    // Find or create chat
    let chatRecord = await chat.findOne({
      where: {
        product_id,
        [Op.or]: [
          { product_owner_id: sender_id, other_person_id: receiver_id },
          { product_owner_id: receiver_id, other_person_id: sender_id }
        ]
      }
    });

    if (!chatRecord) {
      // Create new chat
      chatRecord = await chat.create({
        product_id,
        product_owner_id: sender_id,
        other_person_id: receiver_id
      });
    }

    // Create message
    const newMessage = await message.create({
      chat_id: chatRecord.chat_id,
      sender_id,
      receiver_id,
      content,
      message_type: 'text'
    });

    return res.success('Message sent successfully', newMessage, 201);
  } catch (error) {
    return res.error(error.message || 'Failed to send message', 500);
  }
};

