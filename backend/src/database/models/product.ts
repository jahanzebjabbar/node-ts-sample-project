import { DataTypes } from 'sequelize';

/**
 * Product database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize) {
  const product = sequelize.define(
    'product',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [2, 255],
          notEmpty: true,
        }
      },
      description: {
        type: DataTypes.TEXT,
        validate: {

        }
      },
      unitPrice: {
        type: DataTypes.DECIMAL(24, 2),
        allowNull: false,
        validate: {
          min: 0.01,
          max: 99999,
        }
      },
    },
    {
      indexes: [        

      ],
      timestamps: true,
      paranoid: true,
    },
  );

  product.associate = (models) => {


    models.product.hasMany(models.file, {
      as: 'photos',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.product.getTableName(),
        belongsToColumn: 'photos',
      },
    });
    
    models.product.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.product.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return product;
}
