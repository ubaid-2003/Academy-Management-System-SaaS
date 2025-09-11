'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CourseFeeStructure extends Model {
        static associate(models) {
            // Correct references
            CourseFeeStructure.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
            CourseFeeStructure.belongsTo(models.FeeStructure, { foreignKey: 'feeStructureId', as: 'feeStructure' });
        }
    }

    CourseFeeStructure.init({
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        courseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        feeStructureId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        sequelize,
        modelName: 'CourseFeeStructure', // singular
        tableName: 'course_fee_structures',
    });

    return CourseFeeStructure;
};
