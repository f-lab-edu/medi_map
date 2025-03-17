'use client';

import React, { Suspense } from 'react';
import { useCheckFavorite, useAddFavorite } from '@/hooks/queries/useFavorite';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { FavoriteButtonProps } from '@/dto/MedicineResultDto';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const FavoriteButtonContent: React.FC<FavoriteButtonProps> = ({
  medicineId, itemName, entpName, etcOtcName, className, itemImage,
}) => {
  const { data: isFavorite } = useCheckFavorite(medicineId);
  const addFavoriteMutation = useAddFavorite();

  const handleAddFavorite = () => {
    if (isFavorite) {
      alert(ALERT_MESSAGES.SUCCESS.FAVORITE.FAVORITE_ALREADY_ADDED);
      return;
    }
  
    addFavoriteMutation.mutate({
      medicineId,
      itemName,
      entpName,
      etcOtcName: etcOtcName ?? "",
      className: className ?? "",
      itemImage: itemImage ?? "",
    });
  
    alert(ALERT_MESSAGES.SUCCESS.FAVORITE.FAVORITE_ADDED);
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

export const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => (
  <ErrorBoundary>
    <Suspense fallback={<button className="favorite_button">로딩 중...</button>}>
      <FavoriteButtonContent {...props} />
    </Suspense>
  </ErrorBoundary>
);