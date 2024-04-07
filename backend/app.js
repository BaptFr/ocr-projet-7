const express = require ('express');

const app = express();

app.use((req, res, next ) => {
    console.log('Requete reçue');
    next();
});

app.use((raq, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next ) => {
    res.json({message: 'TEST requete POSTMAN'});
    next();
});

app.use((req, res, next) => {
    console.log('succès de la réponse');
});

module.exports = app;