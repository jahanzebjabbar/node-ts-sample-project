import assert from 'assert';
import UserRepository from '../../database/repositories/userRepository';
import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import { IServiceOptions } from '../IServiceOptions';
/**
 * Handles the creation of the user(s) via the User page.
 */
export default class UserCreator {
  options: IServiceOptions;
  transaction;
  data;
  emails: any = [];

  constructor(options) {
    this.options = options;
  }

  /**
   * Creates new user(s) via the User page.
   * Sends Invitation Emails if flagged.
   *
   * @param {*} data
   * @param {*} sendInvitationEmails
   */
  async execute(data) {
    this.data = data;

    await this._validate();

    try {
      this.transaction = await SequelizeRepository.createTransaction(
        this.options.database,
      );

      await this._addOrUpdateAll();

      await SequelizeRepository.commitTransaction(
        this.transaction,
      );
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(
        this.transaction,
      );
      throw error;
    }
  }

  get _roles() {
    if (
      this.data.roles &&
      !Array.isArray(this.data.roles)
    ) {
      return [this.data.roles];
    } else {
      const uniqueRoles = [...new Set(this.data.roles)];
      return uniqueRoles;
    }
  }

  get _emails() {
    if (
      this.data.emails &&
      !Array.isArray(this.data.emails)
    ) {
      this.emails = [this.data.emails];
    } else {
      const uniqueEmails = [...new Set(this.data.emails)];
      this.emails = uniqueEmails;
    }

    return this.emails.map((email) => email.trim());
  }

  /**
   * Creates or updates many users at once.
   */
  async _addOrUpdateAll() {
    return Promise.all(
      this.emails.map((email) => this._addOrUpdate(email)),
    );
  }

  /**
   * Creates or updates the user passed.
   * If the user already exists, it only adds the role to the user.
   *
   * @param {*} email
   */
  async _addOrUpdate(email) {
    let user = await UserRepository.findByEmailWithoutAvatar(
      email,
      {
        ...this.options,
        transaction: this.transaction,
      },
    );

    if (!user) {
      user = await UserRepository.create(
        { email },
        {
          ...this.options,
          transaction: this.transaction,
        },
      );
    }

    await UserRepository.updateRoles(user.id, this._roles, {
      ...this.options,
      addRoles: true,
      transaction: this.transaction,
    });
  }

  /**
   * Validates the user(s) data.
   */
  async _validate() {
    assert(
      this.options.currentUser,
      'currentUser is required',
    );

    assert(
      this.options.currentUser.id,
      'currentUser.id is required',
    );

    assert(
      this.options.currentUser.email,
      'currentUser.email is required',
    );

    assert(
      this._emails && this._emails.length,
      'emails is required',
    );

    assert(
      this._roles && this._roles.length,
      'roles is required',
    );
  }
}
