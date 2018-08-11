import passport from 'passport';

import '../modules/users/utils/passport';

export const requireJwtAuth = passport.authenticate('jwt', { session: false });
export const loginAuth = passport.authenticate('local-login', { session: false });
