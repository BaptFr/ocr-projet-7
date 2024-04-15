const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/Book')


const bookRoutes = require('./routes/book');

mongoose.connect('mongodb+srv://baptistesalazar:OcrMongo@cluster0.vuo5qlp.mongodb.net/',

  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express();

app.use(express.json());
 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/books', bookRoutes);


module.exports = app;