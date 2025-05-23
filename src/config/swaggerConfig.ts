import swaggerJSDoc from 'swagger-jsdoc';
import { docs } from '../docs/index'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User-register',
      version: '1.0.0',
      description: 'User-register-auth',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/auth/login': docs.loginDoc,
      '/auth/refresh': docs.refreshDoc,
      '/auth/logout': docs.logoutDoc,
      '/modules': docs.moduleDoc,
      '/users/getUserFilterableDatas': docs.userColumnGetDoc,
      '/users/changeStatus/{uuid}': docs.userChangeStatusDoc,
      '/users': { ...docs.userGetDoc, ...docs.userPostDoc },
      '/users/{uuid}': docs.userPutDoc
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ["**/*.ts"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;