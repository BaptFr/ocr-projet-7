
Le fichier ".env.example" sert d'exemple à modifier. 
Le fichier ".env" est indiqué dans gitignore par sécurité pour ne pas le dupliquer sur GitHub.


# TROIS ÉTAPES:

## 1 - RENOMMEZ LE FICHIER  ".en.example" EN ".env"

##  DEUX VARIABLES SONT NECESSAIRES DANS LE FICHIER ".env":
    JWT_SECRET=votre_clé_secrète
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>


## 2 - VARIABLE POUR LA CLÉ SECRETE JWT 
### Génerez une clé secrète pour remplacer "votre_clé_secrète" dans cette variable 
    JWT_SECRET=votre_clé_secrète

### POUR GENERER UNE CLE SECRETE :

### Utilisation de OpenSSL (pour générer une clé secrète de 256 bits en utilisant l'algorithme AES) :
    openssl rand -base64 32

### Ou utilisation de Node.js  
    const crypto = require('crypto');
    const secretKey = crypto.randomBytes(32).toString('base64');
    console.log(secretKey);

### Ou utilisation de Python :
    python -c "import secrets; print(secrets.token_urlsafe(32))"
    


## 3 - VARIABLE POUR L'URI DE CONNEXION À MONGODB :
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

    username: Remplacez ceci par le nom d'utilisateur de votre base de données MongoDB Atlas.
    password : Remplacez ceci par le mot de passe de votre base de données MongoDB Atlas.
    cluster : Remplacez ceci par le nom de votre cluster MongoDB Atlas.

    Lien complet disponible pour connect votre cluster dans votre base de données sur MongoDB

