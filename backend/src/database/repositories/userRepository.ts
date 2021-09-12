import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import FileRepository from './fileRepository';
import crypto from 'crypto';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import { getConfig } from '../../config';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';

const Op = Sequelize.Op;

/**
 * Handles database operations for Users.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
export default class UserRepository {
  /**
   * Creates a User.
   */
  static async create(data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const user = await options.database.user.create(
      {
        id: data.id || undefined,
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phoneNumber: data.phoneNumber || null,
        roles: data.roles || [],
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.user.getTableName(),
        belongsToColumn: 'avatars',
        belongsToId: user.id,
      },
      data.avatars,
      options,
    );

    return this.findById(user.id, options);
  }

  /**
   * Creates the user based on the auth information.
   *
   * @param {*} data
   * @param {*} [options]
   */
  static async createFromAuth(
    data,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const user = await options.database.user.create(
      {
        email: data.email,
        firstName: data.firstName,
        password: data.password,
        roles: data.roles || [],
      },
      { transaction },
    );

    delete user.password;

    return this.findById(user.id, options);
  }

  /**
   * Updates the profile of the user.
   *
   * @param {*} id
   * @param {*} data
   * @param {*} [options]
   */
  static async updateProfile(
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const user = await options.database.user.findByPk(id, {
      transaction,
    });

    await user.update(
      {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phoneNumber: data.phoneNumber || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.user.getTableName(),
        belongsToColumn: 'avatars',
        belongsToId: user.id,
      },
      data.avatars,
      options,
    );

    return this.findById(user.id, options);
  }

  /**
   * Updates the password of the user.
   *
   * @param {*} id
   * @param {*} password
   * @param {*} [options]
   */
  static async updatePassword(
    id,
    password,
    options: IRepositoryOptions,
  ) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const user = await options.database.user.findByPk(id, {
      transaction,
    });

    await user.update(
      {
        password,
        jwtTokenInvalidBefore: new Date(),
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return this.findById(user.id, options);
  }

  /**
   * Generates the password reset token.
   *
   * @param {*} email
   * @param {*} [options]
   */
  static async generatePasswordResetToken(
    email,
    options: IRepositoryOptions,
  ) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const user = await options.database.user.findOne({
      where: { email },
      transaction,
    });

    const passwordResetToken = crypto
      .randomBytes(20)
      .toString('hex');
    const passwordResetTokenExpiresAt =
      Date.now() + 24 * 60 * 60 * 1000;

    await user.update(
      {
        passwordResetToken,
        passwordResetTokenExpiresAt,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return passwordResetToken;
  }

  /**
   * Updates a User.
   *
   * @param {*} id
   * @param {*} data
   * @param {*} [options]
   */
  static async update(
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const user = await options.database.user.findByPk(id, {
      transaction,
    });

    await user.update(
      {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phoneNumber: data.phoneNumber || null,
        updatedById: currentUser.id,
        roles: data.roles || [],
      },
      { transaction },
    );

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.user.getTableName(),
        belongsToColumn: 'avatars',
        belongsToId: user.id,
      },
      data.avatars,
      options,
    );

    return this.findById(user.id, options);
  }

  /**
   * Updates User roles.
   *
   * @param {*} id
   * @param {*} roles
   * @param {*} [options]
   */
  static async updateRoles(id, roles, options) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const user = await options.database.user.findByPk(id, {
      transaction,
    });

    if (options.addRoles) {
      user.roles = [...user.roles, ...roles];
    } else if (options.removeOnlyInformedRoles) {
      user.roles = lodash.difference(user.roles, roles);
    } else {
      user.roles = roles;
    }

    await user.save({ transaction });
    return this.findById(user.id, options);
  }

  /**
   * Finds the user by email.
   *
   * @param {*} email
   * @param {*} [options]
   */
  static async findByEmail(
    email,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const record = await options.database.user.findOne({
      where: { email },
      transaction,
    });

    return this._fillWithRelationsAndFiles(record, options);
  }

  /**
   * Find the user by email, but without fetching the avatar.
   *
   * @param {*} email
   * @param {*} [options]
   */
  static async findByEmailWithoutAvatar(
    email,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const record = await options.database.user.findOne({
      where: { email },
      transaction,
    });

    return this._fillWithRelationsAndFiles(record, options);
  }

  /**
   * Finds the user based on the query.
   *
   * @param {Object} query
   * @param {Object} query.filter
   * @param {number} query.limit
   * @param  {number} query.offset
   * @param  {string} query.orderBy
   *
   * @returns {Promise<Object>} response - Object containing the rows and the count.
   */
  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let whereAnd: Array<any> = [];
    let include: any = [];

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: filter.id,
        });
      }

      if (filter.fullName) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'user',
            'fullName',
            filter.fullName,
          ),
        );
      }

      if (filter.email) {
        whereAnd.push(
          SequelizeFilterUtils.ilike(
            'user',
            'email',
            filter.email,
          ),
        );
      }

      if (filter.role) {
        if (getConfig().DATABASE_DIALECT === 'mysql') {
          whereAnd.push(
            SequelizeFilterUtils.arrayContainsForMySQL(
              `users`,
              `roles`,
              filter.role,
            ),
          );
        } else {
          whereAnd.push({
            [Op.contains]: [filter.role],
          });
        }
      }

      if (filter.status) {
        if (filter.status === 'disabled') {
          if (getConfig().DATABASE_DIALECT === 'mysql') {
            whereAnd.push(
              SequelizeFilterUtils.arrayEmptyForMySQL(
                `users`,
                `roles`,
              ),
            );
          } else {
            whereAnd.push(
              SequelizeFilterUtils.arrayEmptyForPostgreSQL(
                `users`,
                `roles`,
              ),
            );
          }
        }

        if (filter.status === 'enabled') {
          if (getConfig().DATABASE_DIALECT === 'mysql') {
            whereAnd.push(
              SequelizeFilterUtils.arrayNotEmtpyForMySQL(
                `users`,
                `roles`,
              ),
            );
          } else {
            whereAnd.push(
              SequelizeFilterUtils.arrayNotEmtpyForPostgreSQL(
                `users`,
                `roles`,
              ),
            );
          }
        }
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          whereAnd.push({
            ['createdAt']: {
              [Op.gte]: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          whereAnd.push({
            ['createdAt']: {
              [Op.lte]: end,
            },
          });
        }
      }
    }

    const where = { [Op.and]: whereAnd };

    let {
      rows,
      count,
    } = await options.database.user.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['email', 'ASC']],
      transaction,
    });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    return { rows, count };
  }

  /**
   * Lists the users to populate the autocomplete.
   *
   * @param {Object} query
   * @param {number} limit
   * @param {Object} options
   */
  static async findAllAutocomplete(
    query,
    limit,
    options: IRepositoryOptions,
  ) {
    let where = {};
    let include = [];

    if (query) {
      where = {
        [Op.or]: [
          {
            ['id']: SequelizeFilterUtils.uuid(query),
          },
          SequelizeFilterUtils.ilike(
            'user',
            'fullName',
            query,
          ),
          SequelizeFilterUtils.ilike(
            'user',
            'email',
            query,
          ),
        ],
      };
    }

    let users = await options.database.user.findAll({
      attributes: ['id', 'fullName', 'email'],
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['fullName', 'ASC']],
    });

    const buildText = (user) => {
      if (!user.fullName) {
        return user.email;
      }

      return `${user.fullName} <${user.email}>`;
    };

    return users.map((user) => ({
      id: user.id,
      label: buildText(user),
    }));
  }

  /**
   * Finds the user and all its relations.
   *
   * @param {any} id
   * @param {Object} [options]
   */
  static async findById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.user.findByPk(id, {
      transaction,
    });

    record = await this._fillWithRelationsAndFiles(
      record,
      options,
    );

    if (!record) {
      throw new Error404();
    }

    return record;
  }

  /**
   * Finds the user, without fetching the avatar.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findByIdWithoutAvatar(
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.user.findByPk(id, {
      transaction,
    });

    record = await this._fillWithRelationsAndFiles(
      record,
      options,
    );

    return record;
  }

  /**
   * Finds the user by the password token if not expired.
   *
   * @param {*} token
   * @param {*} [options]
   */
  static async findByPasswordResetToken(
    token,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const record = await options.database.user.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiresAt: {
          [options.database.Sequelize.Op.gt]: Date.now(),
        },
      },
      transaction,
    });

    return this._fillWithRelationsAndFiles(record, options);
  }

  /**
   * Counts the users based on the filter.
   *
   * @param {*} [filter]
   * @param {*} [options]
   */
  static async count(filter, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    return options.database.user.count(
      {
        where: filter,
      },
      { transaction },
    );
  }

  static async findPassword(
    id,
    options: IRepositoryOptions,
  ) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const record = await options.database.user.findByPk(
      id,
      {
        // raw is responsible
        // for bringing the password
        raw: true,
        transaction,
      },
    );

    if (!record) {
      return null;
    }

    return record.password;
  }

  /**
   * Fills the users with the relations and files.
   *
   * @param {*} rows
   * @param {*} [options]
   */
  static async _fillWithRelationsAndFilesForRows(
    rows,
    options: IRepositoryOptions,
  ) {
    if (!rows) {
      return rows;
    }

    return Promise.all(
      rows.map((record) =>
        this._fillWithRelationsAndFiles(record, options),
      ),
    );
  }

  /**
   * Fills a User with the relations and files.
   *
   * @param {*} record
   * @param {*} [options]
   */
  static async _fillWithRelationsAndFiles(
    record,
    options: IRepositoryOptions,
  ) {
    if (!record) {
      return record;
    }

    const output = record.get({ plain: true });

    output.avatars = await FileRepository.fillDownloadUrl(
      await record.getAvatars({
        transaction: SequelizeRepository.getTransaction(
          options,
        ),
      }),
    );

    return output;
  }
}
