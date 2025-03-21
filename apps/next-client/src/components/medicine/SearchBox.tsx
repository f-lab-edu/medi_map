import { ChangeEvent, KeyboardEvent } from 'react';
import { FILTERS, FILTER_ALL } from '@/constants/filters';

interface SearchBoxProps {
  localSearchTerm: string;
  setLocalSearchTerm: (val: string) => void;
  localCompany: string;
  setLocalCompany: (val: string) => void;
  filters: {
    colors: string[];
    shapes: string[];
    forms: string[];
  };
  setFilters: (filters: { colors: string[]; shapes: string[]; forms: string[] }) => void;
  onSearch: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchBox({
  localSearchTerm,
  setLocalSearchTerm,
  localCompany,
  setLocalCompany,
  filters,
  setFilters,
  onSearch,
  onKeyDown,
}: SearchBoxProps) {
  const handleMediChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalCompany(e.target.value);
  };
  
  const updateFilter = (filterType: 'colors' | 'shapes' | 'forms', newItem: string) => {
    let updatedItems: string[];

    if (newItem === FILTER_ALL) {
      updatedItems = [FILTER_ALL];
    } else if (filters[filterType].includes(newItem)) {
      updatedItems = filters[filterType].filter((item: string) => item !== newItem);
    } else {
      updatedItems = [...filters[filterType].filter((item: string) => item !== FILTER_ALL), newItem];
    }

    setFilters({ ...filters, [filterType]: updatedItems });
  };

  return (
    <div className="search_box">
      <input
        type="text"
        value={localSearchTerm}
        onChange={handleMediChange}
        onKeyDown={onKeyDown}
        placeholder="약물 이름"
      />
      <input
        type="text"
        value={localCompany}
        onChange={handleCompanyChange}
        onKeyDown={onKeyDown}
        placeholder="업체 이름"
      />

      <div className="filters color_filters">
        {FILTERS.colors.map(({ name, className }) => (
          <button
            key={name}
            className={`${className} ${filters.colors.includes(name) ? 'selected' : ''}`}
            onClick={() => updateFilter('colors', name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="filters shape_filters">
        {FILTERS.shapes.map((shape) => (
          <button
            key={shape}
            className={filters.shapes.includes(shape) ? 'selected' : ''}
            onClick={() => updateFilter('shapes', shape)}
          >
            {shape}
          </button>
        ))}
      </div>

      <div className="filters form_filters">
        {FILTERS.forms.map((form) => (
          <button
            key={form}
            className={filters.forms.includes(form) ? 'selected' : ''}
            onClick={() => updateFilter('forms', form)}
          >
            {form}
          </button>
        ))}
      </div>

      <button onClick={onSearch}>검색</button>
    </div>
  );
}