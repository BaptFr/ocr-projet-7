const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { multerUpload } = require('../middleware/cloudinary-config');
const booksCtrl = require ('../controllers/books');


router.get('/bestrating', booksCtrl.bestRatingBooks);
router.get('/:id', booksCtrl.getOneBook); //Sans authentification
router.post('/:id/rating', auth, booksCtrl.rateOneBook);
router.post('/', auth, multerUpload, booksCtrl.createBook);
router.put('/:id', auth, multerUpload, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/', booksCtrl.getAllBooks); //Sans authentification

module.exports = router;