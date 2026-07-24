const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LICH3D API',
      version: '1.0.0',
      description: 'API for managing LICH3D products and orders'
    },
    servers: [
      {
        url: 'https://lich3d-api.onrender.com',
        description: 'Render server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);