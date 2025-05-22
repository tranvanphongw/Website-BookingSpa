const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu ảnh vào đúng thư mục
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lưu ảnh vào thư mục backend/public/images
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Giữ nguyên tên gốc của file
  },
  
});

// Kiểm tra định dạng file ảnh
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error('Chỉ được tải lên hình ảnh.'));
    }
  },
}).single('image'); // Sử dụng tên trường là 'image'

module.exports = upload;
