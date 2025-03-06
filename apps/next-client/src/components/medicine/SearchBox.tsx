import { ChangeEvent, KeyboardEvent } from 'react';
import { FILTERS, FILTER_ALL } from '@/constants/filters';

interface SearchBoxProps {
  localSearchTerm: string;
  setLocalSearchTerm: (val: string) => void;
  localCompany: string;
  setLocalCompany: (val: string) => void;
  localColors: string[];
  setLocalColors: (val: string[]) => void;
  localShapes: string[];
  setLocalShapes: (val: string[]) => void;
  localForms: string[];
  setLocalForms: (val: string[]) => void;

  onSearch: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchBox({
  localSearchTerm,
  setLocalSearchTerm,
  localCompany,
  setLocalCompany,
  localColors,
  setLocalColors,
  localShapes,
  setLocalShapes,
  localForms,
  setLocalForms,
  onSearch,
  onKeyDown,
}: SearchBoxProps) {
  const handleMediChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };
  const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalCompany(e.target.value);
  };

  const updateFilter = (selectedItems: string[], newItem: string) => {
    if (newItem === FILTER_ALL) {
      return [FILTER_ALL];
    }
    let updated = selectedItems.filter((i) => i !== FILTER_ALL);
    if (updated.includes(newItem)) {
      updated = updated.filter((i) => i !== newItem);
    } else {
      updated = [...updated, newItem];
    }
    return updated;
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
            className={`${className} ${localColors.includes(name) ? 'selected' : ''}`}
            onClick={() => setLocalColors(updateFilter(localColors, name))}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="filters shape_filters">
        {FILTERS.shapes.map((shape) => (
          <button
            key={shape}
            className={localShapes.includes(shape) ? 'selected' : ''}
            onClick={() => setLocalShapes(updateFilter(localShapes, shape))}
          >
            {shape}
          </button>
        ))}
      </div>

      <div className="filters form_filters">
        {FILTERS.forms.map((form) => (
          <button
            key={form}
            className={localForms.includes(form) ? 'selected' : ''}
            onClick={() => setLocalForms(updateFilter(localForms, form))}
          >
            {form}
          </button>
        ))}
      </div>

      <button onClick={onSearch}>검색</button>
    </div>
  );
}