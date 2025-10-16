const { Server } = require("socket.io");
const {
  saveMessage,
  fetchMessages,
  insertUsersSocketId,
  fetchMessagesById,
  markMessageAsRead,
  checkIsUserChatExistsOrNot,
  createSingleChat,
  createGroupChat,
  getUserChats,
} = require("../model/chat.model");

// This is exporting a function to set up Socket.IO on a given server.
module.exports = function (server) {
  // Initialize a new Socket.IO server attached to the HTTP server.

  const io = new Server(server, {
    //  Enable CORS for all origins and allow GET/POST requests.
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Store active connections
  const userSockets = new Map();

  // Event fired when a client connects to the server.
  io.on("connection", (socket) => {
    // Log the new client socket ID.
    console.log('🔌 New client connected', socket.id);

    // Track which chat room the user is currently in.
    let currentChatRoom = null;

    // -----------------------------------------------this is proper using with token and use userid as dynamic--------------//

    // const authHeader = socket.handshake.headers.authorization;
    // console.log('!authHeader', !authHeader);
  
    // if (!authHeader) {
    //     console.log("Authorization header is missing");
    //     socket.emit('unauthorized', {
    //         status: 401,
    //         message: 'Authorization header is missing',
    //         success: false,
    //     });
    //     return socket.disconnect();
    // }
    // const token = authHeader.replace('Bearer ', '');
    // const decoded = jwt.verify(token, SECRET_KEY);
    // let loggedUserId = decoded.data.id;
  
    // socket.on('user_connected', async () => {
    //     console.log('loggedUserId', loggedUserId);
  
    //     userSockets.set(loggedUserId, socket.id);
    //     await insertUsersSocketId(socket.id, loggedUserId);
    //     try {
    //         const chats = await getUserChats(loggedUserId);
    //         console.log('chats', chats);
  
    //         socket.emit("chat_list", chats);
    //     } catch (error) {
    //         console.error("❌ Error fetching initial chats:", error);
    //     }
    // });
  
    // socket.on("create_chat", async ({ userIds, isGroup, groupName }) => {
    //     try {
    //         let createdBy = loggedUserId
    //         let chat;
    //         if (!isGroup && userIds.length === 2) {
    //             const existing = await checkIsUserChatExistsOrNot(userIds[0], userIds[1]);
    //             if (existing && existing.length > 0) {
    //                 chat = existing[0];
    //             }
    //         }
    //         if (!chat) {
    //             const result = await createSingleChat(isGroup, groupName, createdBy);
    //             const chatId = result.insertId;
    //             for (const userId of userIds) {
    //                 await createGroupChat(chatId, userId);
    //                 const userSocketId = userSockets.get(userId);
    //                 if (userSocketId) {
    //                     io.to(userSocketId).emit("chat_created", {
    //                         id: chatId,
    //                         is_group: isGroup,
    //                         chat_name: groupName,
    //                         partner_id: isGroup ? null : userIds.find(id => id !== userId)
    //                     });
    //                 }
    //             }
    //             chat = { id: chatId, is_group: isGroup, chat_name: groupName };
    //         }
    //         currentChatRoom = chat_${ chat.id };
    //         socket.join(currentChatRoom);
    //         socket.chatId = chat.id;
    //         socket.emit("chat_created", chat);
    //     } catch (err) {
    //         console.error("❌ Error in create_chat:", err);
    //         socket.emit("error", err.message);
    //     }
    // });

    //-------------------------------------------------------------end this code we use after connetion event------------------// 


    // Used When: A user connects and identifies themselves.
    // Why: So the server can associate the socket with a user ID.
    socket.on('user_connected', async (userId) => {
      console.log(`👤 User ${userId} connected with socket ${socket.id}`);

      // Save socket ID in DB for persistence or reconnect logic.
      userSockets.set(userId, socket.id);
      await insertUsersSocketId(socket.id, userId);
      try {

        // Send the user's chat list after successful connection.
        const chats = await getUserChats(userId);
        socket.emit("chat_list", chats);
      } catch (error) {
        console.error("❌ Error fetching initial chats:", error);
      }
    });


    // Used When: A user wants to start a new chat (group or 1:1).
    // Why: To create a new chat or reuse an existing 1:1 chat.
    socket.on("create_chat", async ({ userIds, isGroup, groupName, createdBy }) => {
      try {
        let chat;

        // Check if 1:1 chat already exists to avoid duplicates.
        if (!isGroup && userIds.length === 2) {
          const existing = await checkIsUserChatExistsOrNot(userIds[0], userIds[1]);
          if (existing && existing.length > 0) {
            chat = existing[0];
          }
        }

        // Create new chat if not already present.
        if (!chat) {
          const result = await createSingleChat(isGroup, groupName, createdBy);
          const chatId = result.insertId;

          // Add all users to the chat.
          for (const userId of userIds) {
            await createGroupChat(chatId, userId);
            const userSocketId = userSockets.get(userId);
            if (userSocketId) {
              console.log(`Notifying user ${userId} about new chat`);

              // Notify online users that a new chat was created.
              io.to(userSocketId).emit("chat_created", {
                id: chatId,
                is_group: isGroup,
                chat_name: groupName,
                partner_id: isGroup ? null : userIds.find(id => id !== userId)
              });
            }
          }
          chat = { id: chatId, is_group: isGroup, chat_name: groupName };
        }

        // Join the socket to the corresponding chat room.
        currentChatRoom = `chat_${chat.id}`;
        socket.join(currentChatRoom);
        socket.chatId = chat.id;

        // Send confirmation back to creator.
        socket.emit("chat_created", chat);
      } catch (err) {
        console.error("❌ Error in create_chat:", err);
        socket.emit("error", err.message);
      }
    });


    // Used When: A user manually refreshes or navigates to chat list.
    // Why: To re-fetch the latest chats.
    socket.on("fetch_chats", async ({ userId }) => {
      try {
        console.log(`Fetching chats for user ${userId}`);

        // Send the chat list to the user.
        const chats = await getUserChats(userId);
        console.log(`Found ${chats.length} chats for user ${userId}`);
        socket.emit("chat_list", chats);
      } catch (error) {
        console.error("❌ Error fetching chats:", error);
        socket.emit("error", error.message);
      }
    });


    // Used When: A user clicks to open a chat.
    // Why: Join the chat room and load messages.
    // NEW: Join chat room when a chat is selected
    socket.on('join_chat', async ({ chatId, userId }) => {
      console.log(`User ${userId} joining chat room: chat_${chatId}`);

      // Leave previous room before joining new one.
      if (currentChatRoom) {
        socket.leave(currentChatRoom);
      }

      // Join new room and store chat ID.
      currentChatRoom = `chat_${chatId}`;
      socket.join(currentChatRoom);
      socket.chatId = chatId; // Store for cleanup on disconnect

      // Send message history to user.
      try {
        const messages = await fetchMessages(chatId);
        console.log(`Sending ${messages.length} messages for chat ${chatId}`);
        socket.emit("chat_history", messages);
      } catch (error) {
        console.error(`❌ Error fetching messages for chat ${chatId}:`, error);
        socket.emit("error", error.message);
      }
    });


    // Used When: A user sends a new message.
    // Why: Save the message and broadcast it to others in the room.
    socket.on("send_message", async ({ chatId, senderId, message, messageType }) => {
      try {
        console.log(`Sending message to chat ${chatId} from user ${senderId}: ${message}`);
        senderId = parseInt(senderId, 10);

        // Save the message
        const result = await saveMessage(chatId, senderId, message, messageType);
        const messageId = result.insertId;

        // Get the saved message details
        const messageDetails = await fetchMessagesById(messageId);
        console.log(`Message saved with ID ${messageId}`, messageDetails[0]);

        // Broadcast to everyone in the chat room, including sender
        io.to(`chat_${chatId}`).emit("getMessage", messageDetails[0]);

        // Get all chat members to notify offline users
        try {
          // This would need a function to get chat members from your database
          // const chatMembers = await getChatMembers(chatId);
          // For each member not in the room, send a notification
          // Implementation depends on your user notification system
        } catch (err) {
          console.error("Error notifying offline users:", err);
        }
      } catch (error) {
        console.error("❌ Error in send_message:", error);
        socket.emit("error", error.message);
      }
    });


    // Used When: Client requests message history again.
    // Why: Refresh or load more messages.
    socket.on("fetch_messages", async ({ chatId }) => {
      try {
        console.log(`Fetching messages for chat ${chatId}`);
        const [messages] = await fetchMessages(chatId);
        console.log(`Found ${messages.length} messages for chat ${chatId}`);

        // Send chat history.
        socket.emit("chat_history", messages);
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
        socket.emit("error", error.message);
      }
    });


    // Used When: A user sees a message.
    // Why: Update read status for that message.
    socket.on("mark_as_read", async ({ messageId, userId }) => {
      try {

        // Update DB and notify that message was read.
        await markMessageAsRead(messageId, userId);
        socket.emit("message_read", { messageId });
      } catch (error) {
        console.error("❌ Error marking message as read:", error);
      }
    });


    // Handle socket disconnection
    // Used When: A user closes tab or loses connection.
    // Why: Clean up server-side state.
    socket.on("disconnect", async () => {
      console.log("⚠️ Client disconnected:", socket.id);

      // Remove socket from userSockets map
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          console.log(`User ${userId} disconnected`);
          userSockets.delete(userId);
          break;
        }
      }

      // Leave chat room if joined
      if (currentChatRoom) {
        console.log(`Leaving room ${currentChatRoom}`);
        socket.leave(currentChatRoom);
      }
    });
    
  });
};

// ---------------------------if we send notification to another user-----------------------------------//


// socket.on("send_message", async ({ chatId, senderId, message, messageType }) => {
//   try {
//     senderId = parseInt(senderId, 10);

//     // 1. Save the message in the DB
//     const [result] = await db.query(`
//       INSERT INTO message (chat_id, sender_id, message, message_type)
//       VALUES (?, ?, ?, ?)
//     `, [chatId, senderId, message, messageType]);

//     const messageId = result.insertId;

//     // 2. Fetch the inserted message
//     const [messageDetails] = await db.query(`
//       SELECT m.*, u.name AS sender_name, u.profile_image
//       FROM message m
//       JOIN users u ON u.id = m.sender_id
//       WHERE m.id = ?
//     `, [messageId]);

//     // 3. Send message to all users in the chat room
//     io.to(`chat_${chatId}`).emit("getMessage", messageDetails[0]);

//     // 4. Get all chat members except sender
//     const [chatMembers] = await db.query(`
//       SELECT user_id FROM chat_member WHERE chat_id = ? AND user_id != ?
//     `, [chatId, senderId]);

//     // 5. Notify offline users
//     for (const member of chatMembers) {
//       const userId = member.user_id;
//       const recipientSocketID = userSockets.get(userId.toString());

//       // Check if recipient is not in the room (offline)
//       const isOnline = recipientSocketID && io.sockets.adapter.rooms.get(`chat_${chatId}`)?.has(recipientSocketID);

//       if (!isOnline) {
//         const [userData] = await db.query(`SELECT fcm_token FROM users WHERE id = ?`, [userId]);

//         if (userData[0]?.fcm_token) {
//           // Example (use your push logic here)
//           // sendPushNotification(userId, userData[0].fcm_token, messageDetails[0]);
//         }
//       }
//     }

//   } catch (error) {
//     console.error("❌ Error in send_message:", error);
//     socket.emit("error", error.message);
//   }
// });


