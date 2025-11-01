// SeleccionMultiple.tsx
import Select from "react-select";

// ✅ Tipo para las opciones del select
export interface SelectOption {
  value: string;
  label: string;
}

// ✅ Props del componente
interface SeleccionMultipleProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isLoading?: boolean;
  isRequired?: boolean;
  name?: string;
}

export function SeleccionMultiple({
  label,
  placeholder,
  options,
  selectedValues,
  onChange,
  isLoading = false,
  isRequired = false,
  name,
}: SeleccionMultipleProps) {
  // ✅ Convertir valores seleccionados a formato de react-select
  const selectedOptions = selectedValues.map((value) => ({
    value,
    label: value,
  }));

  // ✅ Manejar el cambio de selección
  const handleChange = (newValue: readonly SelectOption[]) => {
    const values = newValue.map((option) => option.value);
    onChange(values);
  };

  return (
    <div className="form-group">
      <label>
        {label}
        {isRequired && <span className="required-mark"> *</span>}
      </label>
      <Select
        isMulti
        name={name}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        isLoading={isLoading}
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => "No hay opciones disponibles"}
        loadingMessage={() => "Cargando..."}
      />
    </div>
  );
}
