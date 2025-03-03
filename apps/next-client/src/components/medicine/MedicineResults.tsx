import Link from "next/link";
import Image from "next/image";
import { MedicineResultDto } from "@/dto/MedicineResultDto";

interface SearchResultsProps {
  results: MedicineResultDto[];
  lastElementRef: (node: HTMLLIElement | null) => void;
}

export function SearchResults({ results, lastElementRef }: SearchResultsProps) {
  return (
    <ul className="medicine_results">
      {results.map((item, index) => (
        <li
          className="medicine_desc"
          key={item.itemSeq}
          ref={index === results.length - 1 ? lastElementRef : null}
        >
          <Link href={`/search/${item.itemSeq}`} passHref>
            {item.itemImage && (
              <Image src={item.itemImage} alt={item.itemName} width={100} height={50} />
            )}
            <div className="medicine_info">
              <h3 className="name">{item.itemName}</h3>
              <div className="details">
                <p className="classification">약물 분류: {item.className}</p>
                <p className="type">전문/일반 구분: {item.etcOtcName}</p>
                <p className="manufacturer">제조사: {item.entpName}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}