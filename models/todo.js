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

    _user : {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model("Todos", ToDoSchema)