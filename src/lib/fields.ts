import { startCase } from 'lodash';
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
      .map(([key, val]) => ({
        ...val,
        name: key,
        label: val.label || startCase(key),
        custom: true,
      }))
      .filter((aField) => !fields.find((f) => f.name === aField.name));

    res.push(...addFields);
  }

  return res.filter((f) => {
    if (typeof f.display === 'function') return f.display();
    return f.display !== false;
  });
}
