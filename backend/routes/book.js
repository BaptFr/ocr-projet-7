const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const booksCtrl = require ('../controllers/books');
const upload = require('../middleware/cloudinary-config');

router.get('/bestrating', booksCtrl.bestRatingBooks);
router.get('/:id', booksCtrl.getOneBook); //Sans authentification
router.post('/:id/rating', auth, booksCtrl.rateOneBook);
router.post('/', auth, upload, booksCtrl.createBook);
router.put('/:id', auth, upload, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/', booksCtrl.getAllBooks); //Sans authentification

module.exports = router;