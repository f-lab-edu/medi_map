import { Response } from 'express';
import { Favorite } from '@/models';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

// 즐겨찾기 추가
export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // 사용자 ID 가져오기
    const userId = req.user?.id;
    if (!userId) {
      console.log('[AddFavorite] User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // 요청 본문 디버깅
    console.log('[AddFavorite] Request body:', req.body);

    // 요청 데이터 변수 추출
    const { medicine_id, item_name, entp_name, etc_otc_name, class_name } = req.body;

    // 매핑된 데이터 확인
    const mappedData = {
      user_id: userId,
      medicine_id,
      item_name,
      entp_name,
      etc_otc_name,
      class_name,
    };

    console.log('[AddFavorite] Mapped data for Favorite.create:', mappedData);

    // 데이터베이스 작업 실행
    const newFavorite = await Favorite.create(mappedData);

    console.log('[AddFavorite] Successfully added favorite:', newFavorite);

    return res.status(201).json(newFavorite);
  } catch (error) {
    console.error('[AddFavorite] Error adding favorite:', error);
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// 즐겨찾기 조회
export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // 사용자 ID 가져오기
    const userId = req.user?.id;
    if (!userId) {
      console.log('[GetFavorites] User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('[GetFavorites] Fetching favorites for user_id:', userId);

    // 데이터베이스에서 즐겨찾기 조회
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      attributes: ['item_name', 'entp_name', 'etc_otc_name', 'class_name', 'medicine_id'],
    });

    console.log('[GetFavorites] Retrieved favorites:', favorites);

    return res.status(200).json(favorites);
  } catch (error) {
    console.error('[GetFavorites] Error fetching favorites:', error);
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
