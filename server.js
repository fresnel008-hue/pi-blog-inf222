const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const articleRoutes = require('./routes/articles');

const app = express();
const PORT = 4000;

// Middleware pour parser le JSON
app.use(express.json());

// ─── Configuration Swagger ─────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Blog — INF222 TAF1',
      version: '1.0.0',
      description:
        'API REST pour gérer un blog simple.\n' +
        'Développée dans le cadre du cours INF222 EC1 (Développement Backend).\n\n' +
        '## Fonctionnalités\n' +
        '- CRUD complet sur les articles\n' +
        '- Filtrage par catégorie, auteur, date\n' +
        '- Recherche full-text',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement local',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/articles', articleRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur API Blog INF222 TAF1',
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

// ─── Démarrage ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Swagger UI disponible sur http://localhost:${PORT}/api-docs`);
});
