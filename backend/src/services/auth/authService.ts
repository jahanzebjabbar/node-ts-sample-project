import UserRepository from '../../database/repositories/userRepository';
import Error400 from '../../errors/Error400';
import bcrypt from 'bcrypt';
import EmailSender from '../../services/emailSender';
import jwt from 'jsonwebtoken';
import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import { getConfig } from '../../config';
import Roles from '../../security/roles';
import Error401 from '../../errors/Error401';
import moment from 'moment';

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Handles all the Auth operations of the user.
 */
class AuthService {
  /**
   * Signs up with the email and password and returns a JWT token.
   *
   * @param {*} email
   * @param {*} password
   * @param {*} [options]
   */
  static async signup(email, password, options: any = {}) {
    const transaction = await SequelizeRepository.createTransaction(
      options.database,
    );

    try {
      const existingUser = await UserRepository.findByEmail(
        email,
        options,
      );

      // Generates a hashed password to hide the original one.
      const hashedPassword = await bcrypt.hash(
        password,
        BCRYPT_SALT_ROUNDS,
      );

      // The user may already exist on the database in case it was invided.
      if (existingUser) {
        // If the user already have an password,
        // it means that it has already signed up
        const existingPassword = await UserRepository.findPassword(
          existingUser.id,
          options,
        );

        if (existingPassword) {
          throw new Error400(
            options.language,
            'auth.emailAlreadyInUse',
          );
        }

        /**
         * In the case of the user exists on the database
         * it only creates the new password
         */
        await UserRepository.updatePassword(
          existingUser.id,
          hashedPassword,
          {
            ...options,
            transaction,
          },
        );

        const token = jwt.sign(
          { id: existingUser.id },
          getConfig().AUTH_JWT_SECRET,
          { expiresIn: getConfig().AUTH_JWT_EXPIRES_IN },
        );

        await SequelizeRepository.commitTransaction(
          transaction,
        );

        return token;
      }

      const isFirstUser =
        (await UserRepository.count(null, {
          ...options,
          transaction,
        })) === 0;

      const newUser = await UserRepository.createFromAuth(
        {
          firstName: email.split('@')[0],
          password: hashedPassword,
          email: email,
          roles: isFirstUser ? [Roles.values.admin] : [],
        },
        {
          ...options,
          transaction,
        },
      );

      const token = jwt.sign(
        { id: newUser.id },
        getConfig().AUTH_JWT_SECRET,
        { expiresIn: getConfig().AUTH_JWT_EXPIRES_IN },
      );

      await SequelizeRepository.commitTransaction(
        transaction,
      );

      return token;
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      );

      throw error;
    }
  }

  /**
   * Finds the user by the email.
   *
   * @param email
   * @param options
   */
  static async findByEmail(email, options: any = {}) {
    return UserRepository.findByEmail(email, options);
  }

  /**
   * Signs in a User with the email and password and returns a JWT token.
   * @param {*} email
   * @param {*} password
   * @param {*} [options]
   */
  static async signin(email, password, options: any = {}) {
    const transaction = await SequelizeRepository.createTransaction(
      options.database,
    );

    try {
      const user = await UserRepository.findByEmail(
        email,
        options,
      );

      if (!user) {
        throw new Error400(
          options.language,
          'auth.userNotFound',
        );
      }

      const currentPassword = await UserRepository.findPassword(
        user.id,
        options,
      );

      if (!currentPassword) {
        throw new Error400(
          options.language,
          'auth.wrongPassword',
        );
      }

      const passwordsMatch = await bcrypt.compare(
        password,
        currentPassword,
      );

      if (!passwordsMatch) {
        throw new Error400(
          options.language,
          'auth.wrongPassword',
        );
      }

      const token = jwt.sign(
        { id: user.id },
        getConfig().AUTH_JWT_SECRET,
        { expiresIn: getConfig().AUTH_JWT_EXPIRES_IN },
      );

      await SequelizeRepository.commitTransaction(
        transaction,
      );

      return token;
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        transaction,
      );

      throw error;
    }
  }

  /**
   * Finds the user based on the JWT token.
   *
   * @param {*} token
   */
  static async findByToken(token, options) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getConfig().AUTH_JWT_SECRET,
        (err, decoded) => {
          if (err) {
            reject(err);
            return;
          }

          const id = decoded.id;
          const jwtTokenIat = decoded.iat;

          UserRepository.findById(id, {
            ...options,
            bypassPermissionValidation: true,
          })
            .then((user) => {
              const isTokenManuallyExpired =
                user &&
                user.jwtTokenInvalidBefore &&
                moment
                  .unix(jwtTokenIat)
                  .isBefore(
                    moment(user.jwtTokenInvalidBefore),
                  );

              if (isTokenManuallyExpired) {
                reject(new Error401());
                return;
              }

              // If the email sender id not configured,
              // removes the need for email verification.
              if (user && !EmailSender.isConfigured) {
                user.emailVerified = true;
              }

              resolve(user);
            })
            .catch((error) => reject(error));
        },
      );
    });
  }
  
  /**
   * Sends a password reset email.
   *
   * @param {*} language
   * @param {*} email
   */
  static async sendPasswordResetEmail(
    language,
    email,
    options,
  ) {
    if (!EmailSender.isConfigured) {
      throw new Error400(language, 'email.error');
    }

    let link;

    try {
      const token = await UserRepository.generatePasswordResetToken(
        email,
        options,
      );

      link = `${
        getConfig().FRONTEND_URL
      }/auth/password-reset?token=${token}`;
    } catch (error) {
      console.error(error);
      throw new Error400(
        language,
        'auth.passwordReset.error',
      );
    }

    return new EmailSender(
      EmailSender.TEMPLATES.PASSWORD_RESET,
      { link },
    ).sendTo(email);
  }

  /**
   * Resets the password, validating the password reset token.
   *
   * @param {*} token
   * @param {*} password
   * @param {*} options
   */
  static async passwordReset(
    token,
    password,
    options: any = {},
  ) {
    const user = await UserRepository.findByPasswordResetToken(
      token,
      options,
    );

    if (!user) {
      throw new Error400(
        options.language,
        'auth.passwordReset.invalidToken',
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      BCRYPT_SALT_ROUNDS,
    );

    return UserRepository.updatePassword(
      user.id,
      hashedPassword,
      options,
    );
  }

  static async changePassword(
    oldPassword,
    newPassword,
    options,
  ) {
    const currentUser = options.currentUser;
    const currentPassword = await UserRepository.findPassword(
      options.currentUser.id,
      options,
    );

    const passwordsMatch = await bcrypt.compare(
      oldPassword,
      currentPassword,
    );

    if (!passwordsMatch) {
      throw new Error400(
        options.language,
        'auth.passwordChange.invalidPassword',
      );
    }

    const newHashedPassword = await bcrypt.hash(
      newPassword,
      BCRYPT_SALT_ROUNDS,
    );

    return UserRepository.updatePassword(
      currentUser.id,
      newHashedPassword,
      options,
    );
  }
}

export default AuthService;
