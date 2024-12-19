import express from 'express';
import { syncMedicines, syncApprovals, getJoinedMedicines, getAllMedicines } from '@/services/medicineService';
import { Medicine, MedicineDesc } from '@/models';
import { sendResponse } from '@/utils/medicineUtils';
import { buildWhereClause } from '@/utils/queryBuilder';
import { SEARCH_MESSAGES } from '@/constants/search_messages';
import { ValidationError, UnexpectedError, DatabaseError } from '@/error/CommonError';

const router = express.Router();

// 의약물 데이터 동기화
router.post('/sync', async (req, res) => {
  try {
    await syncMedicines();
    sendResponse(res, 200, { message: SEARCH_MESSAGES.DATA_SYNC_SUCCESS });
  } catch (error) {
    const err = error instanceof DatabaseError ? error : new UnexpectedError();
    sendResponse(res, err.statusCode, { error: err.message });
  }
});

// 의약물 상세 데이터 동기화
router.post('/sync-approval', async (req, res) => {
  try {
    await syncApprovals();
    sendResponse(res, 200, { message: SEARCH_MESSAGES.APPROVAL_SYNC_SUCCESS });
  } catch (error) {
    const err = error instanceof DatabaseError ? error : new UnexpectedError();
    sendResponse(res, err.statusCode, { error: err.message });
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
    const err = error instanceof DatabaseError ? error : new UnexpectedError();
    sendResponse(res, err.statusCode, { error: err.message });
  }
});

// 검색 API
router.get('/search', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause = buildWhereClause(req.query);

    const totalCountPromise = Medicine.count({ where: whereClause });
    const dataPromise = Medicine.findAll({
      where: whereClause,
      include: [
        {
          model: MedicineDesc,
          required: false,
          attributes: ['itemSeq', 'itemName'],
        },
      ],
      limit: limitNumber,
      offset,
    });

    const [totalCount, data] = await Promise.all([totalCountPromise, dataPromise]);

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
    console.error('Search API Error:', error);
    const err = error instanceof ValidationError ? error : new UnexpectedError(error.message);
    sendResponse(res, err.statusCode, { error: err.message });
  }
});


// 특정 ITEM_SEQ 조인 데이터 조회
router.get('/:itemSeq', async (req, res) => {
  try {
    const { itemSeq } = req.params;
    const data = await getJoinedMedicines(itemSeq);

    if (!data) {
      throw new ValidationError(SEARCH_MESSAGES.NO_RESULT_DEDICINE);
    }

    sendResponse(res, 200, data);
  } catch (error) {
    const err = error instanceof ValidationError ? error : new UnexpectedError();
    sendResponse(res, err.statusCode, { error: err.message });
  }
});

export default router;
