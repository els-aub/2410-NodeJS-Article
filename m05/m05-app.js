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
const Person = mongoose.model('Person', { uuid: String, pseudo: String }, 'persons'); // dernier param = nom de la table ; 1er param on peut ignorer
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

// Pour nous un ID METIER = UUID
// Donc on doit creer nous memes les id dans le back
// Exemple SELECT BY ID
app.get('/person/:uuid', async (req, res) => {

    /*
    //importer la lib la version de la lib uuid
    const { v4: uuidv4 } = require('uuid');

    //Generer un id unique a nous
    const uuidTest = uuidv4();

    return res.json(uuidTest);
    */

    //recupere l'id metier dans l'url
    const uuid = req.params.uuid; 

    //Appel de requetes sur un model/entité
    // find = selectall
    const person = await Person.findOne({ uuid : uuid}); 

    return res.json(person);    

    
})

// INSERT
app.post('/create-person', async (req, res) => {
     //je recupere la person en JSON
     let personJSON = req.body;

     // importer la lib la version de la lib uuid
     const { v4: uuidv4 } = require('uuid');

     //GENERER notre propre id 
     personJSON.uuid = uuidv4();

     // Insert 
     await Person.create(personJSON);
     
     return res.json(`Personne ${personJSON.pseudo} créée avec succès!`);

});

// Route update
// TODO : controle de surface
app.post('/save-person', async (req, res) => {
    //1. recuperer l'objet en base 

    // -- je recupere la person en JSON
    let personJSON = req.body;

    let foundPerson = await Person.findOne({uuid : personJSON.uuid});

    // 2. Modifier dans le back
    foundPerson.pseudo = personJSON.pseudo;

    //3. La re sauvegarder en base
    await foundPerson.save();

    return res.json(`Personne ${personJSON.pseudo} modifiée avec succès!`);    
});      

// DELETE
app.delete('/delete-person', async (req, res) => {
    //1. recuperer l'UUID de l'url 
    const uuid = req.body.uuid;

    // TODO : controle de surface
    //2. Supprimer de la base
    await Person.findOneAndDelete({uuid : uuid});

    return res.json(`Personne supprimée avec succès!`);    
});

// Lancer le serveur        
app.listen(3000);   
