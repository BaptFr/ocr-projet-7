const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');

const booksCtrl = require ('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
//router.get('/bestrating', auth, booksCtrl.getBestBooks)
router.get('/:id', auth, booksCtrl.getOneBook);
router.post('/', auth, booksCtrl.createBook);
router.put(':id', auth, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;