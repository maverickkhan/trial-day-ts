"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("./connection"));
const issue_1 = __importDefault(require("./issue"));
class IssueRevision extends sequelize_1.Model {
}
IssueRevision.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    issue_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: issue_1.default, key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    title: sequelize_1.DataTypes.STRING,
    description: sequelize_1.DataTypes.STRING,
    issue_snapshot: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    changes: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    updated_by: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'unknown',
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: connection_1.default,
    tableName: 'issue_revisions',
    timestamps: false,
});
issue_1.default.hasMany(IssueRevision, { foreignKey: 'issue_id' });
IssueRevision.belongsTo(issue_1.default, { foreignKey: 'issue_id' });
exports.default = IssueRevision;
