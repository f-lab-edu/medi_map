'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMedicineDetail } from '@/hooks/medicineDetail/useMedicineDetail';
import MedicineInfo from '@/components/medicineDetail/MedicineInfo';
import MedicineDetailTable from '@/components/medicineDetail/MedicineDetailTable';
import MedicineDetailTabs from '@/components/medicineDetail/MedicineDetailTabs';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { addFavoriteApi } from '@/utils/medicineFavorites';
import { handleApiError } from '@/utils/handleApiError';
import '@/styles/pages/search/search.scss';

export default function MedicineDetailPage() {
  const { medicine, loading, error, isFavorite, setIsFavorite } = useMedicineDetail();
  const [activeTab, setActiveTab] = useState<"all" | "efficacy" | "dosage" | "precautions">("all");

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="error_message">{error}</p>;
  if (!medicine) return <p className="error_message">의약품 정보를 찾을 수 없습니다.</p>;

  // 즐겨찾기 추가 함수
  const handleAddFavorite = async () => {
    if (!medicine || isFavorite) {
      alert(isFavorite ? "이미 즐겨찾기에 추가되었습니다." : "의약품 정보가 없습니다.");
      return;
    }

    try {
      const favoriteData = {
        medicineId: medicine.itemSeq,
        itemName: medicine.itemName,
        entpName: medicine.entpName,
        etcOtcName: medicine.etcOtcName ?? "",
        className: medicine.className ?? "",
        itemImage: medicine.itemImage ?? "",
      };

      await addFavoriteApi(favoriteData);
      setIsFavorite(true);
      alert("즐겨찾기에 추가되었습니다!");
    } catch (error) {
      alert(handleApiError(error, "즐겨찾기 추가에 실패했습니다."));
    }
  };

  const tabContents = [
    { key: "efficacy", docData: medicine.eeDocData, sectionTitle: "효능효과" },
    { key: "dosage", docData: medicine.udDocData, sectionTitle: "용법용량" },
    { key: "precautions", docData: medicine.nbDocData, sectionTitle: "주의사항" },
  ];

  return (
    <div className="medi_search_result">
      <h2 className="title">의약품 상세정보</h2>

      <div className="medi_bottom_result">
        {/* 의약품 제목 및 즐겨찾기 버튼 */}
        <div className="top_cont">
          <h3 className="name">{medicine.itemName}</h3>
          <div className="bookmark">
            <button
              onClick={handleAddFavorite}
              className={`favorite_button ${isFavorite ? "active" : ""}`}
            >
              {isFavorite ? "⭐ 이미 추가됨" : "⭐ 즐겨찾기 추가"}
            </button>
          </div>
        </div>

        {/* 의약품 이미지 및 상세 테이블 */}
        <div className="medi_desc">
          {medicine.itemImage && (
            <Image
              src={medicine.itemImage}
              alt={medicine.itemName}
              width={500}
              height={280}
            />
          )}
          <MedicineDetailTable medicine={medicine} />
        </div>

        {/* 탭 UI */}
        <MedicineDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 선택된 탭에 따른 정보 표시 */}
        {(
          activeTab === "all" ? tabContents : tabContents.filter(tab => tab.key === activeTab)
        ).map(({ key, docData, sectionTitle }) => (
          <MedicineInfo key={key} docData={docData} sectionTitle={sectionTitle} />
        ))}
      </div>

      <Link href="/search" className="back_btn">뒤로가기</Link>
      <ScrollToTopButton offset={200} />
    </div>
  );
}