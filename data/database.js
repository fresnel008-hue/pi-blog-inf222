// Base de données en mémoire (tableau d'articles)
// En production, on utiliserait une vraie DB (MongoDB, MySQL, etc.)

let articles = [
  {
    id: '1',
    titre: 'Introduction à Node.js',
    contenu: 'Node.js est un environnement d\'exécution JavaScript côté serveur basé sur le moteur V8 de Chrome.',
    auteur: 'Ahmed Benali',
    categorie: 'Backend',
    date: '2026-01-15',
    tags: ['nodejs', 'javascript', 'backend'],
  },
  {
    id: '2',
    titre: 'Les bases de REST API',
    contenu: 'Une API REST (Representational State Transfer) est une interface qui utilise les méthodes HTTP pour effectuer des opérations CRUD.',
    auteur: 'Fatima Zahra',
    categorie: 'Architecture',
    date: '2026-02-10',
    tags: ['rest', 'api', 'http'],
  },
  {
    id: '3',
    titre: 'Swagger et documentation d\'API',
    contenu: 'Swagger (OpenAPI) permet de documenter, visualiser et tester les APIs REST de manière interactive.',
    auteur: 'Youcef Hamidi',
    categorie: 'Outils',
    date: '2026-03-01',
    tags: ['swagger', 'openapi', 'documentation'],
  },
];

module.exports = { articles };
