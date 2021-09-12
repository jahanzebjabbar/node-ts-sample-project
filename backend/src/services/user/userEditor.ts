import Roles from '../../security/roles';
import assert from 'assert';
import Error400 from '../../errors/Error400';
import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import UserRepository from '../../database/repositories/userRepository';
import { IServiceOptions } from '../IServiceOptions';

/**
 * Handles the edition of the user(s) via the User page.
 */
export default class UserEditor {
  options: IServiceOptions;
  data;
  transaction;
  user;

  constructor(options) {
    this.options = options;
  }

  /**
   * Updates a User via the User page.
   *
   * @param {*} data
   */
  async update(data) {
    this.data = data;

    await this._validate();

    try {
      this.transaction = await SequelizeRepository.createTransaction(
        this.options.database,
      );

      await this._loadUser();
      await this._updateAtDatabase();

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

  /**
   * Loads the user and validate that it exists.
   */
  async _loadUser() {
    this.user = await UserRepository.findById(
      this.data.id,
      this.options,
    );

    if (!this.user) {
      throw new Error400(
        this.options.language,
        'user.errors.userNotFound',
      );
    }
  }

  /**
   * Updates the user at the database.
   */
  async _updateAtDatabase() {
    await UserRepository.updateRoles(
      this.data.id,
      this.data.roles,
      this.options,
    );
  }

  /**
   * Checks if the user is removing it's own admin role
   */
  async _isRemovingOwnAdminRole() {
    if (this._roles.includes(Roles.values.admin)) {
      return false;
    }

    if (
      String(this.data.id) !==
      String(this.options.currentUser.id)
    ) {
      return false;
    }

    return this.options.currentUser.roles.includes(
      Roles.values.admin,
    );
  }

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

    assert(this.data.id, 'id is required');
    assert(this._roles, 'roles is required (can be empty)');

    if (await this._isRemovingOwnAdminRole()) {
      throw new Error400(
        this.options.language,
        'user.errors.revokingOwnPermission',
      );
    }
  }
}
