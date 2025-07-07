const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LinkedIn Profile API',
      version: '1.0.0',
      description: 'API to save and fetch LinkedIn-like user profiles',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    tags: [
      {
        name: 'Profile',
        description: 'LinkedIn profile operations',
      },
    ],
    components: {
      schemas: {
        Profile: {
          type: 'object',
          required: ['name', 'experience'],
          properties: {
            name: {
              type: 'string',
              example: 'Jane Doe'
            },
            openToWork: {
              type: 'boolean',
              example: true
            },
            experience: {
              type: 'array',
              items: { type: 'string' },
              example: ['Software Engineer at XYZ', 'Intern at ABC']
            },
            education: {
              type: 'array',
              items: { type: 'string' },
              example: ['B.Sc. in Computer Science – Stanford University']
            },
            skills: {
              type: 'array',
              items: { type: 'string' },
              example: ['JavaScript', 'React', 'Node.js']
            },
            contact: {
              type: 'object',
              properties: {
                email: {
                  type: 'array',
                  items: { type: 'string', format: 'email' },
                  example: ['jane.doe@example.com']
                },
                phone: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['+1 234 567 890']
                },
                linkedin: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://linkedin.com/in/janedoe']
                },
                website: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['https://janedoe.dev']
                },
                birthday: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['1990-01-01']
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Swagger will scan this for endpoint definitions
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
