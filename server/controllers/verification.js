const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const addDays = require('date-fns/add_days');
const format = require('date-fns/format');
const mailer = require('nodemailer');

const db = require('../database');
const constants = require('../modules/constants');

const verification = {
  /**
   * Creates a token that the user can use to verify their account, given the
   * ID of the user to be verified. Then, sends an email with a link that the
   * user can use to claim their account.
   */
  generateVerificationToken(req, res) {
    if (!req.body.pid) {
      return res.status(400).json({ message: 'PID of user to verify is required.' });
    }

    // The id is used for looking up the hashed verification token.
    const id = uuid();
    const token = uuid();

    // Checks that an unverified account has been made given the PID.
    const findUserQuery = 'SELECT email, valid from users where pid = ?';
    db.knex.raw(findUserQuery, [req.body.pid])
      .then((result) => {
        if (result[0].length <= 0) {
          return Promise.reject(new Error(`Couldn\'t find an account with PID ${req.body.pid}.`));
        }

        if (result[0][0].valid) {
          return Promise.reject(
            new Error(`Account with PID ${req.body.pid} has already been claimed.`)
          );
        }

        return result[0][0].email;
      })
      .then(email => Promise.all([email, bcrypt.hash(token, constants.SALT_ROUNDS)]))
      .then(([email, hash]) => {
        // TODO Extend CRUD methods in a Bookshelf base class – otherwise simple
        // CRUD queries via an ORM become too verbose.
        const createTokenQuery = `
          REPLACE INTO verification_tokens (id, token, pid, expiration) VALUES (?, ?, ?, ?);
        `;

        // Verification token expires a day from now.
        const expiration = format(addDays(new Date(), 1), constants.DATABASE_DATE_FORMAT);

        return Promise.all([
          email, db.knex.raw(createTokenQuery, [id, hash, req.body.pid, expiration]),
        ]);
      })
      .then(([email]) => {
        const transporter = mailer.createTransport(constants.EMAIL_TRANSPORT_CONFIG);
        const verificationLink = `${process.env.CLIENT_ADDRESS}/claim?id=${id}&token=${token}`;

        const EMAIL_TEMPLATE = `
          <h3>Thanks for coming!</h3>
          <p>
            You recently dropped by one of our events. To keep track of the points you received,
            you'll need to register an account with us using the verification link below.
          </p>
          <a href="${verificationLink}">Verify your Account</a>
        `;

        const mailOptions = {
          from: constants.EMAIL_SENDER,
          to: email,
          subject: 'UCSD Tau Beta Pi Account Verification',
          html: EMAIL_TEMPLATE,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) return res.status(400).json({ message: error });
          res.json({ message: `Sent verification email to ${email}.` });
        });
      })
      .catch(err => res.status(400).json({ message: err.message }));
  },

  verifyAccount() {

  },
};

module.exports = verification;
