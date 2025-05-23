import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig'; 
import routes from './routes';
import cors from 'cors';


const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

export default app;