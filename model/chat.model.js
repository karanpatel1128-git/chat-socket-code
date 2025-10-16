const db = require("../utils/db");
// ================================================implement code chat======================//

exports.checkIsUserChatExistsOrNot = async (userId1, userId2) => {
    return db.query(`
        SELECT c.id FROM chat c
        JOIN chat_member cm1 ON cm1.chat_id = c.id AND cm1.user_id = ?
        JOIN chat_member cm2 ON cm2.chat_id = c.id AND cm2.user_id = ?
        WHERE c.is_group = 0
        GROUP BY c.id LIMIT 1
      `, [userId1, userId2]);
};

exports.createSingleChat = async (isGroup, groupName, createdBy) => {
    return db.query(`
        INSERT INTO chat (is_group, chat_name, created_by)
        VALUES (?, ?, ?)
      `, [isGroup, isGroup ? groupName : null, createdBy]);
};

exports.createGroupChat = async (chatId, userId) => {
    return db.query(`INSERT INTO chat_member (chat_id, user_id) VALUES (?, ?)`, [chatId, userId]);
};


exports.insertUsersSocketId = async (socketId, userId) => {
    return await db.query(`
        UPDATE users 
        SET socket_id = '${socketId}' 
        WHERE id = ${userId}
    `);
};


exports.saveMessage = async (chatId, senderId, message, messageType) => {
    return db.query(`
        INSERT INTO message (chat_id, sender_id, message, message_type)
        VALUES (?, ?, ?, ?)
      `, [chatId, senderId, message, messageType]);
};

exports.fetchMessagesById = async (messageId) => {
    return db.query(`
        SELECT m.*, u.username AS sender_name, u.profile_image
        FROM message m
        JOIN users u ON u.id = m.sender_id
        WHERE m.id = ?
      `, [messageId]);
};

exports.fetchMessages = async (chatId) => {
    return db.query(`
        SELECT m.*, u.username AS sender_name, u.profile_image
        FROM message m
        JOIN users u ON u.id = m.sender_id
        WHERE m.chat_id = ?
        ORDER BY m.id ASC
      `, [chatId]);
};


exports.markMessageAsRead = async (messageId, userId) => {
    await db.query(`UPDATE message SET is_read = 1 WHERE id = ? AND sender_id != ?`, [messageId, userId]);
};


exports.getUserChats = async (userId) => {
    return await db.query(`
      SELECT c.id AS chat_id, c.chat_name, c.is_group, c.created_by,
             cm.user_id, u.username as user_name, u.profile_image
      FROM chat c
      JOIN chat_member cm ON c.id = cm.chat_id
      LEFT JOIN users u ON cm.user_id = u.id
      WHERE c.id IN (
          SELECT chat_id FROM chat_member WHERE user_id = ?
      )
      GROUP BY c.id
    `, [userId]);
};





// ---------------------------------user model----------------------------------//

exports.getUserById = async (userId) => {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    return user;
};

exports.createUser = async (userId, userName) => {
    return await db.query(
        'INSERT INTO users (id, username) VALUES (?, ?)',
        [userId, userName]
    );
};

exports.updateUsername = async (userId, userName) => {
    return await db.query(
        'UPDATE users SET username = ? WHERE id = ?',
        [userName, userId]
    );
};