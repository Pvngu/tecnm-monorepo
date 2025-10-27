export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea';
  placeholder?: string;

  resource?: string;
  optionLabelKey?: string;
  optionValueKey?: string;
}