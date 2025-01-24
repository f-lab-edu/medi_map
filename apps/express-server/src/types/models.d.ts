import { Sequelize, Model, DataTypes } from 'sequelize';

declare module '@/models' {
  export const sequelize: Sequelize;
  export const Sequelize: typeof Sequelize;

  export interface UserAttributes {
    id: string;
    username: string;
    email: string;
    password?: string;
    googleId?: string;
    provider: string;
  }

  export class User extends Model<UserAttributes> {
    id: string;
    username: string;
    email: string;
    password?: string;
    googleId?: string;
    provider: string;
  }

  export { User };
}
