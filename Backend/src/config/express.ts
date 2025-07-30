import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '../utils/error-handler';

const configureExpress = () => {
  const app = express();
  
  // Security middleware
  app.use(helmet());
  app.use(cors());
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Global error handler
  app.use(errorHandler);
  
  return app;
};

export default configureExpress;