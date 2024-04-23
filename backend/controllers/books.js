const Book = require('../models/Book');
const fs = require('fs');


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


//NOTER UN LIVRE                                                                   <<<<<<<<<<<<<<<<VERIF USERID >>>>>>>>>>>>>>
exports.rateOneBook = (req, res, next) => {
  Book.findOne({_id: req.params.id})
    //Si déjà noté par l'utilisaeur sa note apparait
    .then ((book) => {
      //Condition : Vérification du livre
      if(!book){
        return res.status(404).json({ message:'Livre non trouvé'});
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

// <<<<<<<<<<<< MISE A JOUR EFFECTUÉ MAIS UNDEFINED OK APRES RAFRAICHISSEMENT  >>>>>>>>>>>>>>>




// CRÉATION D'UN LIVRE
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    //Récupération de l'userId et infos du livre
    ...bookObject,
    userId : req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    averageRating: bookObject.ratings[0].grade 
  });
  //Ajout et sauvegarde du nouveau livre dans la base de données
  book.save()
    .then(() => { res.status(201).json({ message: 'Livre envoyé enregistré avec succès.'});
    })
    .catch(error  => {res.status(400).json({ error });
  })
};


//MODIFICATION D'UN LIVRE
exports.modifyBook =(req, res, next) => {
  //Si modification de l'image
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body };

  delete bookObject._userId;

  Book.findOne({_id: req.params.id})
  .then ((book) => {
    //Vérification de l'userId
    if(book.userId !=req.auth.userId) {
      res.status(401).json({message : 'Non-autorisé'});
    }else{
      //Modification des informations du livre
      Book.updateOne ({_id: req.params.id },  {...bookObject, _id: req.params.id })
      .then (() =>res.status(200).json({message: 'Livre modifié.'}))
      .catch(error => res.status(401).json({ error }));
    };
  })
  .catch((error) => { res.status(400).json ({error})}
  );
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
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Livre supprimé.'}))
          .catch(error => res.status(401).json ({ error }));
        });
      }
    })
};
