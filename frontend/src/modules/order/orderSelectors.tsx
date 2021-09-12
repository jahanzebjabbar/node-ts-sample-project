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
      Permissions.values.orderRead,
    ),
);

const selectPermissionToEdit = createSelector(
  [
    authSelectors.selectCurrentUser,
  ],
  (currentUser) =>
    new PermissionChecker(currentUser).match(
      Permissions.values.orderEdit,
    ),
);

const selectPermissionToCreate = createSelector(
  [
    authSelectors.selectCurrentUser,
  ],
  (currentUser) =>
    new PermissionChecker(currentUser).match(
      Permissions.values.orderCreate,
    ),
);

const selectPermissionToDestroy = createSelector(
  [
    authSelectors.selectCurrentUser,
  ],
  (currentUser) =>
    new PermissionChecker(currentUser).match(
      Permissions.values.orderDestroy,
    ),
);

const orderSelectors = {
  selectPermissionToRead,
  selectPermissionToEdit,
  selectPermissionToCreate,
  selectPermissionToDestroy,
};

export default orderSelectors;
