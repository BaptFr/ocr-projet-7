const Book = require('../models/Book');
const fs = require('fs');
const sharp = require('sharp');



//TOUS LES LIVRES 
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => { 
        res.status(200).json(books); 
      })
    .catch(
      (error) => {
        res.status(400).json({ error: error });
      });
};

                                                                  
exports.bestRatingBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      // Si aucun livre n'est trouvé, renvoyer un tableau vide
      const responseBooks = books.length > 0 ? books : [];
      res.status(200).json(responseBooks);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message })
    });
}; 


//CONSULTER UN LIVRE
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => {res.status(404).json({ error }) 
    });
};


//NOTER UN LIVRE                                                                   
exports.rateOneBook = (req, res, next) => {
  Book.findOne({_id: req.params.id})
    .then ((book) => {
      //Conditions : Vérification du livre et vérification si l'utilisateur a déjà noté le livre
      if(!book){
        return res.status(404).json({ message:'Livre non trouvé'});
      }
      const alreadyRated = book.ratings.find(rating => rating.userId === req.body.userId);
      if (alreadyRated) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      }
      
      //Envoi de la nouvelle notation puis sauvegarde base de données 
      const newRating = {
        userId: req.body.userId,
        grade: req.body.rating
      };
      book.ratings.push(newRating);

      //Calcul de la nouvelle moyenne de notation du livre
      const totalRatings = book.ratings.length;
      const totalGrade = book.ratings.reduce((acc, curr) => acc + curr.grade, 0); //Méthode reduce
      const newAverageRating = totalRatings > 0 ? totalGrade / totalRatings : 0; //Calcul de la moyenne
      console.log(newAverageRating);

      //Renvoi des informations mises à jour et sauvegarde dans la bdd
      book.averageRating = newAverageRating;
      return book.save().then(updatedBook => {
        res.status(200).json(updatedBook);
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


// CRÉATION D'UN LIVRE
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const resizedFileName = `resized-${req.file.filename.replace(/\.[^.]+$/, '')}.webp`; //supp et changement de l'extension
  const resizedImagePath = `./images/${resizedFileName}`;

  sharp.cache(false); // Nécessaire pour suppr image d'origine
  sharp(req.file.path)
    .resize({ fit: 'contain'})
    .toFormat('webp')
    .toFile(resizedImagePath, (err, info) => {
      if (err) {
        return res.status(401).json({ error: err.message });
      }

      // Suppr image originale après redimensionnement
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erreur lors de la suppression du fichier original:', unlinkErr);
          return res.status(500).json({ error: 'Erreur lors de la suppression du fichier original(redimensionné)' });
        }

        // Nouveau Book avec l'URL de l'img redimensionnée
        const book = new Book({
          ...bookObject,
          userId : req.auth.userId,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${resizedFileName}`, //Nouveau nom de l'img
          averageRating: bookObject.ratings[0].grade 
        });

        //Ajout et sauvegarde du nouveau livre dans la base de données
        book.save()
          .then(() => { res.status(201).json({ message: 'Livre envoyé enregistré avec succès.'});
          })
          .catch((error) => {
            //Si image présente lors de l'erreur d'ajout : suppression de l'image redimensionnée
            if (book.imageUrl) {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, (deleteErr) => {
                if (deleteErr) {
                  console.error('Erreur lors de la suppression du fichier redimensionné:', deleteErr);
                }
              });
            }
            res.status(400).json({ error });
          });
      });
    });
};


//MODIFICATION D'UN LIVRE
exports.modifyBook =(req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._userId;

  //Vérification de l'userId
  Book.findOne({_id: req.params.id})
  .then ((book) => {
    if(book.userId !=req.auth.userId) {
      res.status(401).json({message : 'Non-autorisé'});
    }

    //Suppr de l'ancienne image
    if (req.file && book.imageUrl) {
      const oldFilename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${oldFilename}`, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erreur lors de la suppression de l'ancienne image :", unlinkErr);
        }
      });
    }
 
    //Si une nouvelle image : sharp et màj de l'URL
    if (req.file) {
      const resizedFileName = `resized-${req.file.filename.replace(/\.[^.]+$/, '')}.webp`; //supp du nom et changement de l'extension
      const resizedImagePath = `./images/${resizedFileName}`;

      sharp.cache(false);  //Suppr image avant redimensionnement
      sharp(req.file.path)
        .resize({ fit: 'contain' })
        .toFormat('webp')
        .toFile(resizedImagePath, (err, info) => {
          if (err) {
            return res.status(401).json({ error: err.message });
          }

          // Suppr de l'image originale téléchargée
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Erreur lors de la suppr de l image originale(avant redimenssionnement):', unlinkErr);
            }
          });
        });

        // Màj de l'URL de l'image 
        bookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${resizedFileName}`;
    }

    // Màj des informations du livre
    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Livre modifié.' }))
      .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(400).json({ error })
    )
  };
  

  

//SUPPRESSION D'UN LIVRE
exports.deleteBook = (req, res, next) => {

  //Vérification Id
  Book.findOne({_id: req.params.id})                      
    .then(book => {
      if(book.userId!= req.auth.userId) {
        res.status(401).json({message: 'Non-autorisé'});
      } else {

        //Suppression image puis livre
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (error) => {
          if (error) {
            return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
          }
          Book.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Livre supprimé.'}))
          .catch(error => res.status(401).json ({ error }));
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
};
