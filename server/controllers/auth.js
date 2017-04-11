/**
 * @file Contains endpoints that authenticate via JWT and related
 * authentication middleware.
 */

const jwt = require('bluebird').promisifyAll(require('jsonwebtoken'));

const User = require('../models/User');
const { MalformedRequestError, NotVerifiedError, UnauthorizedError } = require('../modules/errors');

/**
 * Creates registered claims to sign the JWT with and places the user's admin
 * status in the payload. Used to return a JWT in the response when registering
 * or logging in a user.
 *
 * @private
 * @param  {User} user User to create token for.
 * @return {Promise<String>} Resolves to newly created token.
 * @see https://tools.ietf.org/html/rfc7519#section-4.1 (the JWT spec on claims)
 */
function makeJWT(user) {
  if (!user.get('valid')) throw new NotVerifiedError();

  // TODO Generate additional registered claims, as per the JWT spec.
  const options = {
    expiresIn: '2 days',
    subject: user.id.toString(),
  };

  // Encoded in returned token.
  const payload = {
    email: user.get('email'),
    role: user.related('role').name,
  };

  return Promise.all([user, jwt.sign(payload, process.env.JWT_SECRET, options)]);
}

// TODO Add JWT refresh middleware and JWT blacklisting.
const auth = {
  /**
   * Middleware that checks the Authorization header for a token, and attempts
   * to decode the token if it's there. Rejects the request if the token is
   * not present or invalid. Places the authenticated user in `req.user`.
   *
   * To make authenticated requests, the header must be formatted like:
   * `Authorization: Bearer {token}`
   *
   * @param  {Request} req HTTP request object.
   * @param  {Response} res HTTP response object.
   * @param  {Function} next Callback that passes control to the next handler.
   */
  verify(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedError('Authorization header not present.');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer') {
      throw new MalformedRequestError(
        'Invalid authentication scheme. Required format: "Authorization Bearer {token}".'
      );
    }

    // Decodes JWT token given in Authorization headers.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new MalformedRequestError('Token is invalid.');
    }

    // ACL checking middleware may follow after JWT authentication, which
    // requires knowing the user's member status.
    req.relations.push('role');

    new User().findBy('id', decoded.sub, { embed: req.relations })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(next);
  },

  /**
   * Registers a user by creating a new user and generating new token to place
   * in the response body.
   *
   * @param  {Request} req Contains valid fields to save a User with.
   * @param  {Response} res Contains newly generated token.
   */
  register(req, res, next) {
    new User().create(req.body)
      .then(makeJWT)
      .then(([user, token]) => {
        res.set(`Authorization': 'Bearer ${token}`);
        res.send(user.toJSON());
      })
      .catch(next);
  },

  /**
   * Creates a JWT from the user after validating the user credentials passed
   * in the request.
   *
   * @param  {Request} req Must contain an email and password combination.
   * @param  {Response} res HTTP response containing the generated token
   */
  login(req, res, next) {
    new User().login(req.body.email, req.body.password, req.relations)
      .then(makeJWT)
      .then(([user, token]) => {
        res.set('Authorization', `Bearer ${token}`);
        res.send(user.toJSON());
      })
      .catch(next);
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
