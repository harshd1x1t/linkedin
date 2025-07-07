const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profile');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(cors());

// ✅ Fix for charset=UTF-8 issue
app.use((req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.includes('charset=UTF-8')) {
    req.headers['content-type'] = contentType.replace('charset=UTF-8', 'charset=utf-8');
  }
  next();
});

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('LinkedIn Profile API is running');
});

// Export the app for testing
module.exports = app;

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}
