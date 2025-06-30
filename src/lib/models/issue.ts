import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './connection';

interface IssueAttributes {
  id: number;
  title: string;
  description: string;
  created_by?: string;
  created_at?: Date;
  updated_by?: string;
  updated_at?: Date;
}

type IssueCreationAttributes = Optional<IssueAttributes, 'id' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'>;

class Issue extends Model<IssueAttributes, IssueCreationAttributes> implements IssueAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public created_by?: string;
  public created_at?: Date;
  public updated_by?: string;
  public updated_at?: Date;
}

Issue.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      defaultValue: 'unknown',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.STRING,
      defaultValue: 'unknown',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'issues',
    timestamps: false,
  }
);

export default Issue;
