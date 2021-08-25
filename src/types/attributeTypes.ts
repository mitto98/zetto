/** Table attribute **/
export interface BaseAttribute {
  name: string;
  label: string;
  display?: boolean | (() => boolean);
  custom?: boolean;
}

export type AttributesConfig = Record<string, BaseAttribute>;

/** Table attribute **/

export declare type AttributeType = 'string' | 'number' | 'date' | 'boolean';

export interface Attribute extends BaseAttribute {
  type: AttributeType;
  sortable?: boolean;
}

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

export interface FormField extends BaseAttribute {
  type: FormFieldType;
  defaultValue: any;
  required?: boolean;
  options?: { value: string; label: string }[];
}
