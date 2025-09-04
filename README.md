# 📖 Mon Vieux Grimoire

**Mon Vieux Grimoire** est un site de notation de livres réalisé dans le cadre de ma formation.  
Le projet comprend la conception d’une **API REST** ainsi que la modélisation de la base de données du site.  
Le design du site a également été légèrement mis à jour.

</br>

<h2 align="center"> <a href="https://mon-vieux-grimoire-xggk.onrender.com"> 👉 Accéder au site </a>  </h2> </br>
ℹ️ Le site peut mettre quelques secondes à charger au premier accès, car Render met l’application en veille lorsqu’elle n’est pas consultée. Cela permet d’économiser des ressources et de réduire la consommation d’énergie.

---

## 🚀 Stack technique
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

