import assert from 'assert';
import Error403 from '../../errors/Error403';
import Permissions from '../../security/permissions';

/**
 * Checks the Permission of the User.
 */
export default class PermissionChecker {
  language;
  currentUser;

  constructor({ language, currentUser }) {
    this.language = language;
    this.currentUser = currentUser;
  }

  /**
   * Validates if the user has a specific permission
   * and throws a Error403 if it doesn't.
   * @param {*} permission
   */
  validateHas(permission) {
    if (!this.has(permission)) {
      throw new Error403(this.language);
    }
  }

  /**
   * Checks if the user has a specific permission.
   * @param {*} permission
   */
  has(permission) {
    assert(permission, 'permission is required');
    return this.hasRolePermission(permission);
  }

  /**
   * Validates if the user has access to a storage
   * and throws a Error403 if it doesn't.
   * @param {*} storageId
   */
  validateHasStorage(storageId) {
    if (!this.hasStorage(storageId)) {
      throw new Error403(this.language);
    }
  }

  /**
   * Validates if the user has access to a storage.
   * @param {*} storageId
   */
  hasStorage(storageId: string) {
    assert(storageId, 'storageId is required');
    return this.allowedStorageIds().includes(storageId);
  }

  /**
   * Checks if the current user roles allows the permission.
   */
  hasRolePermission(permission) {
    return this.currentUserRolesIds.some((role) =>
      permission.allowedRoles.some(
        (allowedRole) => allowedRole === role,
      ),
    );
  }

  /**
   * Returns the Current User Roles.
   */
  get currentUserRolesIds() {
    if (!this.currentUser || !this.currentUser.roles) {
      return [];
    }

    return this.currentUser.roles;
  }

  /**
   * Returns the allowed storage ids for the user.
   */
  allowedStorageIds() {
    let allowedStorageIds: Array<string> = [];

    Permissions.asArray.forEach((permission) => {
      if (this.has(permission)) {
        allowedStorageIds = allowedStorageIds.concat(
          (permission.allowedStorage || []).map(
            (storage) => storage.id,
          ),
        );
      }
    });

    return [...new Set(allowedStorageIds)];
  }
}
