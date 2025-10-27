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

  resource?: string;
  optionLabelKey?: string;
  optionValueKey?: string;
}