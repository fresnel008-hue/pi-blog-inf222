const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');

// ─── Schémas Swagger ──────────────────────────────────────────────────────

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - titre
 *         - contenu
 *         - auteur
 *         - categorie
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant unique généré automatiquement
 *           example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *         titre:
 *           type: string
 *           description: Titre de l'article
 *           example: "Introduction à Express.js"
 *         contenu:
 *           type: string
 *           description: Contenu complet de l'article
 *           example: "Express.js est un framework minimaliste pour Node.js..."
 *         auteur:
 *           type: string
 *           description: Nom de l'auteur
 *           example: "Ahmed Benali"
 *         categorie:
 *           type: string
 *           description: Catégorie de l'article
 *           example: "Backend"
 *         date:
 *           type: string
 *           format: date
 *           description: Date de publication (YYYY-MM-DD)
 *           example: "2026-03-23"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Liste de tags
 *           example: ["nodejs", "express"]
 *     ArticleInput:
 *       type: object
 *       required:
 *         - titre
 *         - contenu
 *         - auteur
 *         - categorie
 *       properties:
 *         titre:
 *           type: string
 *           example: "Introduction à Express.js"
 *         contenu:
 *           type: string
 *           example: "Express.js est un framework minimaliste pour Node.js..."
 *         auteur:
 *           type: string
 *           example: "Ahmed Benali"
 *         categorie:
 *           type: string
 *           example: "Backend"
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-03-23"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["nodejs", "express"]
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Article non trouvé"
 */

// ─── GET /api/articles/search ─────────────────────────────────────────────

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Rechercher des articles
 *     description: Recherche full-text dans le titre et le contenu des articles. Supporte aussi le filtrage par catégorie, auteur et date.
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Mot-clé à rechercher dans le titre et le contenu
 *         example: "nodejs"
 *       - in: query
 *         name: categorie
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *         example: "Backend"
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur
 *         example: "Ahmed"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date exacte (YYYY-MM-DD)
 *         example: "2026-01-15"
 *     responses:
 *       200:
 *         description: Liste des articles correspondant aux critères
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 */
router.get('/search', (req, res) => {
  const { q, categorie, auteur, date } = req.query;
  let resultats = [...db.articles];

  // Recherche full-text dans titre et contenu
  if (q) {
    const motCle = q.toLowerCase();
    resultats = resultats.filter(
      (a) =>
        a.titre.toLowerCase().includes(motCle) ||
        a.contenu.toLowerCase().includes(motCle) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(motCle)))
    );
  }

  // Filtre par catégorie
  if (categorie) {
    resultats = resultats.filter(
      (a) => a.categorie.toLowerCase() === categorie.toLowerCase()
    );
  }

  // Filtre par auteur
  if (auteur) {
    resultats = resultats.filter((a) =>
      a.auteur.toLowerCase().includes(auteur.toLowerCase())
    );
  }

  // Filtre par date
  if (date) {
    resultats = resultats.filter((a) => a.date === date);
  }

  res.json({ total: resultats.length, articles: resultats });
});

// ─── GET /api/articles ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Récupérer tous les articles
 *     description: Retourne la liste complète de tous les articles du blog.
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Liste de tous les articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 */
router.get('/', (req, res) => {
  res.json({ total: db.articles.length, articles: db.articles });
});

// ─── POST /api/articles ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Créer un nouvel article
 *     description: Crée un nouvel article dans le blog. L'ID et la date sont générés automatiquement si non fournis.
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       201:
 *         description: Article créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article créé avec succès"
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Données manquantes ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res) => {
  const { titre, contenu, auteur, categorie, date, tags } = req.body;

  // Validation des champs obligatoires
  if (!titre || !contenu || !auteur || !categorie) {
    return res.status(400).json({
      message: 'Les champs titre, contenu, auteur et categorie sont obligatoires',
    });
  }

  const nouvelArticle = {
    id: uuidv4(),
    titre,
    contenu,
    auteur,
    categorie,
    date: date || new Date().toISOString().split('T')[0],
    tags: tags || [],
  };

  db.articles.push(nouvelArticle);

  res.status(201).json({
    message: 'Article créé avec succès',
    article: nouvelArticle,
  });
});

// ─── GET /api/articles/:id ────────────────────────────────────────────────

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Récupérer un article par son ID
 *     description: Retourne les détails complets d'un article spécifique.
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant unique de l'article
 *         example: "1"
 *     responses:
 *       200:
 *         description: Article trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => {
  const article = db.articles.find((a) => a.id === req.params.id);
  if (!article) {
    return res.status(404).json({ message: 'Article non trouvé' });
  }
  res.json(article);
});

// ─── PUT /api/articles/:id ────────────────────────────────────────────────

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Modifier un article
 *     description: Met à jour les informations d'un article existant. Seuls les champs fournis seront modifiés.
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant unique de l'article à modifier
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArticleInput'
 *     responses:
 *       200:
 *         description: Article modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article modifié avec succès"
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', (req, res) => {
  const index = db.articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Article non trouvé' });
  }

  const { titre, contenu, auteur, categorie, date, tags } = req.body;

  // Mise à jour partielle (seuls les champs fournis sont mis à jour)
  const articleMisAJour = {
    ...db.articles[index],
    ...(titre && { titre }),
    ...(contenu && { contenu }),
    ...(auteur && { auteur }),
    ...(categorie && { categorie }),
    ...(date && { date }),
    ...(tags && { tags }),
  };

  db.articles[index] = articleMisAJour;

  res.json({
    message: 'Article modifié avec succès',
    article: articleMisAJour,
  });
});

// ─── DELETE /api/articles/:id ─────────────────────────────────────────────

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Supprimer un article
 *     description: Supprime définitivement un article du blog.
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant unique de l'article à supprimer
 *         example: "1"
 *     responses:
 *       200:
 *         description: Article supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Article supprimé avec succès"
 *       404:
 *         description: Article non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req, res) => {
  const index = db.articles.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Article non trouvé' });
  }

  db.articles.splice(index, 1);

  res.json({ message: 'Article supprimé avec succès' });
});

module.exports = router;
