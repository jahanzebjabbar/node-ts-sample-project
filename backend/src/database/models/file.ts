/**
 * File database model.
 * See https://sequelize.org/v5/manual/models-definition.html to learn how to customize it.
 */
export default function (sequelize, DataTypes) {
  const file = sequelize.define(
    'file',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      belongsTo: DataTypes.STRING(255),
      belongsToId: DataTypes.STRING(255),
      belongsToColumn: DataTypes.STRING(255),
      name: {
        type: DataTypes.STRING(2083),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      sizeInBytes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      privateUrl: {
        type: DataTypes.STRING(2083),
        allowNull: true,
      },
      publicUrl: {
        type: DataTypes.STRING(2083),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  file.associate = (models) => {
    models.file.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.file.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return file;
}
