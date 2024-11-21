import { Router } from 'express';
import { updatePharmacyData } from '@/services/pharmacyService';
import { Pharmacy } from '@/models';

const router = Router();

// 거리 계산 함수 (Haversine 공식 사용)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const earthRadius = 6371e3;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a
    = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 반경 필터링 함수
function isWithinRadius(lat1: number, lng1: number, lat2: number, lng2: number, radius: number): boolean {
  return getDistance(lat1, lng1, lat2, lng2) <= radius;
}

// 약국 데이터를 가져오는 엔드포인트
router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const centerLat = parseFloat(lat as string);
    const centerLng = parseFloat(lng as string);
    const radius = 2500; // 반경 2.5km

    // 데이터베이스에서 모든 약국 데이터 조회
    const pharmacies = await Pharmacy.findAll();

    // 거리 필터링을 통해 반경 내 약국 데이터만 반환
    const filteredPharmacies = pharmacies.filter((pharmacy: any) =>
      isWithinRadius(centerLat, centerLng, pharmacy.wgs84Lat, pharmacy.wgs84Lon, radius));

    res.status(200).json(filteredPharmacies); // 필터링된 데이터 반환
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json({ error: 'Failed to fetch pharmacy data.' });
  }
});

// 약국 데이터를 업데이트하는 엔드포인트
router.post('/update-pharmacy', async (req, res) => {
  try {
    await updatePharmacyData();
    res.status(200).json({ message: 'Pharmacy data updated successfully!' });
  } catch (error) {
    console.error('Error updating pharmacies:', error);
    res.status(500).json({ error: 'Failed to update pharmacy data.' });
  }
});

export default router;
