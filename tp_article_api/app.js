// Importer le module express
const express = require('express');

// Instancier le serveur express
const app = express();

// Activer la permission d'envoyer des données dans le body des requêtes
// Débloque le payload
app.use(express.json());

// Créer un routeur
const router = express.Router();

// Simulation de données en mémoire
let articles = [
    { id: 1, title: 'Premier article', content: 'Contenu du premier article', author: 'Isaac' },
    { id: 2, title: 'Deuxième article', content: 'Contenu du deuxième article', author: 'Sanchez' },
    { id: 3, title: 'Troisième article', content: 'Contenu du troisième article', author: 'Toto' }
];

// --------------------------------------------------------------
// ROUTES
// --------------------------------------------------------------

app.get('/articles', (req, res) => {
    // un json entier dans un string : pour l'avoir en json pur/objet, il faut parse
    const articlesJSON = JSON.parse(`{ "pseudo" : "Isaac" }`);	
    console.log(`articlesJSON : ${articlesJSON}`);    // Afficher le contenu de l'objet JSON dans la console (console.log) -> console.log(articlesJSON);
    
    //un objet JS : pour l'avoir en json pur/objet, il faut stringify
    const articlesJSONString = JSON.stringify(articles);
    console.log(`articlesJSONString : ${articlesJSONString}`);
    
    // A faire : on envoie des objets JS (pas du json déjà transformé: ex Stringify)
    return res.json(articles);
});

app.get('/article/:id', (req, res) => {
    // récupérer le param nommé id dans l'url
    //PS : ne pas oublier de convertir en entier avec parseInt car l'id est en string, car JS le considère comme un string !!!!!
    const id = parseInt(req.params.id);

    // A ne pas faire !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! version natif sans predicate c'est à dire sans condition 
  /*  let articleFound = undefined;
    // chercher un article selon un critere donc l'id
    // for (const articleIndex of articles)  il faut utiliser la boucle for of pour parcourir un tableau et articleIndex plutôt que article car il s'agit de l'index
    for (const articleIndex in articles) {
        const article = articles[articleIndex];
        console.log(article);
        //si l'occurence iteration a le bon id alors j'ai trouvé le bon article 
        if (article.id === id) {
            //je stocke l'art trouvé
            articleFound = article;
        }
    }
    //CAS : err on trouve pas d'art
    if (!articleFound) {
        return response.json({message: `Aucun article ayant l'id ${id}`});
    }  

    return response.json(articleFound);
});
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
*/

    // A FAIRE  : version avec PREDICATE (en java on appelle les stream)
    // la différence c'est que la condition est dans le predicate et non directement dans la boucle
    const article = articles.find(value => value.id === id);
       
    //CAS : err on trouve pas d'art (si il est null)
    if (!article) {
        return res.json({message: `Aucun article trouvé ayant l'id ${id}`});
    }  

    return res.json(article);
});



// Créer une route POUR partie 1 du TP 1
/* router.get('/articles', (req, res) => {
    res.send('Retournera la liste des articles');
}); 

router.get('/article/:id', (req, res) => {
    res.send(`retournera l'article ayant l'id ${req.params.id}`);
}); 



router.post('/save-article', (req, res) => {
    res.send('Va créer/mettre à jour un article envoyé');
}); 

router.delete('/article/:id', (req, res) => {
    res.send(`Supprimer un article par l'id ${req.params.id}`);
}); 
*/

app.post('/save-article', (req, res) => {
   // Récupérer l'article envoyé en JSON
   //Exemple ! { id: 2, .....}
   const articleJSON = req.body;

   // Comment savoir si c'est un ajout ou une édition ? 
   // si on a un id dans l'art et que en plus l'art existe déjà dans le tableau
   // ALORS EDITION 
   // Si ID existe dans le JSON
   if (articleJSON.id){

    //Forcer l'id en entier 
    const id = parseInt(articleJSON.id);

    // Si art existe dans le tableau
    // Imaginons JSON = { id : 2; ...} ON VA VOIR SI LE tableau a un art avec le même id
    const article = articles.find(value => value.id === id);

    // Si article trouvé avec le meme id : MODIFICATION
    if (article){
        //retrouver l'index tableau
        const articleIndexToEdit = articles.findIndex(value => value.id === id);

        //Remplacer un element du tableau grace à un index
        articles[articleIndexToEdit] = articleJSON;

        // retrouver l'index du tableau lié à l'id
         return res.json({message:'Article modifié avec succès !'});    
    }
   }

   // PAR DEFAUT => CREATION
   articles.push(articleJSON);
   return res.json({message:'OArticle ajouté avec succès !'});  


});

app.delete('/article/:id', (req, res) => {
    // si pas d'id envoyé 
    if (!req.params.id) {
        return res.json({message: `ID de l'article manquant`});
    
    }

    //recuperer le param nomme id dans l'url 
    const id = parseInt(req.params.id);

    //Pour supp on va supp grâce à l'index 
    // donc trouver l'index avec un findIndex predicate id == id 
    // Retrouver l'index tableau 
const articleIndexToDelete = articles.findIndex(value => value.id === id);

// CAS : article pas trouvé 
if (articleIndexToDelete === -1) {
    return res.json({message:`Aucun article ayant l'id ${id}`});
}   

// Supprimer un element du tableau grace à un index
articles.splice(articleIndexToDelete, 1);

return res.json({message:`Article supprimé avec succès : ${id}`});    
});

// Ajouter la route au routeur  
app.use(router);    

// Lancer le serveur        
app.listen(3000);   


/* 

GET -> /articles
GET -> /article/:id
POST -> /save-article
DELETE -> /article/:id

*/