import { PropertyType } from '@manydesigns/portofino';
import { Attribute } from '../../types/attributeTypes';

interface FormulateBaseElement {
  class?: string;
  style?: string;
}

export interface SchemaComponent extends FormulateBaseElement {
  component: string;
  children?: FormulateSchema;
}

export interface SchemaField extends FormulateBaseElement {
  type: string;
  name?: string;
  label?: string;
  placeholder?: string;
  options?:
    | { value: string; label: string }[]
    | Record<string, string>
    | string[];
  elementClass?: string;
  inputClass?: string;
  validation?: string;
  validationName?: string;
  '@click'?: Function;
}

export type FormulateSchema = (SchemaComponent | SchemaField)[];

export function mapAttrToFormType(type: PropertyType): string {
  if (type === 'string') return 'text';
  if (type === 'boolean') return 'checkbox';
  return type;
}

export function mapPropertyToFormulateField(property: Attribute) {
  return {
    ...property,
    type: mapAttrToFormType(property.type),
  };
}
