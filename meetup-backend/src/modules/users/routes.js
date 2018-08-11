import { Router } from 'express';
import { loginAuth } from '../../utils/requireJwtAuth';

import * as UserController from './controller';

const routes = new Router();

routes.post('/users/auth0', UserController.loginWithAuth0);
routes.post('/users/login', UserController.login);
routes.post('/users/signup', UserController.signup);

export default routes;
