import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './connection';
import Issue from './issue';

interface IssueRevisionAttributes {
  id: number;
  issue_id: number;
  title: string;
  description: string;
  issue_snapshot: object;      
  changes: object;             
  updated_by?: string;
  updated_at?: Date;
}

type IssueRevisionCreationAttributes = Optional<
  IssueRevisionAttributes,
  'id' | 'updated_by'
>;

class IssueRevision
  extends Model<IssueRevisionAttributes, IssueRevisionCreationAttributes>
  implements IssueRevisionAttributes
{
  public id!: number;
  public issue_id!: number;
  public title!: string;
  public description!: string;
  public issue_snapshot!: object;  
  public changes!: object;         
  public updated_by?: string;
  public updated_at?: Date;
}

IssueRevision.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    issue_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Issue, key: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    issue_snapshot: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: false,
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
    tableName: 'issue_revisions',
    timestamps: false,
  }
);

Issue.hasMany(IssueRevision, { foreignKey: 'issue_id' });
IssueRevision.belongsTo(Issue, { foreignKey: 'issue_id' });

export default IssueRevision;
