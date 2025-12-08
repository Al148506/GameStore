import Select from "react-select";
import type { MultiValue, StylesConfig } from "react-select";

interface Option {
  value: number | string;
  label: string;
}

interface MultiSelectInputProps {
  label: string;
  name: string;
  value: (number | string)[]; // los IDs seleccionados
  options: Option[];
  onChange: (value: MultiValue<Option>) => void;
  loading?: boolean;
  styles?: StylesConfig<Option>;
}


export function MultiSelectInput({
  label,
  name,
  value,
  options,
  onChange,
  loading,
  styles,
}: MultiSelectInputProps) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <Select
        isMulti
        name={name}
        options={options}
        value={options.filter((o) => value.includes(o.value))}
        onChange={onChange}
        isLoading={loading}
        styles={styles}
      />
    </div>
  );
}
