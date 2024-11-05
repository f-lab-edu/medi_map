export interface MedicineResultDto {
  ITEM_SEQ: number;             // 약물 고유 식별 번호
  ITEM_NAME: string;            // 약물 이름
  ITEM_IMAGE?: string;          // 약물 이미지 URL
  CLASS_NAME: string;           // 약물 분류 이름
  ENTP_NAME: string;            // 제조사 이름
  ETC_OTC_NAME?: string;        // 전문의약품/일반의약품 구분
}
