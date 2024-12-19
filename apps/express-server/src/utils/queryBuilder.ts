import { Sequelize, WhereOptions, Op } from 'sequelize';
import { QueryParams } from '@/types/medicine.types';
import { SEARCH_MESSAGES } from '@/constants/search_messages';

export function buildWhereClause(query: QueryParams): WhereOptions {
  const whereClause: WhereOptions = {};

  try {
    // 약물 이름 검색 조건 추가
    if (query.medicineName) {
      const formattedName = query.medicineName.replace(/\s+/g, ' & ');
      whereClause.itemName = Sequelize.literal(`
        to_tsvector('simple', "Medicine"."itemName") @@ to_tsquery('simple', '${formattedName}:*')
      `);
    }

    // 회사 이름 검색 조건 추가
    if (query.companyName) {
      whereClause.entpName = { [Op.iLike]: `%${query.companyName}%` };
    }

    // 색상 필터 조건 추가
    if (query.color) {
      const colors = query.color.split(',').map(c => c.trim());
      whereClause.colorClass1 = {
        [Op.or]: colors.map(color => ({
          [Op.iLike]: `%${color}%`,
        })),
      };
    }

    // 모양 필터 조건 추가
    if (query.shape) {
      const shapes = query.shape.split(',').map(s => s.trim());
      whereClause.drugShape = {
        [Op.or]: shapes.map(shape => ({
          [Op.iLike]: `%${shape}%`,
        })),
      };
    }

    // 약물 형태 필터 조건 추가
    if (query.formCodeName) {
      const forms = query.formCodeName.split(',').map(f => f.trim());
      whereClause.formCodeName = {
        [Op.or]: forms.map(form => ({
          [Op.iLike]: `%${form}%`,
        })),
      };
    }
  } catch (error) {
    console.error(SEARCH_MESSAGES.BUILD_ERROR, error);
    throw error;
  }

  return whereClause;
}
