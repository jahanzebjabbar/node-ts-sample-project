import { createSelector } from 'reselect';

const selectRaw = (state) => state.auth;

const selectAuthenticationUser = createSelector(
  [selectRaw],
  (auth) => auth.authenticationUser,
);

const selectCurrentUser = createSelector(
  [selectRaw],
  (auth) => auth.currentUser,
);

const selectCurrentUserEmail = createSelector(
  [selectCurrentUser],
  (currentUser) => (currentUser ? currentUser.email : null),
);

const selectCurrentUserFullName = createSelector(
  [selectCurrentUser],
  (currentUser) =>
    currentUser ? currentUser.fullName : '',
);

const selectSignedIn = createSelector(
  [selectCurrentUser],
  (currentUser) =>
    Boolean(currentUser) && Boolean(currentUser.id),
);

const selectRoles = createSelector(
  [selectCurrentUser],
  (currentUser) => {
    if (!currentUser || !currentUser.roles) {
      return [];
    }

    return currentUser.roles;
  },
);

const selectLoading = createSelector([selectRaw], (auth) =>
  Boolean(auth.loading),
);

const selectLoadingInit = createSelector(
  [selectRaw],
  (auth) => Boolean(auth.loadingInit),
);

const selectLoadingPasswordResetEmail = createSelector(
  [selectRaw],
  (auth) => Boolean(auth.loadingPasswordResetEmail),
);

const selectLoadingPasswordReset = createSelector(
  [selectRaw],
  (auth) => Boolean(auth.loadingPasswordReset),
);

const selectLoadingPasswordChange = createSelector(
  [selectRaw],
  (auth) => Boolean(auth.loadingPasswordChange),
);

const selectLoadingUpdateProfile = createSelector(
  [selectRaw],
  (auth) => Boolean(auth.loadingUpdateProfile),
);

const selectErrorMessage = createSelector(
  [selectRaw],
  (auth) => auth.errorMessage,
);

const selectErrorMessageVerifyEmail = createSelector(
  [selectRaw],
  (auth) => auth.errorMessageVerifyEmail,
);

const selectCurrentUserNameOrEmailPrefix = createSelector(
  [selectCurrentUser, selectCurrentUserFullName],
  (currentUser, fullName) => {
    if (!currentUser) {
      return '';
    }

    if (fullName && fullName.length < 25) {
      return fullName;
    }

    if (currentUser.firstName) {
      return currentUser.firstName;
    }

    return currentUser.email.split('@')[0];
  },
);

const selectCurrentUserAvatar = createSelector(
  [selectCurrentUser],
  (currentUser) => {
    if (
      !currentUser ||
      !currentUser.avatars ||
      !currentUser.avatars.length ||
      !currentUser.avatars[0].downloadUrl
    ) {
      return null;
    }

    return currentUser.avatars[0].downloadUrl;
  },
);

const authSelectors = {
  selectLoadingPasswordResetEmail,
  selectLoadingInit,
  selectLoadingUpdateProfile,
  selectLoading,
  selectRoles,
  selectSignedIn,
  selectCurrentUserFullName,
  selectCurrentUserEmail,
  selectCurrentUser,
  selectAuthenticationUser,
  selectErrorMessage,
  selectErrorMessageVerifyEmail,
  selectRaw,
  selectCurrentUserNameOrEmailPrefix,
  selectCurrentUserAvatar,
  selectLoadingPasswordReset,
  selectLoadingPasswordChange,
};

export default authSelectors;
