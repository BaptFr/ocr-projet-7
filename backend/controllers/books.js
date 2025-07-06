const Book = require('../models/Book');
const { cloudinary } = require('../middleware/cloudinary-config');

// Fonction utilitaire pour extraire le public_id depuis une URL Cloudinary
function extractPublicId(imageUrl) {
  const parts = imageUrl.split('/');
  const fileName = parts[parts.length - 1].split('.')[0]; // supprime .webp
  const folder = parts.slice(parts.indexOf('upload') + 1, -1).join('/'); // gère sous-dossiers éventuels
  return `${folder}/${fileName}`;
}

// TOUS LES LIVRES
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// TOP 3 LIVRES PAR NOTE
exports.bestRatingBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books || []))
    .catch((error) => res.status(500).json({ error: error.message }));
};

// LIVRE PAR ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// CRÉER UN LIVRE
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.file.path,
    averageRating: bookObject.ratings?.[0]?.grade || 0
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré avec succès.' }))
    .catch((error) => res.status(400).json({ error }));
};

// MODIFIER UN LIVRE
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: req.file.path
      }
    : JSON.parse(req.body.book);

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Non-autorisé' });
      }

      // Supprimer l'ancienne image si une nouvelle est uploadée
      if (req.file && book.imageUrl) {
        const publicId = extractPublicId(book.imageUrl);
        cloudinary.uploader.destroy(publicId, (error) => {
          if (error) console.error('Erreur suppression ancienne image :', error);
        });
      }

      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié.' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

// SUPPRIMER UN LIVRE
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Non-autorisé' });
      }

      const publicId = extractPublicId(book.imageUrl);

      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          console.error('Erreur Cloudinary :', error);
          return res.status(500).json({ error: 'Erreur suppression image Cloudinary' });
        }

        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé.' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// NOTER UN LIVRE
exports.rateOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      const alreadyRated = book.ratings.find(r => r.userId === req.body.userId);
      if (alreadyRated) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      }

      const newRating = {
        userId: req.body.userId,
        grade: req.body.rating
      };

      book.ratings.push(newRating);

      const totalRatings = book.ratings.length;
      const totalGrade = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      const newAverageRating = totalRatings > 0 ? totalGrade / totalRatings : 0;

      book.averageRating = newAverageRating;

      return book.save().then(updatedBook => res.status(200).json(updatedBook));
    })
    .catch((error) => res.status(400).json({ error }));
};
