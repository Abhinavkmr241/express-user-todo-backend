const multer = require('multer');
const path = require('path');

const UserImage = require('../../models/userImage');

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
}).single('imageUser');

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
                    if (req.file == undefined) {
                        return res
                            .status(400)
                            .json({ error: true, reason: "No File Selected!" })
                    } else {
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
                            return res.json({ error: false, userImage: userImage })
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
                    if (req.file == undefined) {
                        return res
                            .status(400)
                            .json({ error: true, reason: "No File Selected!" })
                    } else {
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