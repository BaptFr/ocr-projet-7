const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const booksCtrl = require ('../controllers/books');

router.get('/', booksCtrl.getAllBooks); //Sans authentification
//router.get('/bestrating', booksCtrl.bestRatingBooks);
router.get('/:id', booksCtrl.getOneBook); //Sans authentification
router.post('/:id/rating', auth, booksCtrl.rateOneBook);
router.post('/', auth, multer, booksCtrl.createBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);


module.exports = router;