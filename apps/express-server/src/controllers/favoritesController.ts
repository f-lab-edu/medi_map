import { Response } from 'express';
import { Favorite } from '@/models';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';
import { ERROR_MESSAGES } from '@/constants/errors';
import { FAVORITE_MESSAGES } from '@/constants/favorites_message';

// 즐겨찾기 추가
export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: ERROR_MESSAGES.AUTHENTICATION_ERROR });
    }

    const { medicineId, itemName, entpName, etcOtcName, className, itemImage } = req.body;

    const existingFavorite = await Favorite.findOne({
      where: { userId, medicineId },
    });

    if (existingFavorite) {
      return res.status(409).json({ message: FAVORITE_MESSAGES.ALREADY_EXISTS });
    }

    const mappedData = {
      userId,
      medicineId,
      itemName,
      entpName,
      etcOtcName,
      className,
      itemImage,
    };

    const newFavorite = await Favorite.create(mappedData);
    return res.status(201).json({ message: FAVORITE_MESSAGES.ADD_SUCCESS, data: newFavorite });
  } catch (error) {
    console.error('[AddFavorite] Error adding favorite:', error);
    return res.status(500).json({ error: FAVORITE_MESSAGES.ADD_FAILURE });
  }
};

// 특정 user의 전체 즐겨찾기 조회
export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: ERROR_MESSAGES.AUTHENTICATION_ERROR });
    }

    const favorites = await Favorite.findAll({
      where: { userId },
      attributes: ['itemName', 'entpName', 'etcOtcName', 'className', 'medicineId', 'itemImage'],
    });

    return res.status(200).json({ message: FAVORITE_MESSAGES.FETCH_SUCCESS, data: favorites });
  } catch (error) {
    console.error('[GetFavorites] Error fetching favorites:', error);
    return res.status(500).json({ error: FAVORITE_MESSAGES.FETCH_FAILURE });
  }
};

// 특정 의약품이 즐겨찾기에 있는지 여부 확인
export const getFavoriteStatus = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: ERROR_MESSAGES.AUTHENTICATION_ERROR });
    }

    const { medicineId } = req.params;

    const favorite = await Favorite.findOne({
      where: { userId, medicineId },
    });

    if (favorite) {
      return res.status(200).json({ isFavorite: true });
    } else {
      return res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.error('[getFavoriteStatus] Error fetching favorite status:', error);
    return res.status(500).json({ error: FAVORITE_MESSAGES.STATUS_FETCH_ERROR });
  }
};

// 즐겨찾기 삭제
export const removeFavorite = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: ERROR_MESSAGES.AUTHENTICATION_ERROR });
    }

    const { medicineId } = req.params;
    const favorite = await Favorite.findOne({
      where: { userId, medicineId },
    });

    if (!favorite) {
      return res.status(404).json({ message: FAVORITE_MESSAGES.NOT_FOUND });
    }

    await favorite.destroy();
    return res.status(200).json({ message: FAVORITE_MESSAGES.REMOVE_SUCCESS });
  } catch (error) {
    console.error('[RemoveFavorite] Error removing favorite:', error);
    return res.status(500).json({ error: FAVORITE_MESSAGES.REMOVE_FAILURE });
  }
};
