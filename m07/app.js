// Importer le module express
const express = require('express');

// Instancier le serveur express
const app = express();

// Activer la permission d'envoyer des données dans le body des requêtes
// Débloque le payload
app.use(express.json());

// ----------------------------------------------------------
// * MongoDB
// ----------------------------------------------------------
const mongoose = require('mongoose');

// Si connexion reussie
mongoose.connection.once('open', () => {
    console.log(`Connecté(e) à la base de données`);
});

// Si erreur bdd
mongoose.connection.on('error', (err) => {
    console.log(`Erreur de la base données`);
});

// Enclencher à la connexion
mongoose.connect('mongodb://127.0.0.1:27017/demo_db');

// ----------------------------------------------------------
// * Creer un model/entité
// ----------------------------------------------------------
// 1er param on peut ignorer
// Dernier param = nom de la table
const Person = mongoose.model('Person', { uuid: String, pseudo : String }, 'persons');



// POUR NOUS UN ID METIER = UUID
// DONC ON DOIT CREER NOUS MEME LES ID DANS LE BACK
// EXEMPLE SELECT BY ID
app.get('/person/:uuid', async (req, res) => {
   
    // DEUX CONTROLES A FAIRE
    // -----------------------------
    // CONTROLE DE SURFACE

    // CS 1 - est cec qu'on envoie bien un UID 
    if (!req.params.uuid) {
        return res.json({ code : "601", message : "UUID doit être renseigné"});
    }
    // CS 2 - L'IUD doit etre un string 
    if (typeof req.params.uuid !== 'string') {
        return res.json({ code : "601", message : "UUID doit etre un string"});
    }   

    // CS 3 - L UUID doit etre un string qui contient des numeros (regex)
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!regex.test(req.params.uuid)) {
        return res.json({ code : "601", message : "UUID doit etre un string qui contient des numeros"});    
    }
    // -----------------------------
    // CONTROLE METIER 

    // CM 1 - la personne existe en base ?

    // Récupére l'id métier dans l'url
    const uuid = req.params.uuid;

    // Appel de requetes mongoose pour recup personne en base
    const person = await Person.findOne({ uuid : uuid});

    if (!person) {
        return res.json({ code : "701", message : `Personne non trouvée`});
    }   

    return res.json({ code : "200", message : `Personne trouvée`, data : person});
})

// Lancer le serveur
app.listen(3000);