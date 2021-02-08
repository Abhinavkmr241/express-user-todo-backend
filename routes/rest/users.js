const User = require("../../models/user")
const ToDo = require("../../models/todo")
const UserImage = require("../../models/userImage")
const TodoImages = require("../../models/todoImages")

module.exports = {

  /**
   *
   * @api {get} /user User Details
   * @apiName userDetails
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiPermission User
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   * @apiParam {String} id Users unique ID.
   *
   * @apiSuccess (200) {json} name description
   *
   *
   * @apiSuccessExample {type} Success-Response:
   * {
   *     "error" : false,
   *     "users" : [
   *          "email" : "myEmail@logic-square.com",
   *          "phone" : "00000000000",
   *          "name"  :{
   *                "first":"Jhon",
   *                "last" :"Doe"
   *      ]
   * }
   *
   *
   */
  async get(req, res) {
    try {
      const user = await User.findOne({ _id: req.user._id }).populate("_userImage _todos")
        .select("-password -forgotpassword")
        .exec()
      return res.json({ error: false, user })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   *
   * @api {put} /user/:id User update, one or multiple fields
   * @apiName userUpdate
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   *
   * @apiParam {String} id Users unique ID.
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiParamExample  {json} Request-Example:
   * {
   *     "email" : "myEmail@logic-square.com",
   *     "phone" : "00000000000",
   *     "name"  :{
   *          "first":"Jhon",
   *          "last" :"Doe"
   *      },
   *      "isActive" : true
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false,
   *     "user" : {
   *          "email" : "myEmail@logic-square.com",
   *          "phone" : "00000000000",
   *          "name"  :{
   *              "first":"Jhon",
   *              "last" :"Doe"
   *           },
   *          "isActive" : true,
   *          "password" : "myPass"
   *      }
   * }
   *
   *
   */
  async put(req, res) {
    try {
      const {
        phone, password, isActive, name
      } = req.body
      const user = await User.findOne({ _id: req.params.id }).exec()
      if (user === null) return res.status(400).json({ error: true, reason: "No such User!" })
      if (phone !== undefined) user.phone = phone
      if (password !== undefined) user.password = password
      if (isActive !== undefined && typeof isActive === "boolean") user.isActive = isActive
      // if (name !== undefined && (name.first !== undefined || name.last !== undefined)) user.name = {}
      if (name !== undefined && name.first !== undefined) user.name.first = name.first
      if (name !== undefined && name.last !== undefined) user.name.last = name.last
      let updatedUser = await user.save()
      updatedUser = updatedUser.toObject()
      delete updatedUser.password
      delete updatedUser.forgotpassword
      return res.json({ error: false, user: updatedUser })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  },

  /**
   *
   * @api {delete} /user User delete
   * @apiName userDelete
   * @apiGroup user
   * @apiVersion  1.0.0
   * @apiHeader {String} Authorization The JWT Token in format "Bearer xxxx.yyyy.zzzz"
   *
   *
   * @apiParam {String} id Users unique ID.
   *
   * @apiSuccess (200) {json} name description
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "error" : false
   * }
   *
   *
   */
  async delete(req, res) {
    try {
      await UserImage.deleteOne({ _user: req.user._id })
      let todos = await ToDo.find({ _user: req.user._id })
      todos.forEach(async (todo) => {
        await TodoImages.deleteMany({ _todo: todo._id })
      })
      // for (var i = 0; i < todos.length; i++) {
      //   await TodoImages.deleteMany({ _todo: todos[i]._id })
      // }
      await ToDo.deleteMany({ _user: req.user._id })
      await User.deleteOne({ _id: req.user._id })
      return res.json({ error: false })
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}
