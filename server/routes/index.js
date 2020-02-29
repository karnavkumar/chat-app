const express = require('express');
const userController = require('./../controllers/users.controller')
const router = express.Router();

module.exports = () => {

  router.post("/register", async (req, res) => {
    const user = await userController.registerUser(req.body);
    return res.status(200).json(user)
  })

  router.post("/login", async (req, res) => {
    const user = await userController.getUser(req.body);
    return res.status(200).json(user)
  })

  router.get("/getUsers", async (req, res) => {
    const user = await userController.getUserData(req.body);
    return res.status(200).json(user)
  })

  router.get("/userId", async (req, res) => {
    const userId = await userController.getRandomId();
    return res.status(200).json({
      data: userId
    })
  })

  router.get("/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const userResp = await userController.getUserListAndInfo(Number(userId));
      return res.status(200).json({
        data: userResp
      })
    } catch (error) {
      if (error === "ERR_ID") {
        return res.status(421).json({
          message: error
        })
      }
      return res.status(420).json({
        message: error
      })
    }
  })

  router.get("/users/:id/:chatUser", async (req, res) => {
    try {
      const userId = req.params.id;
      const chatUserId = req.params.chatUser;
      const userResp = await userController.getUsersInfo(Number(userId), Number(chatUserId));
      return res.status(200).json({
        data: userResp
      })
    } catch (error) {
      if (typeof error === "string") {
        return res.status(421).json({
          message: error
        })
      }
      return res.status(420).json({
        message: error
      })
    }
  })

  router.get("/messages/:id/:chatUser", async (req, res) => {
    try {
      const userId = req.params.id;
      const chatUserId = req.params.chatUser;
      const userResp = await userController.getUserMessages(userId, chatUserId);
      return res.status(200).json({
        data: userResp
      })
    } catch (error) {
      if (typeof error === "string") {
        return res.status(421).json({
          message: error
        })
      }
      return res.status(420).json({
        message: error
      })
    }
  })
  return router;
}