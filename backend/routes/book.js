const express = require ('express');
const router = express.Router();

const booksCtrl = require ('../controllers/books');

router.get('/books', booksCtrl.getAllBooks);
router.get('/books', booksCtrl.getBestBooks)
router.get('/books/:id', booksCtrl.getOneBook)
router.post('/books', booksCtrl.createBook);
router.put('/books/:id', booksCtrl.modifyBook);
router.delete('/books/:id', booksCtrl.deleteBook);

module.exports = router;