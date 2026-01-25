import Select from "react-select";
import type { MultiValue } from "react-select";
import { customSelectStyles } from "../../constants/selectCustomStyles";

export interface Option {
  value: number;
  label: string;
}

interface MultiSelectFieldProps {
  label: string;
  name: string;
  options: Option[];
  selectedValues: number[];
  isLoading?: boolean;
  onChange: (values: number[]) => void;
}

export function MultiSelectField({
  label,
  name,
  options,
  selectedValues,
  isLoading = false,
  onChange,
}: MultiSelectFieldProps) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <Select
        isMulti
        name={name}
        options={options}
        isLoading={isLoading}
        value={options.filter((o) => selectedValues.includes(o.value))}
        onChange={(vals: MultiValue<Option>) =>
          onChange(vals.map((v) => v.value))
        }
        styles={customSelectStyles}
      />
    </div>
  );
}
