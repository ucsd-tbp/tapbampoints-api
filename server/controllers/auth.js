/**
 * @file Contains endpoints that authenticate via JWT and related
 * authentication middleware.
 */

const debug = require('debug')('tbp:auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Creates registered claims to sign the JWT with and places the user's admin
 * status in the payload. Used to return a JWT in the response when registering
 * or logging in a user.
 *
 * @private
 * @param  {User} user User to create token for.
 * @return {Promise<String>} Resolves to newly created token. Returns a Promise
 * to chain calls in controllers, e.g. `.then(makeJWT).then(token => ...)`.
 * @see {@link https://tools.ietf.org/html/rfc7519#section-4.1 the JWT spec
 * concerning claims.}
 */
function makeJWT(user) {
  // TODO Generate additional registered claims, as per the JWT spec.
  const options = {
    expiresIn: '2 days',
    subject: user.id.toString(),
  };

  return new Promise((resolve, reject) => {
    jwt.sign({ email: user.get('email') }, process.env.JWT_SECRET, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

// TODO Add JWT refresh middleware and JWT blacklisting.
const auth = {
  /**
   * Middleware that checks the Authorization header for a token, and attempts
   * to decode the token if it's there. Rejects the request if the token is
   * not present or invalid. Places the authenticated user in `req.user`.
   *
   * To make authenticated requests, the header must be formatted like:
   * Authorization: Bearer {token}
   *
   * @param  {Request} req HTTP request object.
   * @param  {Response} res HTTP response object.
   * @param  {Function} next Callback that passes control to the next handler.
   */
  verify(req, res, next) {
    debug('firing token verification middleware');

    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: 'Authorization header not present.' });

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer') {
      return res.status(400).json({
        error: 'Incorrect authentication scheme. Required format: "Authorization: Bearer {token}".',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (jwtErr, decoded) => {
      if (jwtErr) return res.status(400).json({ error: jwtErr.message });

      User.where('id', decoded.sub)
        .fetch({ withRelated: ['attended_events'], require: true })
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => res.status(400).json({ error: err.message }));
    });
  },

  /**
   * Registers a user by creating a new user and generating new token to place
   * in the response body.
   *
   * @param  {Request} req Contains valid fields to save a User with.
   * @param  {Response} res Contains newly generated token.
   */
  register(req, res) {
    new User().save(req.body)
      .then(makeJWT)
      .then(token => res.status(201).json({ token }))
      .catch(User.NoRowsUpdatedError, () => res.status(400).json({ error: 'User was not saved!' }))
      .catch(err => res.status(400).json({ error: err.message }));
  },

  /**
   * Creates a JWT from the user after validating the user credentials passed
   * in the request. Users can login via their barcode hash only if the email
   * and password have not been set.
   *
   * @param  {Request} req Must contain an email and password combination if
   * the user has registered an email or password. Otherwise, the user can
   * login with just the barcode.
   * @param {string} req.body.email Email to search for the user with.
   * @param {string} req.body.password Password to authenticate email against.
   * @param {string} req.body.barcode If user has not registered an email and
   * password yet, then just the barcode can be used to log in.
   * @param  {Response} res HTTP response containing the generated token
   *
   * @see `User.login(credentials)`
   */
  login(req, res) {
    const credentials = {
      key: req.body.barcode ? 'barcode' : 'email',
      search: req.body.barcode ? req.body.barcode : req.body.email,
      pass: req.body.barcode ? undefined : req.body.password,
    };

    new User().login(credentials)
      .then(makeJWT)
      .then(token => res.json({ token }))
      .catch(User.NotFoundError, () =>
        res.status(404).json({
          error: `An account with that ${credentials.key} has not been registered.`,
        }))
      .catch(err => res.status(401).json({ error: err.message }));
  },

  /**
   * Returns the logged in user. At this point the JWT validation middleware
   * had finished verifying the token, so the current user has already been set
   * in `req.user`.
   *
   * @param  {Request} req Contains a valid JWT in the Authorization header.
   * @param  {Response} res Contains user found from verified JWT.
   * @see {@link auth.verify}
   */
  currentUser(req, res) {
    res.json(req.user.toJSON());
  },
};

module.exports = auth;
