import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { XMLParser } from 'fast-xml-parser';

// 확장된 Paragraph 타입 정의
interface Paragraph {
  cdata?: string;
  text?: string;
  "#text"?: string;
  tagName?: string;
  "@_tagName"?: string; // fast-xml-parser가 생성하는 속성
}

// ARTICLE 타입 정의
interface Article {
  "@_title"?: string;
  PARAGRAPH?: Paragraph | Paragraph[];
}

// SECTION 타입 정의
interface Section {
  ARTICLE?: Article | Article[];
}

// DOC 타입 정의
interface Doc {
  "@_title"?: string;
  SECTION?: Section;
}

// MedicineInfoProps 타입 정의
interface MedicineInfoProps {
  docData?: string; // XML 데이터를 string 타입으로 받음
  sectionTitle: string;
}

// ParagraphContent: 단락 내용을 렌더링하는 컴포넌트
const ParagraphContent: React.FC<{ paragraph?: Paragraph }> = ({ paragraph }) => {
  if (!paragraph) return null;

  const content = paragraph.cdata || paragraph["#text"] || paragraph.text || '';
  const sanitizedHTML = DOMPurify.sanitize(content);

  // 테이블 처리
  if (paragraph["@_tagName"] === 'table' && paragraph["#text"]) {
    console.log('Raw table HTML content:', paragraph["#text"]);
    return (
      <div className="table_container">
        <table
          className="medi_table"
          dangerouslySetInnerHTML={{ __html: paragraph["#text"] }}
        />
      </div>
    );
  }

  // 기본 텍스트 렌더링
  return <p dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

// MedicineInfo: XML 데이터를 JSON으로 변환하고 렌더링하는 컴포넌트
const MedicineInfo: React.FC<MedicineInfoProps> = ({ docData, sectionTitle }) => {
  if (!docData) {
    return null; // docData가 없으면 아무것도 렌더링하지 않음
  }

  // XML 데이터를 JSON으로 변환하는 함수
  const parseXMLToJSON = (xml: string): { DOC?: Doc } => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_', // 속성을 구분하기 위한 접두사
    });
    return parser.parse(xml);
  };

  let parsedData;
  try {
    parsedData = parseXMLToJSON(docData);
  } catch (error) {
    console.error('XML 파싱 오류:', error);
    return <p>XML 데이터를 처리할 수 없습니다.</p>;
  }

  const { DOC } = parsedData || {};
  const { "@_title": title, SECTION } = DOC || {};

  // ARTICLE 데이터를 배열로 정리
  const articles = Array.isArray(SECTION?.ARTICLE)
    ? SECTION.ARTICLE
    : SECTION?.ARTICLE
    ? [SECTION.ARTICLE]
    : [];

  return (
    <div className="medi_desc_bottom">
      <h3 className="sub_title">{title || sectionTitle}</h3>
      <ul className="medi_info_list">
        {articles.map((article: Article, index: number) => (
          <li key={index}>
            {article["@_title"] && (
              <h4 className="medi_sub_title">{article["@_title"]}</h4>
            )}
            {Array.isArray(article.PARAGRAPH)
              ? article.PARAGRAPH.map((paragraph: Paragraph, pIndex: number) => (
                  <ParagraphContent key={pIndex} paragraph={paragraph} />
                ))
              : article.PARAGRAPH && (
                  <ParagraphContent paragraph={article.PARAGRAPH} />
                )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicineInfo;