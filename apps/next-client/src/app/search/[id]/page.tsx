"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { MedicineResultDto } from '@/dto/MedicineResultDto';
import MedicineInfo from '@/components/medicineDetail/MedicineInfo';
import '@/styles/pages/search/search.scss';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';

export default function MedicineDetailPage() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState<MedicineResultDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'efficacy' | 'dosage' | 'precautions'>('all');

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`/api/medicine/${id}`);
        setMedicine(response.data);
      } catch {
        setError(SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="error_message">{error}</p>;

  return (
    <div className="medi_search_result">
      <h2 className="title">의약품 상세정보</h2>

      {medicine && (
        <div className="medi_bottom_result">
          <h3 className="name">{medicine.ITEM_NAME} {medicine.ITEM_ENG_NAME}</h3>
          <div className="medi_desc">
            {medicine.ITEM_IMAGE && (
              <Image
                src={medicine.ITEM_IMAGE}
                alt={medicine.ITEM_NAME}
                width={500}
                height={280}
              />
            )}

            <div className="details">
              <table className="medicine_table">
                <tbody>
                  <tr>
                    <th>분류</th>
                    <td>{medicine.CLASS_NAME}</td>
                  </tr>
                  <tr>
                    <th>외형</th>
                    <td>{medicine.CHART}</td>
                  </tr>
                  <tr>
                    <th>제조사</th>
                    <td>{medicine.ENTP_NAME}</td>
                  </tr>
                  <tr>
                    <th>크기</th>
                    <td>{medicine.LENG_LONG} mm x {medicine.LENG_SHORT} mm x {medicine.THICK} mm</td>
                  </tr>
                  <tr>
                    <th>제형</th>
                    <td>{medicine.FORM_CODE_NAME}</td>
                  </tr>
                  <tr>
                    <th>모양</th>
                    <td>{medicine.DRUG_SHAPE}</td>
                  </tr>
                  <tr>
                    <th>색상</th>
                    <td>{medicine.COLOR_CLASS1}</td>
                  </tr>
                  {medicine.approvalInfo?.STORAGE_METHOD && (
                    <tr>
                      <th>저장 방법</th>
                      <td>{medicine.approvalInfo.STORAGE_METHOD}</td>
                    </tr>
                  )}
                  {medicine.approvalInfo?.VALID_TERM && (
                    <tr>
                      <th>유효기간</th>
                      <td>{medicine.approvalInfo.VALID_TERM}</td>
                    </tr>
                  )}
                  {medicine.approvalInfo?.PACK_UNIT && (
                    <tr>
                      <th>포장 단위</th>
                      <td>{medicine.approvalInfo.PACK_UNIT}</td>
                    </tr>
                  )}
                  <tr>
                    <th>전문/일반 구분</th>
                    <td>{medicine.ETC_OTC_NAME}</td>
                  </tr>
                  <tr>
                    <th>허가 날짜</th>
                    <td>{medicine.ITEM_PERMIT_DATE}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <ul className="tab_menu">
            <li
              className={`tab_item all ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체
            </li>
            <li
              className={`tab_item efficacy ${activeTab === 'efficacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('efficacy')}
            >
              효능효과
            </li>
            <li
              className={`tab_item dosage ${activeTab === 'dosage' ? 'active' : ''}`}
              onClick={() => setActiveTab('dosage')}
            >
              용법용량
            </li>
            <li
              className={`tab_item precautions ${activeTab === 'precautions' ? 'active' : ''}`}
              onClick={() => setActiveTab('precautions')}
            >
              주의사항
            </li>
          </ul>

          {activeTab === 'all' && (
            <>
              <MedicineInfo docData={medicine.approvalInfo?.EE_DOC_DATA} sectionTitle="효능 효과" />
              <MedicineInfo docData={medicine.approvalInfo?.UD_DOC_DATA} sectionTitle="사용상 주의사항" />
              <MedicineInfo docData={medicine.approvalInfo?.NB_DOC_DATA} sectionTitle="주의사항" />
            </>
          )}
          {activeTab === 'efficacy' && (
            <MedicineInfo docData={medicine.approvalInfo?.EE_DOC_DATA} sectionTitle="효능 효과" />
          )}
          {activeTab === 'dosage' && (
            <MedicineInfo docData={medicine.approvalInfo?.UD_DOC_DATA} sectionTitle="사용상 주의사항" />
          )}
          {activeTab === 'precautions' && (
            <MedicineInfo docData={medicine.approvalInfo?.NB_DOC_DATA} sectionTitle="주의사항" />
          )}
        </div>
      )}

      <Link href="/search" className="back_btn">뒤로가기</Link>
    </div>
  );
}