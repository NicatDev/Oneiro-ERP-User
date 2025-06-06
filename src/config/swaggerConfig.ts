import swaggerJSDoc from 'swagger-jsdoc';
import { docs } from '../docs/index'

const isLocal = process.env.NODE_ENV === 'Local';
const serverUrl = isLocal
  ? 'http://localhost:3000/api'
  : 'http://135.181.198.134/api';

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
      '/modules': {...docs.moduleCreateDoc,...docs.moduleDoc},
      '/modules/{uuid}': docs.moduleSingleDoc,
      '/users/getUserFilterableDatas': docs.userColumnGetDoc,
      '/users/changeStatus/{uuid}': docs.userChangeStatusDoc,
      '/users': { ...docs.userGetDoc, ...docs.userPostDoc },
      '/users/{uuid}': docs.userPutDoc,
      '/users/getSingle/{uuid}': docs.userSingleGetDoc,
      '/users/getDropdownList': docs.userDropdownListDoc,
      '/users/resetPassword/{uuid}': docs.resetPasswordDoc
      
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  },
  apis: ["**/*.ts"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;