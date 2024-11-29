import express from 'express';
import { Op } from 'sequelize';
import { fetchAllMedicines, fetchApprovalInfo } from '@/services/medicineService';
import { Medicine } from '@/models';
import { SEARCH_MESSAGES } from '@/constants/search_messages';

const router = express.Router();

// 기본 데이터 저장
router.post('/sync', async (req, res) => {
  try {
    await fetchAllMedicines();
    res.status(200).json({ message: SEARCH_MESSAGES.DATA_SYNC_SUCCESS });
  } catch (error) {
    res.status(500).json({ error: SEARCH_MESSAGES.DATA_SYNC_ERROR, message: error.message });
  }
});

// 세부 정보 업데이트
router.post('/sync-approval', async (req, res) => {
  try {
    await fetchApprovalInfo();
    res.status(200).json({ message: SEARCH_MESSAGES.APPROVAL_SYNC_SUCCESS });
  } catch (error) {
    res.status(500).json({ error: SEARCH_MESSAGES.APPROVAL_SYNC_ERROR, message: error.message });
  }
});

// 전체 데이터 조회
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.findAll();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: SEARCH_MESSAGES.DATA_FETCH_ERROR, message: error.message });
  }
});

// 검색 API 추가 (/search)
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

    // 검색 조건
    const whereClause: any = {};

    // 검색 조건 추가
    if (medicineName) {
      whereClause.itemName = {
        [Op.iLike]: `%${medicineName}%`,
      };
    }

    // 회사명 검색
    if (companyName) {
      whereClause.entpName = {
        [Op.iLike]: `%${companyName}%`,
      };
    }

    // 색상 검색
    if (colorClass1) {
      const colors = colorClass1.split(',').map(c => c.trim());
      whereClause.colorClass1 = {
        [Op.or]: colors.map(color => ({
          [Op.iLike]: `%${color}%`,
        })),
      };
    }

    // 모양 검색
    if (drugShape) {
      const shapes = drugShape.split(',').map(s => s.trim());
      whereClause.drugShape = {
        [Op.or]: shapes.map(shape => ({
          [Op.iLike]: `%${shape}%`,
        })),
      };
    }

    // 제형 검색
    if (formCodeName) {
      const forms = formCodeName.split(',').map(f => f.trim());
      whereClause.formCodeName = {
        [Op.or]: forms.map(form => ({
          [Op.iLike]: `%${form}%`,
        })),
      };
    }

    const medicines = await Medicine.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset,
    });

    res.status(200).json({
      results: medicines.rows,
      total: medicines.count,
    });
  } catch (error) {
    console.error(SEARCH_MESSAGES.DATA_FETCH_ERROR, error);
    res.status(500).json({ error: SEARCH_MESSAGES.SEARCH_ERROR, message: error.message });
  }
});

// 특정 의약품 정보 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findOne({
      where: { itemSeq: id },
    });

    console.log('Fetched medicine:', medicine);

    if (!medicine) {
      return res.status(404).json({ error: SEARCH_MESSAGES.NO_RESULT_DEDICINE });
    }

    res.status(200).json(medicine);
  } catch (error) {
    console.error(SEARCH_MESSAGES.DATA_FETCH_ERROR, error);
    res.status(500).json({ error: SEARCH_MESSAGES.DATA_FETCH_ERROR, message: error.message });
  }
});

export default router;
