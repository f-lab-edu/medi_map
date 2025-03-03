import { ChangeEvent, KeyboardEvent } from "react";
import { FILTERS, FILTER_ALL } from "@/constants/filters";
import { useSearchStore } from "@/store/useSearchStore";

interface SearchBoxProps {
  onSearch: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchBox({ onSearch, onKeyDown }: SearchBoxProps) {
  const {
    medicineSearchTerm,
    companySearchTerm,
    selectedColors,
    selectedShapes,
    selectedForms,
    setMedicineSearchTerm,
    setCompanySearchTerm,
    setSelectedColors,
    setSelectedShapes,
    setSelectedForms,
  } = useSearchStore();

  const handleMediChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMedicineSearchTerm(e.target.value);
  };

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanySearchTerm(e.target.value);
  };

  const updateFilter = (selectedItems: string[], newItem: string) => {
    if (newItem === FILTER_ALL) {
      return [FILTER_ALL];
    }
  
    let updatedItems = selectedItems.filter((item) => item !== FILTER_ALL);
  
    if (updatedItems.includes(newItem)) {
      updatedItems = updatedItems.filter((item) => item !== newItem);
    } else {
      updatedItems = [...updatedItems, newItem];
    }
  
    return updatedItems;
  };  

  return (
    <div className="search_box">
      <input
        type="text"
        value={medicineSearchTerm}
        onChange={handleMediChange}
        onKeyDown={onKeyDown}
        placeholder="약물 이름을 입력하세요"
      />
      <input
        type="text"
        value={companySearchTerm}
        onChange={handleCompanyChange}
        onKeyDown={onKeyDown}
        placeholder="업체 이름을 입력하세요"
      />

      <div className="filters color_filters">
        {FILTERS.colors.map(({ name, className }) => (
          <button
            key={name}
            className={`${className} ${selectedColors.includes(name) ? "selected" : ""}`}
            onClick={() => setSelectedColors((prev) => updateFilter(prev, name))}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="filters shape_filters">
        {FILTERS.shapes.map((shape) => (
          <button
            key={shape}
            className={selectedShapes.includes(shape) ? "selected" : ""}
            onClick={() => setSelectedShapes((prev) => updateFilter(prev, shape))}
          >
            {shape}
          </button>
        ))}
      </div>

      <div className="filters form_filters">
        {FILTERS.forms.map((form) => (
          <button
            key={form}
            className={selectedForms.includes(form) ? "selected" : ""}
            onClick={() => setSelectedForms((prev) => updateFilter(prev, form))}
          >
            {form}
          </button>
        ))}
      </div>

      <button onClick={onSearch}>검색</button>
    </div>
  );
}