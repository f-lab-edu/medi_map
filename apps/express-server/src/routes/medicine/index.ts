import express from 'express';
import { syncMedicines, syncApprovals, getJoinedMedicines, getAllMedicines } from '@/services/medicineService';
import { Medicine, MedicineDesc } from '@/models';
import { sendResponse } from '@/utils/medicineUtils';
import { SEARCH_MESSAGES } from '@/constants/search_messages';
import { buildWhereClause } from '@/utils/queryBuilder';

const router = express.Router();

// 1. 데이터 동기화
router.post('/sync', async (req, res) => {
  try {
    await syncMedicines();
    sendResponse(res, 200, { message: 'Medicine data synced successfully.' });
  } catch (error) {
    sendResponse(res, 500, { error: 'Failed to sync medicines.', message: (error as Error).message });
  }
});

router.post('/sync-approval', async (req, res) => {
  try {
    await syncApprovals();
    sendResponse(res, 200, { message: 'Approval data synced successfully.' });
  } catch (error) {
    sendResponse(res, 500, { error: 'Failed to sync approval data.', message: (error as Error).message });
  }
});

// 전체 데이터 조회
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const data = await getAllMedicines(page, limit);
    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 500, { error: 'Failed to fetch data.', message: (error as Error).message });
  }
});

// 검색 API
router.get('/search', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    console.log('[Search API] Query params:', req.query); // 쿼리 확인

    const whereClause = buildWhereClause(req.query);
    console.log('[Search API] Built whereClause:', whereClause); // 조건 확인

    const totalCountPromise = Medicine.count({ where: whereClause });
    const dataPromise = Medicine.findAll({
      where: whereClause,
      include: [
        {
          model: Medicine,
          as: 'RelatedMedicines',
          required: false,
          attributes: ['id', 'itemSeq', 'itemName'], // 필요한 필드만 가져오기
        },
        {
          model: MedicineDesc,
          required: false,
          attributes: ['itemSeq', 'itemName'], // 필요한 필드만 가져오기
        },
      ],
      limit: limitNumber,
      offset,
    });

    const [totalCount, data] = await Promise.all([totalCountPromise, dataPromise]);
    console.log('[Search API] Total count:', totalCount); // 총 개수 확인
    console.log('[Search API] Retrieved data:', data); // 데이터 확인

    sendResponse(res, 200, {
      results: data,
      total: totalCount,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error('[Search API] Error occurred:', error); // 에러 로그 출력
    sendResponse(res, 500, { error: '검색 중 오류 발생', message: error.message });
  }
});


// 특정 ITEM_SEQ 조인 데이터 조회
router.get('/:itemSeq', async (req, res) => {
  try {
    const { itemSeq } = req.params;
    const data = await getJoinedMedicines(itemSeq);

    if (!data) {
      return sendResponse(res, 404, { error: 'No data found for the given ITEM_SEQ.' });
    }

    sendResponse(res, 200, data);
  } catch (error) {
    sendResponse(res, 500, { error: 'Failed to fetch data.', message: (error as Error).message });
  }
});


export default router;
