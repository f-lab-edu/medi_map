import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MedicineResultDto } from "@/dto/MedicineResultDto";

interface SearchResultsProps {
  results: MedicineResultDto[];
  lastElementRef: (node: HTMLLIElement | null) => void;
}

const DEFAULT_IMAGE_PATH = "/images/not-image.png";

export function SearchResults({ results, lastElementRef }: SearchResultsProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemSeq: string) => {
    setImageErrors((prev) => ({ ...prev, [itemSeq]: true }));
  };

  return (
    <ul className="medicine_results">
      {results.map((item, index) => {
        const imageHasError = imageErrors[item.itemSeq];
        const imageToShow = imageHasError || !item.itemImage ? DEFAULT_IMAGE_PATH : item.itemImage;

        return (
          <li
            className="medicine_desc"
            key={`${item.itemSeq}-${index}`}
            ref={index === results.length - 1 ? lastElementRef : null}
          >
            <Link href={`/search/${item.itemSeq}`} passHref>
              <Image
                src={imageToShow}
                alt={item.itemName || "약품 이미지"}
                width={100}
                height={50}
                onError={() => handleImageError(item.itemSeq)}
                unoptimized={imageHasError}
              />
              <div className="medicine_info">
                <h3 className="name">{item.itemName || "이름 정보 없음"}</h3>
                <div className="details">
                  <p className="classification">약물 분류: {item.className || "정보 없음"}</p>
                  <p className="type">전문/일반 구분: {item.etcOtcName || "정보 없음"}</p>
                  <p className="manufacturer">제조사: {item.entpName || "정보 없음"}</p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}