import Select from "react-select";

import "../../styles/selectBase.css"
export interface Option {
  value: number;
  label: string;
}

type Props = {
  label?: string;
  options: Option[];
  value?: number;
  isLoading?: boolean;
  placeholder?: string;
  onChange: (value: number | undefined) => void;
  className?: string;
};

export function SingleSelectField({
  label,
  options,
  value,
  isLoading = false,
  placeholder = "Select...",
  onChange,
  className,
}: Props) {
  const selectedOption = options.find((o) => o.value === value) ?? null;

  return (
    <div className="form-group">
      {label && <label>{label}</label>}

      <Select
        className={`select-base ${className ?? ""}`}
        options={options}
        value={selectedOption}
        isLoading={isLoading}
        placeholder={placeholder}
        onChange={(opt) => onChange(opt?.value)}
        isClearable
      />
    </div>
  );
}
