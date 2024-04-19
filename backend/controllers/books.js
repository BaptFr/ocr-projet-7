const Book = require('../models/Book');
const fs = require('fs');


//TOUS LES LIVRES 
exports.getAllBooks = (req, res, next) => {
  Book.find()
  .then(
    (books) => { 
      res.status(200).json(books); 
    })
  .catch(
    (error) => {
      res.status(400).json({ error: error });
    });
};

/*LES LIVRES LES MIEUX NOTÉS
exports.bestRatingBooks = (req, res, next) => {
  Book.find()
  });
}; */


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
      const totalGrade = book.ratings.reduce((acc, curr) => acc + curr.grade, 0); //Méthode reduce. Itération calcul de la somme totale de notations
      const newAverageRating = totalRatings > 0 ? totalGrade / totalRatings : 0; //Calcul de la moyenne
      console.log(newAverageRating);

      //Mise à jour de la moyenne de notation et sauvegarde du livre dans la bdd
      book.averageRating = newAverageRating;
      return book.save(); 
    })

    .then(() => {
      res.satuts(200).json({message:'Notation ajoutée.'});
    })

    .catch( (error) => { res.status(400).json ({error})
    });
};



// CRÉATION D'UN LIVRE
exports.createBook = (req, res, next) => {

  //Récupération de l'userId de l'utilisateur créant le livre
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
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
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body };

  delete bookObject._userId;

  Book.findOne({_id: req.params.id})
  .then ((book) => {
    if(book.userId !=req.auth.userId) {
      res.status(401).json({message : 'Non-autorisé'});
    }else{
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
  Book.findOne({_id: req.params.id})
    .then(book => {
      if(book.userId!= req.auth.userId) {
        res.status(401).json({message: 'Non-autorisé'});
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Livre supprimé.'}))
          .catch(error => res.status(401).json ({ error }));
        });
      }
    })
};
