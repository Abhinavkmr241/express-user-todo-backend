const mongoose = require("mongoose")

const UserImageSchema = mongoose.Schema({

  imageUser: {
    path: String,
    filename: String,
    contentType: String
  },

  _user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  lastModifiedAt: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model("UserImage", UserImageSchema)