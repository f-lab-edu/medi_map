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
      <h2 className='title'>의약품 상세정보</h2>
      {medicine && (
        <div className="medi_desc">
          {medicine.ITEM_IMAGE && (
            <Image
              src={medicine.ITEM_IMAGE}
              alt={medicine.ITEM_NAME}
              width={500}
              height={500}
            />
          )}
          <div className="details">
            <h3 className='name'>{medicine.ITEM_NAME}</h3>
            <p className='classification'>분류: {medicine.CLASS_NAME}</p>
            <p className='manufacturer'>제조사: {medicine.ENTP_NAME}</p> 
          </div>
        </div>
      )}

      <Link href='/search' className='back_btn'>뒤로가기</Link>
    </div>
  );
}
