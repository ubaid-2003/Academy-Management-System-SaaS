// models/StudentFeeStructure.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentFeeStructure extends Model {
    static associate(models) {
      // StudentFeeStructure belongs to Student
      StudentFeeStructure.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student',
        onDelete: 'CASCADE',
      });

      // StudentFeeStructure belongs to FeeStructure
      StudentFeeStructure.belongsTo(models.FeeStructure, {
        foreignKey: 'feeStructureId',
        as: 'feeStructure',
        onDelete: 'CASCADE',
      });

      // StudentFeeStructure has many FeePayments
      StudentFeeStructure.hasMany(models.FeePayment, {
        foreignKey: 'studentFeeStructureId',
        as: 'payments',
        onDelete: 'CASCADE',
      });
    }
  }

  StudentFeeStructure.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      studentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      feeStructureId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      scholarship: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      finalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // computed after discount
      status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active',
      }
    },
    {
      sequelize,
      modelName: 'StudentFeeStructure',
      tableName: 'student_fee_structures',
      timestamps: true,
    }
  );

  return StudentFeeStructure;
};
