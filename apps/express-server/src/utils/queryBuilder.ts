import { Sequelize, WhereOptions, Op } from 'sequelize';

export function buildWhereClause(query: any): WhereOptions {
  const whereClause: WhereOptions = {};
  console.log('[buildWhereClause] Received query:', query); // 디버깅: 전달받은 쿼리 확인

  try {
    if (query.medicineName) {
      whereClause.itemName = Sequelize.literal(`
        to_tsvector('simple', "itemName") @@ to_tsquery('simple', '${query.medicineName.replace(/\s+/g, ' & ')}:*')
      `);
    }
    if (query.companyName) {
      whereClause.entpName = { [Op.iLike]: `%${query.companyName}%` };
    }
    if (query.color) {
      const colors = query.color.split(',').map((c: string) => c.trim());
      whereClause.colorClass1 = { [Op.or]: colors.map(color => ({ [Op.iLike]: `%${color}%` })) };
    }
    if (query.shape) {
      const shapes = query.shape.split(',').map((s: string) => s.trim());
      whereClause.drugShape = { [Op.or]: shapes.map(shape => ({ [Op.iLike]: `%${shape}%` })) };
    }
    if (query.formCodeName) {
      const forms = query.formCodeName.split(',').map((f: string) => f.trim());
      whereClause.formCodeName = { [Op.or]: forms.map(form => ({ [Op.iLike]: `%${form}%` })) };
    }

    console.log('[buildWhereClause] Built whereClause:', whereClause); // 디버깅: 빌드된 조건 확인
  } catch (error) {
    console.error('[buildWhereClause] Error occurred:', error); // 디버깅: 에러 상세 출력
    throw error; // 상위로 에러 전달
  }

  return whereClause;
}
