"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { MedicineResultDto } from '@/dto/MedicineResultDto';
import '@/styles/pages/search/search.scss';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';

export default function MedicineDetailPage() {
  const { id } = useParams(); 
  const [medicine, setMedicine] = useState<MedicineResultDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) { 
      axios.get(`/api/medicine/${id}`)
        .then(response => {
          setMedicine(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(SEARCH_ERROR_MESSAGES.NO_MEDICINE_FOUND);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="error_message">{error}</p>;

  return (
    <div className="medicine_search_result">
      <h2 className="title">의약품 상세정보</h2>

      {medicine && (
        <div>
          <h3 className="name">{medicine.ITEM_NAME}</h3>
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
                    <th className="classification_label">분류</th>
                    <td className="classification_value">{medicine.CLASS_NAME}</td>
                  </tr>
                  <tr>
                    <th className="chart_label">외형</th>
                    <td className="chart_value">{medicine.CHART}</td>
                  </tr>
                  <tr>
                    <th className="manufacturer_label">제조사</th>
                    <td className="manufacturer_value">{medicine.ENTP_NAME}</td>
                  </tr>
                  <tr>
                    <th className="shape_label">모양</th>
                    <td className="shape_value">{medicine.DRUG_SHAPE}</td>
                  </tr>
                  <tr>
                    <th className="color_label">색상</th>
                    <td className="color_value">
                      {medicine.COLOR_CLASS1}
                      {medicine.COLOR_CLASS2 ? ` / ${medicine.COLOR_CLASS2}` : ''}
                    </td>
                  </tr>
                  <tr>
                    <th className="size_label">크기 (길이 x 폭 x 두께)</th>
                    <td className="size_value">
                      {medicine.LENG_LONG} mm x {medicine.LENG_SHORT} mm x {medicine.THICK} mm
                    </td>
                  </tr>
                  <tr>
                    <th className="print_front_label">앞면 인쇄 코드</th>
                    <td className="print_front_value">{medicine.PRINT_FRONT || '없음'}</td>
                  </tr>
                  <tr>
                    <th className="print_back_label">뒷면 인쇄 코드</th>
                    <td className="print_back_value">{medicine.PRINT_BACK || '없음'}</td>
                  </tr>
                  <tr>
                    <th className="etc_otc_label">전문/일반 구분</th>
                    <td className="etc_otc_value">{medicine.ETC_OTC_NAME}</td>
                  </tr>
                  <tr>
                    <th className="permit_date_label">허가 날짜</th>
                    <td className="permit_date_value">{medicine.ITEM_PERMIT_DATE}</td>
                  </tr>
                  <tr>
                    <th className="form_code_label">제형 코드</th>
                    <td className="form_code_value">{medicine.FORM_CODE_NAME}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Link href="/search" className="back_btn">뒤로가기</Link>
    </div>
  );
}