import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { axiosInstance } from '@/services/axiosInstance';
import { API_URLS } from '@/constants/urls';
import { getAuthHeader } from '@/utils/authUtils';
import { ALERT_MESSAGES } from '@/constants/alertMessage';
import { MedicineFavorite } from '@/types/medicine.types';

const DEFAULT_IMAGE_PATH = "/images/not-image.png";

export default function UserBookmark() {
  const [favorites, setFavorites] = useState<MedicineFavorite[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (medicineId: string) => {
    setImageErrors((prev) => ({ ...prev, [medicineId]: true }));
  };

  // 즐겨찾기 데이터 가져오기
  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(API_URLS.FAVORITES, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      setFavorites(response.data.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      alert(ALERT_MESSAGES.ERROR.FAVORITES.FAVORITES_FETCH);
    }
  };

  // 즐겨찾기 삭제 API
  const deleteFavoriteApi = async (medicineId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`${API_URLS.FAVORITES}/${medicineId}`, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error deleting favorite:", error);
      alert(ALERT_MESSAGES.ERROR.FAVORITES.FAVORITE_DELETE);
    }
  };

  // 즐겨찾기 삭제 버튼 핸들러
  const handleDeleteFavorite = async (medicineId: string) => {
    if (window.confirm(ALERT_MESSAGES.CONFIRM.DELETE_FAVORITE)) {
      try {
        await deleteFavoriteApi(medicineId);
        alert(ALERT_MESSAGES.SUCCESS.FAVORITE.FAVORITE_DELETE);

        // 삭제 후 상태 업데이트
        setFavorites((prev) => prev.filter((item) => item.medicineId !== medicineId));
      } catch (error) {
        console.error("Error deleting favorite:", error);
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="user_bookmark">
      <h2 className="title">약물 정보 즐겨찾기</h2>
      {favorites.length > 0 ? (
        <ul className="medicine_results">
          {favorites.map((item) => {
            const imageHasError = imageErrors[item.medicineId];
            const imageToShow = imageHasError || !item.itemImage ? DEFAULT_IMAGE_PATH : item.itemImage;

            return (
              <li className="medicine_desc" key={item.medicineId}>
                <Link href={`/search/${item.medicineId}`} passHref>
                  <Image
                    src={imageToShow}
                    alt={item.itemName || "약품 이미지"}
                    width={100}
                    height={50}
                    onError={() => handleImageError(item.medicineId)}
                    unoptimized={imageHasError}
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