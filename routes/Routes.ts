import { Express } from 'express';

import UserController from '../controllers/User.controller';
import AdministratorController from '../controllers/Administrator.controller';
import AuthController from '../controllers/Auth.controller';

const routes = (server: Express) => {
  server.use('/user', UserController);
  server.use('/administrator', AdministratorController);
  server.use('/auth', AuthController);
};

export default routes;
