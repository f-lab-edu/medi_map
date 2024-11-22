import { Router } from 'express';
import { updatePharmacyData } from '@/services/pharmacyService';
import { Pharmacy } from '@/models';
import { ValidationError, DatabaseError, UpdateError, UnexpectedError } from '@/error/PharmacyError';
import { ERROR_MESSAGES } from '@/constants/errors';
import { PharmacyItem } from '@/types/pharmacy.types';

const router = Router();

const EARTH_RADIUS = 6371e3; // 지구 반지름 (미터)
const DEFAULT_RADIUS = 2500; // 기본 반경 (미터)

// 유틸리티 함수: 거리 계산
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a
    = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;

  return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// 유틸리티 함수: 반경 내 확인
const isWithinRadius = (originLat: number, originLng: number, targetLat: number, targetLng: number, radius: number = DEFAULT_RADIUS): boolean => {
  return calculateDistance(originLat, originLng, targetLat, targetLng) <= radius;
};

// 약국 데이터를 가져오는 엔드포인트
router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  try {
    if (!lat || !lng) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION_ERROR);
    }

    const centerLat = parseFloat(lat as string);
    const centerLng = parseFloat(lng as string);

    // 데이터베이스에서 모든 약국 데이터 조회
    let pharmacies;
    try {
      pharmacies = await Pharmacy.findAll();
    } catch (error) {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }

    // 반경 내 약국 필터링
    const filteredPharmacies = pharmacies.filter((pharmacy: PharmacyItem) =>
      isWithinRadius(centerLat, centerLng, pharmacy.wgs84Lat, pharmacy.wgs84Lon));

    return res.status(200).json(filteredPharmacies);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    if (error instanceof DatabaseError) {
      return res.status(500).json({ error: error.message });
    }

    console.error(`Unexpected error: ${error.message}`);
    const unexpectedError = new UnexpectedError();
    return res.status(500).json({ error: unexpectedError.message });
  }
});

// 약국 데이터를 업데이트하는 엔드포인트
router.post('/update-pharmacy', async (req, res) => {
  try {
    try {
      await updatePharmacyData();
    } catch (error) {
      throw new UpdateError(ERROR_MESSAGES.PHARMACY_DATA_ERROR);
    }

    return res.status(200).json({ message: 'Pharmacy data updated successfully!' });
  } catch (error) {
    if (error instanceof UpdateError) {
      return res.status(500).json({ error: error.message });
    }

    console.error(`Unexpected error: ${error.message}`);
    const unexpectedError = new UnexpectedError();
    return res.status(500).json({ error: unexpectedError.message });
  }
});

export default router;
