import express from 'express';
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

export default router;
