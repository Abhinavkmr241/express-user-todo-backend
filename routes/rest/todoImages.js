const multer = require('multer');
const path = require('path');

const TodoImages = require('../../models/todoImages');
const Todo = require('../../models/todo');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: '/home/abhinav/Desktop/Express/express-user-todo/public/uploads',
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

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
  }
  return cb('Error: Images Only!');
}

// Init Upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
}).array('images', 10)


module.exports = {

  async post(req, res) {
    try {
      await upload(req, res, async (err) => {
        if (err) {
          return res
            .status(400)
            .json({ error: true, reason: err })
        }
        if (req.files === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "No File Selected!" })
        }
        try {
          const todo = await Todo.findOne({ _id: req.params.id }).exec()
          let todoImages = await TodoImages.create({
            images: req.files,
            _todo: todo._id
          })
          todoImages = todoImages.toObject()
          return res.json({ error: false, todoImages })
        } catch (err0) {
          return res.status(500).json({ error: true, reason: err0.message })
        }
      })
      return res.status(200)
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
        }
        if (req.files === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "No File Selected!" })
        }
        try {
          const todoImages = await TodoImages.findOne({ _id: req.params.id }).exec()
          todoImages.images = req.files;
          let updatedTodoImages = await todoImages.save()
          updatedTodoImages = updatedTodoImages.toObject()
          return res
            .json({ error: false, todoImages: updatedTodoImages })
        } catch (err0) {
          return res.status(500).json({ error: true, reason: err0.message })
        }
      })
      return res.status(200)
    } catch (err) {
      return res.status(500).json({ error: true, reason: err.message })
    }
  }
}