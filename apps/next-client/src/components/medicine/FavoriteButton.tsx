'use client';

import React, { useEffect, useState } from 'react';
import { addFavoriteApi, checkFavoriteApi } from '@/utils/medicineFavorites';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { FavoriteButtonProps } from '@/dto/MedicineResultDto';
import Cookies from 'js-cookie';

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ medicineId, itemName, entpName, etcOtcName, className, itemImage }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const isFav = await checkFavoriteApi(medicineId);
      setIsFavorite(isFav);
    };

    checkFavoriteStatus();
  }, [medicineId]);

  const handleAddFavorite = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      alert(ALERT_MESSAGES.ERROR.FAVORITES.LOGIN_REQUIRED);
      return;
    }

    if (isFavorite) {
      alert(ALERT_MESSAGES.SUCCESS.FAVORITE.FAVORITE_ALREADY_ADDED);
      return;
    }

    try {
      const favoriteData = {
        medicineId,
        itemName,
        entpName,
        etcOtcName: etcOtcName ?? "",
        className: className ?? "",
        itemImage: itemImage ?? "",
      };

      await addFavoriteApi(favoriteData);
      setIsFavorite(true); 
      alert(ALERT_MESSAGES.SUCCESS.FAVORITE.FAVORITE_ADDED);
    } catch (error) {
      alert(ALERT_MESSAGES.ERROR.FAVORITE_ADD_ERROR);
    }
  };

  return (
    <button
      onClick={handleAddFavorite}
      className={`favorite_button ${isFavorite ? "active" : ""}`}
    >
      {isFavorite ? "⭐ 이미 추가됨" : "⭐ 즐겨찾기 추가"}
    </button>
  );
};