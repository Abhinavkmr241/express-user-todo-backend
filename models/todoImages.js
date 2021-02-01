const mongoose = require("mongoose")

const TodoImagesSchema = mongoose.Schema({

    images: {
        type: Array,
        default: []
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

module.exports = mongoose.model("TodoImages", TodoImagesSchema)