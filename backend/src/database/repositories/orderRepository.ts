import SequelizeRepository from '../../database/repositories/sequelizeRepository';
import lodash from 'lodash';
import SequelizeFilterUtils from '../../database/utils/sequelizeFilterUtils';
import Error404 from '../../errors/Error404';
import Sequelize from 'sequelize';
import FileRepository from './fileRepository';
import { IRepositoryOptions } from './IRepositoryOptions';

const Op = Sequelize.Op;

/**
 * Handles database operations for the Order.
 * See https://sequelize.org/v5/index.html to learn how to customize it.
 */
class OrderRepository {
  /**
   * Creates the Order.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async create(data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );   

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const record = await options.database.order.create(
      {
        ...lodash.pick(data, [
          'delivered',                   
        ]),
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setCustomer(data.customer || null, {
      transaction,
    });
    await record.setProducts(data.products || [], {
      transaction,
    });
    await record.setEmployee(data.employee || null, {
      transaction,
    });
  
    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.order.getTableName(),
        belongsToColumn: 'attachments',
        belongsToId: record.id,
      },
      data.attachments,
      options,
    );
  
    return this.findById(record.id, options);
  }

  /**
   * Updates the Order.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  static async update(id, data, options: IRepositoryOptions) {
    const currentUser = SequelizeRepository.getCurrentUser(
      options,
    );

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.order.findByPk(
      id,
      {
        transaction,
      },
    );

    record = await record.update(
      {
        ...lodash.pick(data, [
          'delivered',          
        ]),
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );

    await record.setCustomer(data.customer || null, {
      transaction,
    });
    await record.setProducts(data.products || [], {
      transaction,
    });
    await record.setEmployee(data.employee || null, {
      transaction,
    });

    await FileRepository.replaceRelationFiles(
      {
        belongsTo: options.database.order.getTableName(),
        belongsToColumn: 'attachments',
        belongsToId: record.id,
      },
      data.attachments,
      options,
    );

    return this.findById(record.id, options);
  }

  /**
   * Deletes the Order.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async destroy(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    let record = await options.database.order.findByPk(
      id,
      {
        transaction,
      },
    );

    await record.destroy({
      transaction,
    });
  }

  /**
   * Finds the Order and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  static async findById(id, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    const include = [
      {
        model: options.database.customer,
        as: 'customer',
      },
      {
        model: options.database.user,
        as: 'employee',
      },
    ];

    const record = await options.database.order.findByPk(
      id,
      {
        include,
        transaction,
      },
    );

    return this._fillWithRelationsAndFiles(record, options);
  }

  /**
   * Counts the number of Orders based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  static async count(filter, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    return options.database.order.count(
      {
        where: {
          ...filter,
        },
      },
      {
        transaction,
      },
    );
  }

  /**
   * Finds the Orders based on the query.
   * See https://sequelize.org/v5/manual/querying.html to learn how to
   * customize the query.
   *
   * @param {Object} query
   * @param {Object} query.filter
   * @param {number} query.limit
   * @param  {number} query.offset
   * @param  {string} query.orderBy
   * @param {Object} [options]
   *
   * @returns {Promise<Object>} response - Object containing the rows and the count.
   */
  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    let whereAnd: Array<any> = [];
    let include = [
      {
        model: options.database.customer,
        as: 'customer',
      },
      {
        model: options.database.user,
        as: 'employee',
      },      
    ];

    if (filter) {
      if (filter.id) {
        whereAnd.push({
          ['id']: SequelizeFilterUtils.uuid(filter.id),
        });
      }

      if (filter.customer) {
        whereAnd.push({
          ['customerId']: SequelizeFilterUtils.uuid(
            filter.customer,
          ),
        });
      }

      if (filter.employee) {
        whereAnd.push({
          ['employeeId']: SequelizeFilterUtils.uuid(
            filter.employee,
          ),
        });
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
    } = await options.database.order.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy
        ? [orderBy.split('_')]
        : [['createdAt', 'DESC']],
      transaction: SequelizeRepository.getTransaction(
        options,
      ),
    });

    rows = await this._fillWithRelationsAndFilesForRows(
      rows,
      options,
    );

    return { rows, count };
  }

  /**
   * Lists the Orders to populate the autocomplete.
   * See https://sequelize.org/v5/manual/querying.html to learn how to
   * customize the query.
   *
   * @param {Object} query
   * @param {number} limit
   */
  static async findAllAutocomplete(query, limit, options: IRepositoryOptions) {
    let where: any = {};

    if (query) {
      where = {
        ...where,
        [Op.or]: [
          { ['id']: SequelizeFilterUtils.uuid(query) },

        ],
      };
    }

    const records = await options.database.order.findAll(
      {
        attributes: ['id', 'id'],
        where,
        limit: limit ? Number(limit) : undefined,
        orderBy: [['id', 'ASC']],
      },
    );

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }

  /**
   * Fills an array of Order with relations and files.
   *
   * @param {Array} rows
   * @param {Object} [options]
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
   * Fill the Order with the relations and files.
   *
   * @param {Object} record
   * @param {Object} [options]
   */
  static async _fillWithRelationsAndFiles(record, options: IRepositoryOptions) {
    if (!record) {
      return record;
    }

    const output = record.get({ plain: true });

    const transaction = SequelizeRepository.getTransaction(
      options,
    );

    output.products = await record.getProducts({
      transaction,
    });
    output.attachments = await FileRepository.fillDownloadUrl(
      await record.getAttachments({
        transaction,
      }),
    );

    return output;
  }
}

export default OrderRepository;
