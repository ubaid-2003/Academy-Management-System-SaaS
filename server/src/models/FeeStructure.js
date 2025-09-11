'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FeeStructure extends Model {
        static associate(models) {
            // FeeStructure belongs to Class
            this.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });

            // FeeStructure has many FeePayments
            this.hasMany(models.FeePayment, { foreignKey: 'feeStructureId', as: 'payments' });

            // Many-to-Many with Student through StudentFeeStructure
            this.belongsToMany(models.Student, {
                through: models.StudentFeeStructure,
                foreignKey: 'feeStructureId',
                otherKey: 'studentId',
                as: 'students',
            });

            // Has many StudentFeeStructure assignments
            this.hasMany(models.StudentFeeStructure, {
                foreignKey: 'feeStructureId',
                as: 'studentAssignments',
            });

            // Has many CourseFeeStructure assignments
            this.hasMany(models.CourseFeeStructure, {
                foreignKey: 'feeStructureId',
                as: 'courseFeeStructures' // used in eager loading
            });

            // Many-to-Many with Course through CourseFeeStructure
            this.belongsToMany(models.Course, {
                through: models.CourseFeeStructure, // singular name
                foreignKey: 'feeStructureId',
                otherKey: 'courseId',
                as: 'courses',
            });

            // FeeStructure belongs to Academy
            this.belongsTo(models.Academy, { foreignKey: 'academyId', as: 'academy' });
        }
    }

    FeeStructure.init(
        {
            id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
            academyId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: { model: 'academies', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            classId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
            tuitionFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
            admissionFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
            examFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
            libraryFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
            sportsFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
            otherFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
            dueDate: { type: DataTypes.DATE, allowNull: false },
            isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
            academicYear: { type: DataTypes.STRING, allowNull: false },
        },
        {
            sequelize,
            modelName: 'FeeStructure',
            tableName: 'fee_structures',
        }
    );

    return FeeStructure;
};
