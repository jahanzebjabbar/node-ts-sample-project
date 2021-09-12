export default (app) => {
  app.put(
    `/auth/password-reset`,
    require('./authPasswordReset').default,
  );

  app.post(
    `/auth/send-password-reset-email`,
    require('./authSendPasswordResetEmail').default,
  );

  app.post(
    `/auth/sign-in`,
    require('./authSignIn').default,
  );

  app.post(
    `/auth/sign-up`,
    require('./authSignUp').default,
  );

  app.put(
    `/auth/profile`,
    require('./authUpdateProfile').default,
  );

  app.put(
    `/auth/change-password`,
    require('./authPasswordChange').default,
  );

  app.get(`/auth/me`, require('./authMe').default);

  app.get(
    `/auth/email-configured`,
    require('./authIsEmailConfigured').default,
  );
};
