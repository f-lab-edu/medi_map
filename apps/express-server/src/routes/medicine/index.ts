import express from 'express';
import { Op } from 'sequelize';
import { fetchAndSaveAllMedicines, fetchAndUpdateApprovalInfo } from '@/services/medicineService';
import { Medicine } from '@/models';

const router = express.Router();

// 기본 데이터 저장
router.post('/sync', async (req, res) => {
  try {
    await fetchAndSaveAllMedicines();
    res.status(200).json({ message: '기본 데이터 동기화 완료' });
  } catch (error) {
    res.status(500).json({ error: '기본 데이터 동기화 중 오류 발생', message: error.message });
  }
});

// 세부 정보 업데이트
router.post('/sync-approval', async (req, res) => {
  try {
    await fetchAndUpdateApprovalInfo();
    res.status(200).json({ message: '세부 정보 업데이트 완료' });
  } catch (error) {
    res.status(500).json({ error: '세부 정보 업데이트 중 오류 발생', message: error.message });
  }
});

// 전체 데이터 조회
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.findAll();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ error: '데이터 조회 중 오류 발생', message: error.message });
  }
});

// 검색 API 추가 (/search)
router.get('/search', async (req, res) => {
  try {
    const name = req.query.name as string;
    const pageNumber = parseInt(req.query.page as string, 10) || 1;
    const limitNumber = parseInt(req.query.limit as string, 10) || 10;

    const offset = (pageNumber - 1) * limitNumber;

    const medicines = await Medicine.findAndCountAll({
      where: {
        itemName: {
          [Op.iLike]: `%${name}%`, // 대소문자 구분 없는 검색
        },
      },
      limit: limitNumber,
      offset,
    });

    res.status(200).json({
      results: medicines.rows,
      total: medicines.count,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: '검색 중 오류 발생', message: error.message });
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
      return res.status(404).json({ error: '해당 의약품 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json(medicine);
  } catch (error) {
    console.error('Error fetching medicine data:', error);
    res.status(500).json({ error: '데이터 조회 중 오류 발생', message: error.message });
  }
});

export default router;
