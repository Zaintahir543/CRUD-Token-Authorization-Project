const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

// Middleware
const upload = multer({ storage });

module.exports = upload;