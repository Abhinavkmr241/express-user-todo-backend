const mongoose = require("mongoose")
const fs = require("fs")

const TodoImagesSchema = mongoose.Schema({

  imageTodo: {
    path: String,
    filename: String,
    contentType: String
  },

  _todo: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todos"
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

// TodoImagesSchema.pre("save", function (next) {
//   const b64 = new Buffer(fs.readFileSync(this.imageTodo.path)).toString('base64')
//   this.base64 = b64;
//   return next()
// })

TodoImagesSchema.virtual("base64").get(() => {
  const b64 = Buffer.from(fs.readFileSync(this.imageTodo.path)).toString("base64")
  return `${b64}`
})

TodoImagesSchema.set("toJSON", { virtuals: true })
TodoImagesSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("TodoImages", TodoImagesSchema)