import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { DocData, Paragraph } from '@/dto/MedicineResultDto';

interface MedicineInfoProps {
  docData?: DocData;
  sectionTitle: string;
}

const ParagraphContent: React.FC<{ paragraph?: Paragraph }> = ({ paragraph }) => {
  const content = paragraph?.cdata || paragraph?.text || '';
  const sanitizedHTML = DOMPurify.sanitize(content);

  if (paragraph?.tagName === 'table') {
    return (
      <table
        className="medi_table"
        dangerouslySetInnerHTML={{ __html: `<tbody>${sanitizedHTML}</tbody>` }}
      />
    );
  }

  return <p dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

const MedicineInfo: React.FC<MedicineInfoProps> = ({ docData, sectionTitle }) => {
  if (!docData?.DOC) return null;

  const { title, SECTION } = docData.DOC;

  return (
    <div className="medi_desc_bottom">
      <h3 className="sub_title">{title || sectionTitle}</h3>
      <ul className="medi_info_list">
        {(SECTION?.ARTICLE ? (SECTION.ARTICLE instanceof Array ? SECTION.ARTICLE : [SECTION.ARTICLE]) : []).map((article, index) => (
          article && (
            <li key={index} className="medi_box">
              <h4 className="medi_sub_title">{article.title || ''}</h4>
              {(article.PARAGRAPH instanceof Array ? article.PARAGRAPH : [article.PARAGRAPH]).map((paragraph, pIndex) => (
                <ParagraphContent key={pIndex} paragraph={paragraph} />
              ))}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default MedicineInfo;