import express from 'express';
import { syncMedicines, syncApprovals, getJoinedMedicines, getAllMedicines } from '@/services/medicineService';
import { Medicine, MedicineDesc } from '@/models';
import { Op, WhereOptions } from 'sequelize';
import { sendResponse } from '@/utils/medicineUtils';
import { SEARCH_MESSAGES } from '@/constants/search_messages';

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

// 특정 ITEM_SEQ 조인 데이터 조회
router.get('/join/:itemSeq', async (req, res) => {
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

// 검색 API
router.get('/search', async (req, res) => {
  try {
    const medicineName = req.query.medicineName as string;
    const companyName = req.query.companyName as string;
    const colorClass1 = req.query.color as string;
    const drugShape = req.query.shape as string;
    const formCodeName = req.query.formCodeName as string;

    const pageNumber = parseInt(req.query.page as string, 10) || 1;
    const limitNumber = parseInt(req.query.limit as string, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause: WhereOptions = {};

    if (medicineName) {
      whereClause.itemName = { [Op.iLike]: `%${medicineName}%` };
    }
    if (companyName) {
      whereClause.entpName = { [Op.iLike]: `%${companyName}%` };
    }
    if (colorClass1) {
      const colors = colorClass1.split(',').map(c => c.trim());
      whereClause.colorClass1 = { [Op.or]: colors.map(color => ({ [Op.iLike]: `%${color}%` })) };
    }
    if (drugShape) {
      const shapes = drugShape.split(',').map(s => s.trim());
      whereClause.drugShape = { [Op.or]: shapes.map(shape => ({ [Op.iLike]: `%${shape}%` })) };
    }
    if (formCodeName) {
      const forms = formCodeName.split(',').map(f => f.trim());
      whereClause.formCodeName = { [Op.or]: forms.map(form => ({ [Op.iLike]: `%${form}%` })) };
    }

    const medicines = await Medicine.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: MedicineDesc,
          required: false,
        },
      ],
      limit: limitNumber,
      offset,
    });

    sendResponse(res, 200, {
      results: medicines.rows,
      total: medicines.count,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(medicines.count / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    sendResponse(res, 500, { error: SEARCH_MESSAGES.SEARCH_ERROR, message: (error as Error).message });
  }
});

// 특정 itemSeq 단일 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findOne({
      where: { itemSeq: id },
      include: [
        {
          model: MedicineDesc,
          required: false,
        },
      ],
    });

    if (!medicine) {
      return sendResponse(res, 404, { error: SEARCH_MESSAGES.NO_RESULT_DEDICINE });
    }

    sendResponse(res, 200, medicine);
  } catch (error) {
    sendResponse(res, 500, { error: SEARCH_MESSAGES.DATA_FETCH_ERROR, message: (error as Error).message });
  }
});

export default router;
