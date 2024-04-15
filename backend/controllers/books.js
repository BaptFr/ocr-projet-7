const Book = require('../models/Book');

exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(
    (books) => { 
      res.status(200).json({ message: 'Récupération de tous les livres.', books: books });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    });
};

exports.getBestBooks= (req, res, next) => {
 //Voir critères
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.createBook = (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre envoyé enregistré avec succès.'}))
    .catch(error => res.status(400).json({ error: error}));
};

exports.modifyBook =(eq, res, next) => {
  Book.updateOne ({_id: req.params.id },  {...req.body, _id: req.params.id })
    .then (() =>res.status(200).json({messae: 'Livre modifié.'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne ({_is: req.params.id})
  .then(() => res.status(200).json({message: 'Livre supprimé.'}))
  .catch(error => res.status(400).json ({ error }));
};