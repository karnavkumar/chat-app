const dbHelper = require('./../helpers/db.helper');
const socketClass = require('./../socket');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const userObject = {
  user_id: null,
  chats_ids: [],
  user_name: null
}
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (oldPassword, password) => bcrypt.compareSync(password, oldPassword);

class UserController {

  getUser(data) {
    return new Promise(async (resolve) => {
      const user = await dbHelper.getDbData("users", { email: data.email.toLowerCase() })
      if (user && user.length > 0) {
        if (isValidPassword(user[0].password, data.password)) {
          delete user[0].password
          user[0].user_token = jwt.sign(user[0].user_id, "darshana@1")
          resolve({ success: 1, message: "Logged in successfully.", data: user[0] })
        }
      } else {
        resolve({ success: 0, message: "Please check your username/password." })
      }
    });
  }

  getUserData() {
    return new Promise(async (resolve) => {
      const users = await dbHelper.getDbData("users", {})
      if (users && users.length > 0) {
        for (const user of users) {
          delete user.password
        }
        resolve({ success: 1, message: "users.", data: users })
      } else {
        resolve({ success: 0, message: "Please check your username/password." })
      }
    });
  }

  registerUser(data) {
    return new Promise(async (resolve) => {
      console.log("da5ta:::::", data);
      const user = await dbHelper.getDbData("users", { email: data.email.toLowerCase().trim() })
      if (user && user.length > 0) {
        resolve({ success: 0, message: "Email already exists." })
      } else {
        data.email = data.email.toLowerCase().trim();
        data.password = createHash(data.password);
        data.user_id = await this.getRandomId();
        const addedUser = await dbHelper.inserDbData("users", data)
        socketClass.sendRegisterBroadcast(addedUser)
        return resolve({ success: 1, message: "Registered successfully." });
      }
    });
  }

  getRandomId() {
    return new Promise(async (resolve) => {
      const IdGenerated = Math.round(Math.random() * 500);
      const usersAlreadyAdded = await dbHelper.getDbData("users", { user_id: IdGenerated });
      if (usersAlreadyAdded && usersAlreadyAdded.length) {
        await this.getRandomId()
      }
      if (usersAlreadyAdded && !usersAlreadyAdded.length) {
        userObject.user_id = IdGenerated;
        // userObject.user_name = "User - " + IdGenerated;
        // await dbHelper.inserDbData("users", userObject)
        return resolve(IdGenerated)
      }
    })
  }

  getUserListAndInfo(userId, chatUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = {
          user: {},
          chatedUsers: []
        }
        const userInfo = await dbHelper.getDbData("users", { user_id: userId });
        console.log("userInfo", userInfo);
        if (userInfo && !userInfo.length) {
          return reject("ERR_ID")
        }
        response.user = userInfo[0]
        response.user.chatsTopic = [
          'topic_user_' + response.user.user_id,
          'topic_chat'
        ];
        response.user.user_token = jwt.sign(response.user.user_id, "darshana@1")
        if (userInfo[0].chats_ids && userInfo[0].chats_ids.length) {
          const userInfos = await dbHelper.getDbData("users", { user_id: { $in: userInfo[0].chats_ids } });
          response.chatedUsers = userInfos
        }
        return resolve(response)
      } catch (error) {
        console.error("[getUserListAndInfo] Error : ", error)
        return reject()
      }
    })
  }

  getUsersInfo(userId, chatUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        /*                      */
        const response = {
          chatuser: {},
        }
        const userInfo = await dbHelper.getDbData("users", { user_id: chatUserId });
        console.log("userInfo", userInfo);
        if (userInfo && !userInfo.length) {
          return reject("ERR_NOT_FOUND")
        }
        response.user = userInfo[0]
        if (userInfo[0].chats_ids) {
          if (userInfo[0].chats_ids.includes(chatUserId)) {
            return reject("ALREADY_ADDED")
          }
          console.log("--- TO HERE");

          const mainUserInfo = await dbHelper.getDbData("users", { user_id: userId });
          await dbHelper.updateDbData("users", userId, { $push: { chats_ids: chatUserId } })
          await dbHelper.updateDbData("users", chatUserId, { $push: { chats_ids: userId } })
          socketClass.sendToUsers(userId, response.user);
          socketClass.sendToUsers(chatUserId, mainUserInfo[0]);
        }
        return resolve(response)
      } catch (error) {
        console.error("[getUsersList] Error : ", error)
        return reject(error);
      }
    })
  }

  getUserMessages(userId, chatUserId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = {
          messages: [],
        }
        const messages = await dbHelper.getDbData("chats", { $or: [{ dept: chatUserId + userId }, { dept: userId + chatUserId }] });
        response.messages = messages
        return resolve(response)
      } catch (error) {
        console.error("[getUsersList] Error : ", error)
        return reject(error);
      }
    })
  }

}

module.exports = new UserController();