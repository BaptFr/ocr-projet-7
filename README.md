<h1 align="center"> 📖 Mon Vieux Grimoire </h1> 
</br>

<h5 align="center"> ⭐️ Mon Vieux Grimoire est une plateforme en ligne pour les passionnés de lecture qui permet aux utilisateurs de s’inscrire, de créer de nouveaux livres, de les consulter et de leur attribuer des notes. Les lecteurs peuvent également visualiser tous les ouvrages déjà ajoutés, ainsi que leurs notes moyennes. </h5>

</br>

<h2 align="center"> <a href="https://mon-vieux-grimoire-xggk.onrender.com"> 👉 Accéder au site 👈 </a>  </h2> 
 <p align="center"> 🌏 Le site peut mettre quelques secondes à charger au premier accès, car Render met l’application en veille lorsqu’elle n’est pas consultée. Cela permet d’économiser des ressources et de réduire la consommation d’énergie.  </p>

---
## ⚙️ Fonctionnalités
- **Authentification** : Inscription et connexion des utilisateurs.
- **Accueil** : Liste et visualisation des ouvrages ajoutés par la communauté.
- **Livres** : Consultation détaillée des livres (image, titre, auteur, année, genre, note moyenne).
- **Notation** : Système de notation des livres (de 0 à 5 étoiles).
- **Ajout & Modification** : Création, modification et suppression de livres par leur auteur.
- **Navigation claire** : Interface intuitive avec header et footer.

## 👨‍💻 Stack technique
- **Node.js** (backend)
- **Express.js** (framework HTTP)
- **MongoDB Atlas** (base de données NoSQL)
- **JWT** (authentification par token)
- **Déploiement** : Render
- **Front-End**: React
---

## 🔐 Authentification & Sécurité
- Authentification via **token JWT** (`Authorization: Bearer <token>`).
- Toutes les routes liées aux livres nécessitent une authentification.
- Vérification des droits :
- Seul le propriétaire d’un livre peut le modifier ou le supprimer.

