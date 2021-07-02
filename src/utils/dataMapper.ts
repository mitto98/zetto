import { PropertyType } from '@manydesigns/portofino';
import { Attribute, AttributesConfig } from '../types/attributeTypes';

export function mergeComponentFields(
  fields: Attribute[],
  fieldsConf: AttributesConfig
): Attribute[] {
  fields = fields || [];

  const res: Attribute[] = (fields || []).map((field) => {
    const fieldConf = fieldsConf[field.name] || {};
    return { ...field, ...fieldConf };
  });

  const addFields: Attribute[] = Object.entries(fieldsConf)
    .map(([key, val]) => ({ ...val, name: key }))
    .filter((aField) => !fields.find((f) => f.name === aField.name));

  res.push(...addFields);

  return fields.filter((f) => {
    if (typeof f.display === 'function') return f.display();
    return f.display !== false;
  });
}

export function mapPropertyToFormulateField(property: Attribute) {
  function mapAttrToFormType(type: PropertyType): string {
    if (type === 'string') return 'text';
    if (type === 'boolean') return 'checkbox';
    return type;
  }

  return {
    ...property,
    type: mapAttrToFormType(property.type),
  };
}
