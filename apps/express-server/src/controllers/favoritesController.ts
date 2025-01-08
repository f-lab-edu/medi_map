import { Response } from 'express';
import { Favorite } from '@/models';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

// 즐겨찾기 추가
export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { medicineId, itemName, entpName, etcOtcName, className, itemImage } = req.body;

    console.log('req.body', req.body);

    const mappedData = {
      userId,
      medicineId,
      itemName,
      entpName,
      etcOtcName,
      className,
      itemImage
    };

    const newFavorite = await Favorite.create(mappedData);

    return res.status(201).json(newFavorite);
  } catch (error) {
    console.error('[AddFavorite] Error adding favorite:', error);
    return res.status(500).json({ error: 'Failed to add favorite' });
  }
};

// 즐겨찾기 조회
export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const favorites = await Favorite.findAll({
      where: { userId },
      attributes: ['itemName', 'entpName', 'etcOtcName', 'className', 'medicineId', 'itemImage'],
    });

    return res.status(200).json(favorites);
  } catch (error) {
    console.error('[GetFavorites] Error fetching favorites:', error);
    return res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

// 즐겨찾기 삭제
export const removeFavorite = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { medicineId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId, medicineId },
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await favorite.destroy();

    return res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('[RemoveFavorite] Error removing favorite:', error);
    return res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
