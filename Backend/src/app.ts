import configureExpress from './config/express';
import environment from './config/environment';
import { logger } from './utils/logger';

// Import routes
import schoolRoutes from './api/routes/schoolRoutes';
import campaignRoutes from './api/routes/campaigns.routes';
import authRoutes from './api/routes/auth.routes';
import updatesRoutes from './api/routes/updates.routes';
import uploadRoutes from './api/routes/upload.routes';

// Initialize express app
const app = configureExpress();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/updates', updatesRoutes);
app.use('/api/upload', uploadRoutes);

// Start server
app.listen(environment.port, () => {
  logger.info(`Server running in ${environment.nodeEnv} mode on port ${environment.port}`);
});

export default app;
