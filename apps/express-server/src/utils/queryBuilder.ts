import { Sequelize, WhereOptions, Op } from 'sequelize';
import { QueryParams } from '@/types/medicine.types';

export function buildWhereClause(query: QueryParams): WhereOptions {
  const whereClause: WhereOptions = {};

  try {
    if (query.medicineName) {
      const formattedName = query.medicineName.replace(/\s+/g, ' & ');
      whereClause.itemName = Sequelize.literal(`
        to_tsvector('simple', "itemName") @@ to_tsquery('simple', '${formattedName}:*')
      `);
    }

    if (query.companyName) {
      whereClause.entpName = { [Op.iLike]: `%${query.companyName}%` };
    }

    if (query.color) {
      const colors = query.color.split(',').map(c => c.trim());
      whereClause.colorClass1 = {
        [Op.or]: colors.map(color => ({
          [Op.iLike]: `%${color}%`,
        })),
      };
    }

    if (query.shape) {
      const shapes = query.shape.split(',').map(s => s.trim());
      whereClause.drugShape = {
        [Op.or]: shapes.map(shape => ({
          [Op.iLike]: `%${shape}%`,
        })),
      };
    }

    if (query.formCodeName) {
      const forms = query.formCodeName.split(',').map(f => f.trim());
      whereClause.formCodeName = {
        [Op.or]: forms.map(form => ({
          [Op.iLike]: `%${form}%`,
        })),
      };
    }
  } catch (error) {
    console.error('[buildWhereClause] Error occurred:', error);
    throw error;
  }

  return whereClause;
}
