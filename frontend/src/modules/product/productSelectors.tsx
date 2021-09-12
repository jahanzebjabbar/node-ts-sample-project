import { createSelector } from 'reselect';
import authSelectors from 'src/modules/auth/authSelectors';
import PermissionChecker from 'src/modules/auth/permissionChecker';
import Permissions from 'src/security/permissions';

const selectPermissionToRead = createSelector(
  [
    authSelectors.selectCurrentUser,
  ],
  (currentUser) =>
    new PermissionChecker(currentUser).match(
      Permissions.values.productRead,
    ),
);

const selectPermissionToEdit = createSelector(
  [
    authSelectors.selectCurrentUser,
  ],
  (currentUser) =>
    new PermissionChecker(currentUser).match(
      Permissions.values.productEdit,
    ),
);

const selectPermissionToCreate = createSelector(
  [
    authSelectors.selectCurrentUser,
  ],
  (currentUser) =>
    new PermissionChecker(currentUser).match(
      Permissions.values.productCreate,
    ),
);

const selectPermissionToDestroy = createSelector(
  [
    authSelectors.selectCurrentUser,
  ],
  (currentUser) =>
    new PermissionChecker(currentUser).match(
      Permissions.values.productDestroy,
    ),
);

const productSelectors = {
  selectPermissionToRead,
  selectPermissionToEdit,
  selectPermissionToCreate,
  selectPermissionToDestroy,
};

export default productSelectors;
