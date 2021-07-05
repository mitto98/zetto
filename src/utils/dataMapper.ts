import { PropertyType } from '@manydesigns/portofino';
import { Attribute, AttributesConfig } from '../types/attributeTypes';

export function mergeComponentFields(
  fields: Attribute[],
  fieldsConf: AttributesConfig
): Attribute[] {
  if (!fields) return [];

  const res: Attribute[] = fields.map((field) => {
    const fieldConf = fieldsConf?.[field.name] || {};
    return { ...field, ...fieldConf };
  });

  if (fieldsConf) {
    const addFields: Attribute[] = Object.entries(fieldsConf)
      .map(([key, val]) => ({ ...val, name: key }))
      .filter((aField) => !fields.find((f) => f.name === aField.name));

    res.push(...addFields);
  }

  return res.filter((f) => {
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
