const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'books',
    format: async () => 'webp',
    public_id: (req, file) => {
      const base = file.originalname.split('.')[0];
      return `book_${base}_${Date.now()}`;
    }
  }
});

module.exports = {
  cloudinary,
  multerUpload: multer({ storage }).single('image')
};
