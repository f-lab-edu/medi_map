import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { useFavorites, useDeleteFavorite } from '@/hooks/queries/useFavorite';

const DEFAULT_IMAGE_PATH = "/images/not-image.png";

export function UserBookmarkContent() {
  const { data: favorites } = useFavorites();
  const deleteFavoriteMutation = useDeleteFavorite();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (medicineId: string) => {
    setImageErrors((prev) => ({ ...prev, [medicineId]: true }));
  };

  const handleDeleteFavorite = async (medicineId: string) => {
    if (window.confirm(ALERT_MESSAGES.CONFIRM.DELETE_FAVORITE)) {
      try {
        await deleteFavoriteMutation.mutateAsync(medicineId);
        alert(ALERT_MESSAGES.SUCCESS.FAVORITE.FAVORITE_DELETE);
      } catch (error) {
        console.error("Error deleting favorite:", error);
        alert(ALERT_MESSAGES.ERROR.FAVORITES.FAVORITE_DELETE);
      }
    }
  };

  return (
    <div className="user_bookmark">
      <h2 className="title">약물 정보 즐겨찾기</h2>
      {(favorites ?? []).length > 0 ? (
        <ul className="medicine_results">
          {(favorites ?? []).map((item) => {
            const imageHasError = imageErrors[item.medicineId];

            return (
              <li className="medicine_desc" key={item.medicineId}>
                <Link href={`/search/${item.medicineId}`} passHref>
                  <Image
                    src={imageHasError || !item.itemImage ? DEFAULT_IMAGE_PATH : item.itemImage}
                    alt={item.itemName || "약품 이미지"}
                    width={100}
                    height={50}
                    onError={() => handleImageError(item.medicineId)}
                    unoptimized={imageHasError || !item.itemImage}
                  />
                  <div className="medicine_info">
                    <h3 className="name">{item.itemName}</h3>
                    <div className="details">
                      <p className="classification">
                        약물 분류: {item.className || "정보 없음"}
                      </p>
                      <p className="type">
                        전문/일반 구분: {item.etcOtcName || "정보 없음"}
                      </p>
                      <p className="manufacturer">제조사: {item.entpName || "정보 없음"}</p>
                    </div>
                  </div>
                </Link>
                <button
                  className="delete_button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleDeleteFavorite(item.medicineId);
                  }}
                >
                  삭제
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>즐겨찾기한 약물이 없습니다.</p>
      )}
    </div>
  );
} 