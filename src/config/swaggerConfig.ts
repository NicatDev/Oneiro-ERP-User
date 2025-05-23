import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'User-register', 
      version: '1.0.0', 
      description: 'User-register-auth', 
    },
    servers: [
      {
        url: 'http://135.181.198.134/api',
      },
    ],
  },
apis: ["**/*.ts"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;