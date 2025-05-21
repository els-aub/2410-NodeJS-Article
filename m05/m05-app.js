// Importer le module express
const express = require('express');

// Instancier le serveur express
const app = express();

// Activer la permission d'envoyer des données dans le body des requêtes
// Débloque le payload
app.use(express.json());

// --------------------------------------------------------------
// * MongoDB
// --------------------------------------------------------------
// Importer le module mongoose
const mongoose = require('mongoose');

// Si connexion reussie 
mongoose.connection.once('open', () => {
    console.log('Connexion à la base de données OK');   
});

// Si erreur de connexion
mongoose.connection.on('error', (err) => {
    console.log('Connexion à la base de données KO');   
});

// Enclencher la connexion
mongoose.connect('mongodb://localhost:27017/demo_db');
// --------------------------------------------------------------
// ***************************************
// --------------------------------------------------------------


// --------------------------------------------------------------
// * Créer un model/entité
// --------------------------------------------------------------
const Person = mongoose.model('Person', { pseudo : String }, 'persons'); // dernier param = nom de la table ; 1er param on peut ignorer
// { pseudo : String } => quels sont les attributs censés exister dans la table ?
// 'persons' => quel est le nom de la table ?
// 'Person' => quel est le nom de la classe ? (mais on peut ignorer)
// --------------------------------------------------------------
// **************************************
// --------------------------------------------------------------


// --------------------------------------------------------------
// * Route exemple select all
// --------------------------------------------------------------
// NOTE : /!\ maintenant toutes les routes sont async car bdd asynchrone /!\
// Donc à chaque fois qu'on appelle une methode de mongodb dans une route, toujours 'await' c'est à dire 'attendre la fin de la tache'
// AWAIT A CHAQUE METHODE ASYNC
app.get('/persons', async (req, res) => {

    //Appel de requetes sur un model/entité
    // find = selectall
    const persons = await Person.find();
    
    return res.json(persons);
});
// --------------------------------------------------------------
// **************************************
// --------------------------------------------------------------   




// Lancer le serveur        
app.listen(3000);   
