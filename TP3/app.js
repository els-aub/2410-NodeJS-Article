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
mongoose.connect('mongodb://localhost:27017/db_article');
// --------------------------------------------------------------

// Créer un routeur
const router = express.Router();


// --------------------------------------------------------------
// * Créer un model/entité
// --------------------------------------------------------------
const Article = mongoose.model('Article', { uuid: String, title: String, content: String, author: String }, 'articles');
// --------------------------------------------------------------

// --------------------------------------------------------------
// ROUTES
// --------------------------------------------------------------

app.get('/articles', async (req, res) => {
    const articles = await Article.find();
        
    return res.json({ code : "200", message : "La liste des articles a été récupérés avec succès", data : articles});
});

app.get('/article/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    const article = await Article.findOne({ uuid : uuid});
       
    //CAS : err on trouve pas d'art (si il est null)
    if (!article) {
        return res.json({ code : "200", message : "Article récupéré avec succès", data : article});
    }  

    return res.json(article);
});


app.post('/save-article', async (req, res) => {
  
   const articleJSON = req.body;

   if (articleJSON.uuid){
 
    const uuid = articleJSON.uuid;

    const article = await Article.findOne({uuid : uuid});

    if (article){
     article.content = articleJSON.content;
     article.title = articleJSON.title;
     article.author = articleJSON.author;

     await article.save();
     
     return res.json({message:'Article modifié avec succès !'});    
    }
   }

   // PAR DEFAUT => CREATION
   // Generer un uuid
    const { v4: uuidv4 } = require('uuid');
    // ecraser ou creer le champ uuid dans le json qu'on a récup av de l'insérer en bdd
    articleJSON.uuid = uuidv4();

   //sauvegarder en bdd l'article avec le json en question
   await Article.create(articleJSON);
 
   return res.json({message:'Article ajouté avec succès !'});  


});

app.delete('/article/:uuid', async (req, res) => {
    // si pas d'id envoyé 
    if (!req.params.uuid) {
        return res.json({message: `ID de l'article manquant`});
    
    }

    //recuperer le param nomme id dans l'url 
    const uuid = req.params.uuid;

    //Pour supp on va supp grâce à l'index 
    // donc trouver l'index avec un findIndex predicate id == id 
    // Retrouver l'index tableau 
const article = await Article.findOne({uuid : uuid});

// CAS : article pas trouvé 
if (!article){
    return res.json({message:`Aucun article ayant l'uuid ${uuid}`});
}
     
// Supprimer élément
await Article.findOneAndDelete({uuid : uuid});

return res.json({message:`Article supprimé avec succès : ${uuid}`});    
});




 // Règle de gestion
    // RG-001 : Récupérer les articles
    // 200 | La liste des articles a été récupérés avec succès | Les articles en JSON
   
    if (req.method === 'GET' && req.url === '/articles') {
        return res.json({ code : "200", message : "La liste des articles a été récupérés avec succès", data : articles});   
    };

    // RG-002 : Récupérer un article
    // Si l'uid existe et l'article récupéré avec succès
    //200 | Article récupéré avec succès | L'article JSON

    if (req.method === 'GET' && req.url.startsWith('/article/')) {
        const uuid = req.url.split('/')[2];
        const article = articles.find(value => value.uuid === uuid);

        if (article) {
            return res.json({ code : "200", message : "Article récupéré avec succès", data : article});   
        }
    };

    /*// Si l'uid n'existe pas
    // 702 | Impossible de récupérer un article avec l'UID $uid | Null

    return res.json({ code : "702", message : `Impossible de récupérer un article avec l'UID ${uuid}`, data : null});

    // RG-003 : Ajouter un article
    // Si ajouté avec succès
    // 200 | Article ajouté avec succès | L'article JSON

    if (req.method === 'POST' && req.url === '/save-article') {
        return res.json({ code : "200", message : "Article ajouté avec succès", data : article});   
    };

    // Si le titre existe déjà en base
    // 701 | Impossible d'ajouter un article avec un titre déjà existant | Null

    return res.json({ code : "701", message : "Impossible d'ajouter un article avec un titre déjà existant", data : null});

    // Si contrôle de surface invalide
    // 710 | Contrôle de surface non valide | La liste des erreurs en JSON

    return res.json({ code : "710", message : "Contrôle de surface non valide", data : errors});

    // RG-004 : Modifier un article
    // Si modifié avec succès
    // 200 | Article modifié avec succès | L'article JSON

    if (req.method === 'PUT' && req.url.startsWith('/save-article')) {
        return res.json({ code : "200", message : "Article modifié avec succès", data : article});   
    };
    
    // Si le titre existe deja en base
    // 701 | Impossible de modifier un article si un autre article possède un titre similaire | Null

    return res.json({ code : "701", message : "Impossible de modifier un article si un autre article possède un titre similaire", data : null});

    // Si contrôle de surface invalide
    // 710 | Contrôle de surface non valide | La liste des erreurs en JSON

    return res.json({ code : "710", message : "Contrôle de surface non valide", data : errors});

    // RG-005 : Supprimer un article
    // Si supprimé avec succès
    // 200 | L'article $uid a été supprimé avec succès | L'article supprimé JSON

    if (req.method === 'DELETE' && req.url.startsWith('/article/')) {
        return res.json({ code : "200", message : `L'article ${uuid} a été supprimé avec succès", data : article`});
    }

    // Si l'uid n'existe pas
    // 702 | Impossible de supprimer un article dont l'UID n'existe pas | Null

    return res.json({ code : "702", message : "Impossible de supprimer un article dont l'uuid n'existe pas", data : null});

*/





// Lancer le serveur        
app.listen(3000);   


