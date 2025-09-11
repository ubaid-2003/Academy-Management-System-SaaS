'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FeePayment extends Model {
        static associate(models) {
            // FeePayment belongs to Student
            FeePayment.belongsTo(models.Student, {
                foreignKey: 'studentId',
                as: 'student',
            });

            // FeePayment belongs to FeeStructure
            FeePayment.belongsTo(models.FeeStructure, {
                foreignKey: 'feeStructureId',
                as: 'feeStructure',
            });

            // FeePayment belongs to StudentFeeStructure (assignment)
            FeePayment.belongsTo(models.StudentFeeStructure, {
                foreignKey: 'studentFeeStructureId',
                as: 'studentFeeAssignment',
            });

            // FeePayment recorded by a User
            FeePayment.belongsTo(models.User, {
                foreignKey: 'recordedBy',
                as: 'recordedByUser',
            });
        }
    }

    FeePayment.init(
        {
            id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
            studentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
            feeStructureId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
            studentFeeStructureId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
            amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
            paymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
            dueDate: { type: DataTypes.DATE, allowNull: false },
            paymentMethod: {
                type: DataTypes.ENUM('cash', 'credit_card', 'bank_transfer', 'check', 'online'),
                allowNull: false
            },
            status: { type: DataTypes.ENUM('paid', 'pending', 'overdue'), defaultValue: 'pending' },
            month: { type: DataTypes.STRING, allowNull: false },
            transactionId: { type: DataTypes.STRING },
            recordedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
            notes: { type: DataTypes.TEXT },
        },
        {
            sequelize,
            modelName: 'FeePayment',
            tableName: 'fee_payments',
            underscored: false // <-- important
        }
    );

    return FeePayment;
};
