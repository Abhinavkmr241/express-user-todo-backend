const multer = require('multer');
const path = require('path');

const TodoImages = require('../../models/todoImages');
const Todo = require('../../models/todo');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: '/home/abhinav/Desktop/Express/express-user-todo/public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('images', 10)

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = {

    async post(req, res) {
        try {
            await upload(req, res, async (err) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ error: true, reason: err })
                } else {
                    if (req.files == undefined) {
                        return res
                            .status(400)
                            .json({ error: true, reason: "No File Selected!" })
                    } else {
                        try {
                            const todo = await Todo.findOne({ _id: req.params.id }).exec()
                            let todoImages = await TodoImages.create({
                                images: req.files,
                                _todo: todo._id
                            })
                            todoImages = todoImages.toObject()
                            return res.json({ error: false, todoImages: todoImages })
                        } catch (err) {
                            return res.status(500).json({ error: true, reason: err.message })
                        }
                    }
                }
            })
        } catch (err) {
            return res.status(500).json({ error: true, reason: err.message })
        }
    },

    async put(req, res) {
        try {
            await upload(req, res, async (err) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ error: true, reason: err })
                } else {
                    if (req.files == undefined) {
                        return res
                            .status(400)
                            .json({ error: true, reason: "No File Selected!" })
                    } else {
                        try {
                            const todoImages = await TodoImages.findOne({ _id: req.params.id }).exec()
                            todoImages.images = req.files;
                            let updatedTodoImages = await todoImages.save()
                            updatedTodoImages = updatedTodoImages.toObject()
                            return res
                            .json({ error: false, todoImages: updatedTodoImages })
                        } catch (err) {
                            return res.status(500).json({ error: true, reason: err.message })
                        }
                    }
                }
            })
        } catch (err) {
            return res.status(500).json({ error: true, reason: err.message })
        }
    }
}