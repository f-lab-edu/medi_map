import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { XMLParser } from 'fast-xml-parser';
import { MedicineInfoProps, Paragraph, Article, Doc } from '@/dto/MedicineResultDto';
import { SEARCH_ERROR_MESSAGES } from '@/constants/search_errors';

// Paragraph 태그 내용 렌더링
const ParagraphContent: React.FC<{ paragraph?: Paragraph }> = ({ paragraph }) => {
  if (!paragraph) return null;

  const content = paragraph.cdata || paragraph["#text"] || paragraph.text || '';
  const sanitizedHTML = DOMPurify.sanitize(content);

  // 테이블 태그일 경우, 테이블 컴포넌트로 렌더링
  if (paragraph["@_tagName"] === 'table' && paragraph["#text"]) {
    return (
      <div className="table_container">
        <table
          className="medi_table"
          dangerouslySetInnerHTML={{ __html: paragraph["#text"] }}
        />
      </div>
    );
  }

  return <p dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

const MedicineInfo: React.FC<MedicineInfoProps> = ({ docData, sectionTitle }) => {

  if (!docData) {
    return null;
  }

  // XML 데이터 -> JSON으로 변환 함수
  const parseXMLToJSON = (xml: string): { DOC?: Doc } => {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    return parser.parse(xml);
  };

  let parsedData;
  try {
    if (typeof docData === 'string') {
      parsedData = parseXMLToJSON(docData);
    } else if (typeof docData === 'object' && docData !== null) {
      parsedData = docData;
    } else {
      throw new Error(SEARCH_ERROR_MESSAGES.INVALID_DOC_DATA_FORMAT);
    }
  } catch (error) {
    console.error(SEARCH_ERROR_MESSAGES.XML_PARSING_ERROR, error);
    return <p>XML 데이터를 처리할 수 없습니다.</p>;
  }
  

  const { DOC } = parsedData || {};
  const { "@_title": title, SECTION } = DOC || {};

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