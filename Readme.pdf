# API Blog — INF222 TAF1

API REST pour gérer un blog simple.
Développée dans le cadre du cours INF222 EC1 (Développement Backend).

## Fonctionnalités
- CRUD complet sur les articles
- Filtrage par catégorie, auteur, date
- Recherche full-text (titre, contenu, tags)
- Documentation Swagger / OpenAPI 3.0

## Structure du projet
```
api-blog/
├── server.js          ← Point d'entrée principal + config Swagger
├── package.json
├── data/
│   └── db.js          ← Base de données en mémoire (tableau d'articles)
└── routes/
    └── articles.js    ← Toutes les routes + annotations Swagger
```

## Installation et démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le serveur
```bash
# Mode normal
npm start

# Mode développement (redémarrage automatique)
npm run dev
```

### 3. Ouvrir Swagger UI
Ouvrez votre navigateur et allez sur :
```
http://localhost:4000/api-docs
```

## Endpoints disponibles

| Méthode | Route                    | Description                    |
|---------|--------------------------|--------------------------------|
| GET     | /api/articles/search     | Rechercher des articles        |
| GET     | /api/articles            | Récupérer tous les articles    |
| POST    | /api/articles            | Créer un nouvel article        |
| GET     | /api/articles/{id}       | Récupérer un article par ID    |
| PUT     | /api/articles/{id}       | Modifier un article            |
| DELETE  | /api/articles/{id}       | Supprimer un article           |

## Exemple de corps pour POST/PUT

```json
{
  "titre": "Mon premier article",
  "contenu": "Voici le contenu de mon article...",
  "auteur": "Votre Nom",
  "categorie": "Backend",
  "date": "2026-03-23",
  "tags": ["nodejs", "express"]
}
```

## Test via Swagger

1. Allez sur http://localhost:4000/api-docs
2. Cliquez sur un endpoint (ex: GET /api/articles)
3. Cliquez sur **"Try it out"**
4. Cliquez sur **"Execute"**
5. Consultez la réponse en bas

## Données de test préchargées

3 articles sont déjà présents au démarrage :
- ID `1` : "Introduction à Node.js" (catégorie: Backend)
- ID `2` : "Les bases de REST API" (catégorie: Architecture)  
- ID `3` : "Swagger et documentation d'API" (catégorie: Outils)
