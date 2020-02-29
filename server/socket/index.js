const dbHelper = require('./../helpers/db.helper');
let io;
const usersActive = {}

class Socket {
  initialise(socketIO) {
    try {
      io = socketIO;
      io.on("connection", (socketio) => {

        function joinLeave(rooms, method) {
          for (const i in rooms) {
            if (rooms[i] !== null) {
              if (method === 'join') {
                socketio.join(rooms[i]);
              } else {
                socketio.leave(rooms[i]);
              }
            } else {
              console.log('cannot get rooms, ignoring');
            }
          }
        }

        socketio.on("online", async (data) => {
          console.log("Socket Online Data : ", data);
          usersActive[socketio.id] = data.user_id
          socketio.emit("online", { success: 1 });
        })

        socketio.on("subscribe", async (data) => {
          try {
            let subRooms = [];
            if (typeof data.rooms === 'object') {
              subRooms = data.rooms;
            } else {
              subRooms = data.rooms.split(',');
            }
            joinLeave(subRooms, 'join'); // for joining rooms / topic subscription
            socketio.emit('subscribe', { success: 1 });
          } catch (e) {
            logger.error('[subscribe] %s', e.stack);
            socketio.emit('subscribe', { success: 0 });
          }
        });

        socketio.on("message", async (data) => {
          try {
            await dbHelper.inserDbData("chats", data);
            const messageFrom = data.msg_from;
            const messageTo = data.msg_to;
            const topic = 'topic_user_' + messageTo;
            io.in(topic).emit('message', data);
            const topic1 = 'topic_user_' + messageFrom;
            io.in(topic1).emit('message', data);
          } catch (e) {
          }
        });


        socketio.on("name-change", async (data) => {
          try {

            const user = await dbHelper.getDbData("users", { user_id: data.user_id });;
            if (user[0] && user[0].chats_ids && user[0].chats_ids.length) {
              for (let index = 0; index < user[0].chats_ids.length; index++) {
                const userId = user[0].chats_ids[index];
                const topic = 'topic_user_' + userId;
                io.in(topic).emit('name-change', data);
              }
            }
            await dbHelper.updateDbData("users", data.user_id, { $set: { user_name: data.user_name } })
            const topic1 = 'topic_user_' + data.user_id;
            io.in(topic1).emit('name-change', data);
          } catch (e) {
          }
        });

        socketio.on('disconnect', async function () {

          const user = await dbHelper.getDbData("users", { user_id: usersActive[socketio.id] });
          if (user[0] && user[0].chats_ids && user[0].chats_ids.length) {
            for (let index = 0; index < user[0].chats_ids.length; index++) {
              const userId = user[0].chats_ids[index];
              const topic = 'topic_user_' + userId;
              io.in(topic).emit('user-removed', { user_id: user[0].user_id });
            }
          }
          // await dbHelper.removeDbData("users", { user_id : user[0].user_id } );
          // await dbHelper.removeDbData("chats", { msg_to : user[0].user_id } );
          // await dbHelper.removeDbData("chats", { msg_from : user[0].user_id } );
          var connectionMessage = socketio.username + " Disconnected from Socket " + socketio.id;
          console.log(connectionMessage);
        });
      })
    } catch (error) {

    }
  }

  sendToUsers(userId, chatuser) {
    const topic = "topic_user_" + userId;
    console.log("topic", topic);

    io.in(topic).emit('broadcast-chat-add', chatuser);
  }

  sendRegisterBroadcast(data) {
    const topic = "topic_chat";
    console.log("topic", topic);

    io.in(topic).emit('broadcast-register', data);
  }
}

module.exports = new Socket()