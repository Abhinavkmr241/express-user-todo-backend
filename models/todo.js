const mongoose = require("mongoose")


const ToDoSchema = mongoose.Schema({

  message: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
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

ToDoSchema.virtual("_todoImages", {
  ref: "TodoImages",
  localField: "_id",
  foreignField: "_todo"
})

ToDoSchema.set("toJSON", { virtuals: true })
ToDoSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Todos", ToDoSchema)
