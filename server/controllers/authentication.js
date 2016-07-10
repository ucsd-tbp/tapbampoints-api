/**
 * @file Contains endpoints that authenticate via JWT and related
 * authentication middleware.
 */

const debug = require('debug')('tbp:auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// TODO Add a function for generating registered claims, as per the JWT spec.
const options = {
  expiresIn: '2 days',
};

// TODO Add JWT refresh middleware and JWT blacklisting.
const auth = {
  /**
   * Middleware that checks the Authorization header for a token, and attempts
   * to decode the token if it's there. Rejects the request if the token is
   * not present or invalid. Decoded token contains the ID of the authenticated
   * user, who is placed in req.user.
   *
   * To make authenticated requests, the header must be formatted like:
   * Authorization: Bearer {token}
   *
   * @param  {Request} req HTTP request
   * @param  {Response} res HTTP response
   * @param  {Function} next callback that passes control to the next handler
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

      User.where('id', decoded.id)
        .fetch({ withRelated: ['events'], require: true })
        .then(user => {
          req.user = user;
          next();
        })
        .catch((err) => res.status(400).json({ error: err.message }));
    });
  },

  /**
   * Registers a user by creating a new user and generating a new token
   * using the newly created user as the payload for signing the JWT. password
   * from request body is also encrypted via bcrypt before saving the user.
   *
   * @param  {Request} HTTP request, must contain required data for creating a
   *                  new user
   * @param  {Response} res HTTP response containing newly generated token
   */
  register(req, res) {
    new User().save(req.body)
      .then(user => {
        jwt.sign({ id: user.id }, process.env.JWT_SECRET, options, (err, token) => {
          if (err) return res.status(400).json({ error: err.message });

          debug(`successfully registered user with id ${user.id}`);

          res.status(201).json({ token });
        });
      })
      .catch(User.NoRowsUpdatedError, () => res.status(400).json({ error: 'User was not saved!' }))
      .catch((err) => res.status(400).json({ error: err.message }));
  },

  /**
   * Creates a JWT from the user after validating the user credentials passed
   * in the request. Users can login via their barcode hash only if the email
   * and password have not been set.
   *
   * @param  {Request} req HTTP request, must contain either a barcode hash or
   *                   an email and password pair
   * @param  {Response} res HTTP response containing the generated token
   */
  login(req, res) {
    // TODO Add validation for email/password vs. barcode hash bodies.
    const search = { email: req.body.email };
    const pass = req.body.password;

    new User().login(search, pass)
      .then(id => {
        debug(`signing JWT with id ${id}`);
        jwt.sign({ id }, process.env.JWT_SECRET, options, (err, token) => {
          if (err) return res.status(400).json({ error: err.message });
          res.json({ token });
        });
      })
      .catch((err) => res.status(401).json({ error: err.message }));
  },

  /**
   * Returns the logged in user. By this point the JWT validation middleware
   * had finished verifying the token, so the current user has already been set
   * in req.user.
   *
   * @param  {Request} req HTTP request, contains a valid JWT
   * @param  {Response} res HTTP response, contains user from decoded JWT
   * @see {@link auth.verify}
   */
  currentUser(req, res) {
    res.json(req.user.toJSON());
  },
};

module.exports = auth;
