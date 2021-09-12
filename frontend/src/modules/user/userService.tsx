import authAxios from 'src/modules/shared/axios/authAxios';

export default class UserService {
  static async edit(data) {
    const body = {
      data,
    };

    const response = await authAxios.put(`/user`, body);

    return response.data;
  }

  static async destroy(ids) {
    const params = {
      ids,
    };

    const response = await authAxios.delete(`/user`, {
      params,
    });

    return response.data;
  }

  static async create(data) {
    const body = {
      data,
    };

    const response = await authAxios.post(`/user`, body);

    return response.data;
  }

  static async import(values, importHash) {
    const body = {
      data: {
        ...values,
      },
      importHash,
    };

    const response = await authAxios.post(
      `/user/import`,
      body,
    );

    return response.data;
  }

  static async find(id) {
    const response = await authAxios.get(`/user/${id}`);
    return response.data;
  }

  static async fetchUsers(filter, orderBy, limit, offset) {
    const params = {
      filter,
      orderBy,
      limit,
      offset,
    };

    const response = await authAxios.get(`/user`, {
      params,
    });

    return response.data;
  }

  static async fetchUserAutocomplete(query, limit) {
    const params = {
      query,
      limit,
    };

    const response = await authAxios.get(
      `/user/autocomplete`,
      {
        params,
      },
    );
    return response.data;
  }
}
