export const customSelectStyles = {
  control: (provided: import("react-select").CSSObjectWithLabel) => ({
    ...provided,
    borderRadius: "8px",
    borderColor: "#ccc",
    minHeight: "42px",
    boxShadow: "none",
  }),
  option: (provided: import("react-select").CSSObjectWithLabel) => ({
    ...provided,
    color: "#333",
  }),
};