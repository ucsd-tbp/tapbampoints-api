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

const auth = {
  /**
   * Middleware that checks the Authorization header for a token, and attempts
   * to decode the token if it's there. Rejects the request if the token is
   * not present or invalid. The decoded user is placed in req.user for
   * following request handlers.
   *
   * To make authenticated requests, the header must be formatted:
   * Authorization: Bearer {token}
   *
   * @param  {Request} req HTTP request
   * @param  {Response} res HTTP response
   * @param  {Function} next callback that passes control to the next handler
   */
  validate(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(403).json({ error: 'Token not provided.' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Unable to authenticate token.' });

      req.user = decoded;
      debug(`decoded user with id ${req.user.id}`);
      next();
    });
  },

  /**
   * Registers a user by creating a new user and generating a new token
   * using the newly created user as the payload for signing the JWT.
   *
   * @param  {Request} HTTP request, must contain required data for creating a
   *                  new user
   * @param  {Response} res HTTP response containing the generated token in the
   *                        Authorization header and the newly created user in
   *                        the body
   */
  register(req, res) {
    new User().save(req.body)
      .then(user => {
        jwt.sign(user, process.env.JWT_SECRET, options, (err, token) => {
          if (err) return res.status(500).json({ error: err.message });

          res.setHeader('Authorization', `Bearer: ${token}`);
          debug(`successfully registered user with id ${user.id}`);
          res.status(201).json(user.toJSON());
        });
      })
      .catch(User.NoRowsUpdatedError, () => res.status(500).json({ error: 'User was not saved!' }));
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
    let searchFields = {};

    if (req.body.barcode_hash) {
      searchFields = { barcode_hash: req.body.barcode_hash };
    } else {
      searchFields = { email: req.body.email, password: req.body.password };
    }

    return searchFields;
  },

  /**
   * Parses token to retrieve the user associated with the token. At this
   * point, the JWT validation middleware has already been applied, so there's
   * no need to re-verify the token since it's guaranteed to be valid.
   *
   * @param  {Request} req HTTP request, contains a valid JWT
   * @param  {Response} res HTTP response, contains user from decoded JWT
   * @see {@link auth.validate}
   */
  currentUser(req, res) {

  },
};

module.exports = auth;
