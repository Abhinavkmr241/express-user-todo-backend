const multer = require('multer');
const path = require('path');

const UserImage = require('../../models/userImage');

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
}).single('imageUser');

module.exports = {

  async post(req, res) {
    try {
      await upload(req, res, async (err) => {
        if (err) {
          return res
            .status(400)
            .json({ error: true, reason: err })
        }
        if (req.file === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "No File Selected!" })
        }
        try {
          let userImage = await UserImage.create({
            imageUser: {
              path: req.file.path,
              filename: req.file.filename,
              contentType: req.file.mimetype
            },
            _user: req.user._id
          })
          userImage = userImage.toObject();
          return res.json({ error: false, userImage })
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
        if (req.file === undefined) {
          return res
            .status(400)
            .json({ error: true, reason: "No File Selected!" })
        }
        try {
          const userImage = await UserImage.findOne({ _id: req.params.id }).exec()
          userImage.imageUser = {
            path: req.file.path,
            filename: req.file.filename,
            contentType: req.file.mimetype
          };
          let updatedUserImage = await userImage.save()
          updatedUserImage = updatedUserImage.toObject()
          return res.json({ error: false, userImage: updatedUserImage })
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