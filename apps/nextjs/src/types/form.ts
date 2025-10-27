export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "dynamic-select"
    | "multiselect"
    | "dynamic-multiselect"
    | "textarea"
    | "checkbox"
    | "radio"
    | "date"
    | "time"
    | "datetime"
    | "file";
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  
  // For dynamic selects
  resource?: string;
  optionLabelKey?: string;
  optionValueKey?: string;
  
  // Additional properties
  description?: string;
  rows?: number; // For textarea
  accept?: string; // For file input
  multiple?: boolean; // For file input or multiselect
  min?: number; // For number input
  max?: number; // For number input
  step?: number; // For number input
}