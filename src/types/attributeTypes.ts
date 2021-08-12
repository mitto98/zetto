export declare type AttributeType = 'string' | 'number' | 'date' | 'boolean';

export interface Attribute {
  name: string;
  label: string;
  type: AttributeType;
  display?: boolean | (() => boolean);
}

export type AttributesConfig = Record<string, Attribute>;

/** Form fields **/

type SearchFormFieldType =
  | 'stringSearch'
  | 'dateRange'
  | 'multiple'
  | 'multipleSelect';

export type FormFieldType =
  | AttributeType
  | 'select'
  | 'radio'
  | 'file'
  | 'autocomplete'
  | SearchFormFieldType;

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  options?: { value: string; label: string }[];
}
