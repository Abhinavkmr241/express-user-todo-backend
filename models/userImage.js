const mongoose = require("mongoose")
const fs = require("fs")

const UserImageSchema = new mongoose.Schema({

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

UserImageSchema.virtual("base64").get(() => {
  const b64 = Buffer.from(fs.readFileSync(this.imageUser.path)).toString("base64")
  return `${b64}`
})

UserImageSchema.set("toJSON", { virtuals: true })
UserImageSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("UserImage", UserImageSchema)