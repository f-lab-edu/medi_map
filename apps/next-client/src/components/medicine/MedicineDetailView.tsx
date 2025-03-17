'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMedicineDetails } from '@/hooks/useMedicineDetails';
import '@/styles/pages/search/search.scss';
import MedicineInfo from '@/components/medicineDetail/MedicineInfo';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { FavoriteButton } from '@/components/medicine/FavoriteButton';
import { MedicineDetailViewProps } from '@/dto/MedicineResultDto';

const DEFAULT_IMAGE_PATH = "/images/not-image.png";

const Tabs = {
  All: "all",
  Efficacy: "efficacy",
  Dosage: "dosage",
  Precautions: "precautions",
} as const;

type Tab = typeof Tabs[keyof typeof Tabs];

const MedicineDetailView: React.FC<MedicineDetailViewProps> = ({ medicineId }) => {
  const { data: medicine } = useMedicineDetails(medicineId);
  const [activeTab, setActiveTab] = useState<Tab>(Tabs.All);
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    setHasImageError(true);
  };

  return (
    <div className="medi_search_result">
      <h2 className="title">의약품 상세정보</h2>
      {medicine && (
        <div className="medi_bottom_result">
          <div className="top_cont">
            <h3 className="name">{medicine.itemName || "이름 정보 없음"}</h3>
            <div className="bookmark">
              <FavoriteButton
                medicineId={medicine.itemSeq}
                itemName={medicine.itemName}
                entpName={medicine.entpName}
                etcOtcName={medicine.etcOtcName}
                className={medicine.className}
                itemImage={medicine.itemImage}
              />
            </div>
          </div>

          <div className="medi_desc">
            <Image
              src={hasImageError || !medicine.itemImage ? DEFAULT_IMAGE_PATH : medicine.itemImage}
              alt={medicine.itemName || "약품 이미지"}
              width={500}
              height={280}
              onError={handleImageError}
              unoptimized={hasImageError || !medicine.itemImage}
            />

            <div className="details">
              <table className="medicine_table">
                <tbody>
                  <tr>
                    <th>분류</th>
                    <td>{medicine.className || "정보 없음"}</td>
                  </tr>
                  <tr>
                    <th>외형</th>
                    <td>{medicine.chart || "정보 없음"}</td>
                  </tr>
                  <tr>
                    <th>제조사</th>
                    <td>{medicine.entpName || "정보 없음"}</td>
                  </tr>
                  <tr>
                    <th>크기</th>
                    <td>
                      {medicine.lengLong 
                        ? `${medicine.lengLong} mm x ${medicine.lengShort || 0} mm x ${medicine.thick || 0} mm`
                        : "정보 없음"}
                    </td>
                  </tr>
                  <tr>
                    <th>제형</th>
                    <td>{medicine.formCodeName || "정보 없음"}</td>
                  </tr>
                  <tr>
                    <th>모양</th>
                    <td>{medicine.drugShape || "정보 없음"}</td>
                  </tr>
                  <tr>
                    <th>색상</th>
                    <td>{medicine.colorClass1 || "정보 없음"}</td>
                  </tr>
                  {medicine.storageMethod && (
                    <tr>
                      <th>저장 방법</th>
                      <td>{medicine.storageMethod}</td>
                    </tr>
                  )}
                  {medicine.validTerm && (
                    <tr>
                      <th>유효기간</th>
                      <td>{medicine.validTerm}</td>
                    </tr>
                  )}
                  {medicine.packUnit && (
                    <tr>
                      <th>포장 단위</th>
                      <td>{medicine.packUnit}</td>
                    </tr>
                  )}
                  {medicine.meterialName && (
                    <tr>
                      <th>재료명</th>
                      <td>{medicine.meterialName}</td>
                    </tr>
                  )}
                  <tr>
                    <th>전문/일반 구분</th>
                    <td>{medicine.etcOtcName || "정보 없음"}</td>
                  </tr>
                  <tr>
                    <th>허가 날짜</th>
                    <td>
                      {medicine.itemPermitDate
                        ? new Date(medicine.itemPermitDate).toISOString().split("T")[0]
                        : "정보 없음"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <ul className="tab_menu">
            <li
              className={`tab_item all ${activeTab === Tabs.All ? "active" : ""}`}
              onClick={() => setActiveTab(Tabs.All)}
            >
              전체
            </li>
            <li
              className={`tab_item efficacy ${activeTab === Tabs.Efficacy ? "active" : ""}`}
              onClick={() => setActiveTab(Tabs.Efficacy)}
            >
              효능효과
            </li>
            <li
              className={`tab_item dosage ${activeTab === Tabs.Dosage ? "active" : ""}`}
              onClick={() => setActiveTab(Tabs.Dosage)}
            >
              용법용량
            </li>
            <li
              className={`tab_item precautions ${activeTab === Tabs.Precautions ? "active" : ""}`}
              onClick={() => setActiveTab(Tabs.Precautions)}
            >
              주의사항
            </li>
          </ul>

          {activeTab === Tabs.All && (
            <>
              <MedicineInfo docData={medicine.eeDocData} sectionTitle="효능효과" />
              <MedicineInfo docData={medicine.udDocData} sectionTitle="용법용량" />
              <MedicineInfo docData={medicine.nbDocData} sectionTitle="주의사항" />
            </>
          )}
          {activeTab === Tabs.Efficacy && (
            <MedicineInfo docData={medicine.eeDocData} sectionTitle="효능효과" />
          )}
          {activeTab === Tabs.Dosage && (
            <MedicineInfo docData={medicine.udDocData} sectionTitle="용법용량" />
          )}
          {activeTab === Tabs.Precautions && (
            <MedicineInfo docData={medicine.nbDocData} sectionTitle="주의사항" />
          )}
        </div>
      )}
      <Link href="/search" className="back_btn">
        뒤로가기
      </Link>
      <ScrollToTopButton offset={200} />
    </div>
  );
};

export default MedicineDetailView;