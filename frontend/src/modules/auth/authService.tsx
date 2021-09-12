import { AuthToken } from 'src/modules/auth/authToken';
import authAxios from 'src/modules/shared/axios/authAxios';

export default class AuthService {
  static async sendPasswordResetEmail(email) {
    const response = await authAxios.post(
      '/auth/send-password-reset-email',
      {
        email,
      },
    );

    return response.data;
  }

  static async registerWithEmailAndPassword(
    email,
    password,
  ) {
    const response = await authAxios.post('/auth/sign-up', {
      email,
      password,
    });

    return response.data;
  }

  static async signinWithEmailAndPassword(email, password) {
    const response = await authAxios.post('/auth/sign-in', {
      email,
      password,
    });

    return response.data;
  }

  static async fetchMe() {
    const response = await authAxios.get('/auth/me');
    return response.data;
  }

  static async isEmailConfigured() {
    const response = await authAxios.get(
      '/auth/email-configured',
    );
    return response.data;
  }

  static signout() {
    AuthToken.set(null, true);
  }

  static async updateProfile(data) {
    const body = {
      data,
    };

    const response = await authAxios.put(
      '/auth/profile',
      body,
    );

    return response.data;
  }

  static async changePassword(oldPassword, newPassword) {
    const body = {
      oldPassword,
      newPassword,
    };

    const response = await authAxios.put(
      '/auth/change-password',
      body,
    );

    return response.data;
  }

  static async passwordReset(token, password) {
    const response = await authAxios.put(
      '/auth/password-reset',
      {
        token,
        password,
      },
    );

    return response.data;
  }
}
