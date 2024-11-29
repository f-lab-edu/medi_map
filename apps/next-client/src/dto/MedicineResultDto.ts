export interface Paragraph {
  cdata?: string;
  text?: string;
  "#text"?: string;
  tagName?: string;
  "@_tagName"?: string;
}

export interface Article {
  "@_title"?: string;
  PARAGRAPH?: Paragraph | Paragraph[];
}

export interface Section {
  ARTICLE?: Article | Article[];
}

export interface Doc {
  "@_title"?: string;
  SECTION?: Section;
}

export interface DocData {
  DOC?: Doc;
}

export interface MedicineInfoProps {
  docData?: string; 
  sectionTitle: string;
}

export interface MedicineResultDto {
  id: number;               // 고유 ID
  itemSeq: string;          // 약물 고유 식별 번호
  itemName: string;         // 약물 이름
  entpName: string;         // 제조사 이름
  itemPermitDate?: string;  // 허가 날짜
  chart?: string;           // 약물 외형 설명
  colorClass1?: string;     // 약물 색상1
  className?: string;       // 약물 분류 이름
  etcOtcName?: string;      // 전문/일반 구분
  itemImage?: string;       // 약물 이미지 URL
  formCodeName?: string;    // 제형 코드 이름
  drugShape?: string;       // 약물 모양
  lengLong?: number;        // 약물 길이
  lengShort?: number;       // 약물 폭
  thick?: number;           // 약물 두께
  storageMethod?: string;   // 저장 방법
  validTerm?: string;       // 유효 기간
  packUnit?: string;        // 포장 단위
  eeDocData?: DocData;      // 효능 효과 데이터
  udDocData?: DocData;      // 사용상 주의사항 데이터
  nbDocData?: DocData;      // 주의사항 데이터
  createdAt?: string;       // 생성 날짜
  updatedAt?: string;       // 수정 날짜
}