const express = require("express")
const router = express.Router()

const expressJwt = require("express-jwt")

const checkJwt = expressJwt({ secret: process.env.SECRET }) // the JWT auth check middleware

const login = require("./auth")
const signup = require("./auth/signup")
const forgotpassword = require("./auth/password")
const users = require("./users")
const todos = require("./todos")
const userImages = require("./userImages")
const todoImages = require("./todoImages")

router.post("/login", login.post) // UNAUTHENTICATED
router.post("/signup", signup.post) // UNAUTHENTICATED
router.post("/forgotpassword", forgotpassword.startWorkflow) // UNAUTHENTICATED; AJAX
router.post("/resetpassword", forgotpassword.resetPassword) // UNAUTHENTICATED; AJAX

router.all("*", checkJwt) // use this auth middleware for ALL subsequent routes

router.get("/user", users.get)
router.put("/user/:id", users.put)
router.delete("/user", users.delete)

router.post("/userImage", userImages.post)
router.put("/userImage/:id", userImages.put)
router.delete("/userImage/:id", userImages.delete)

router.get("/todos", todos.find)
router.post("/todo", todos.post)
router.put("/todo/:id", todos.put)
router.delete("/todo/:id", todos.delete)

router.get("/todoImages/:id", todoImages.get)
router.post("/todoImages/:id", todoImages.post)
router.put("/todoImages/:id", todoImages.put)
router.delete("/todoImages/:id", todoImages.delete)

module.exports = router
