import { Attribute, AttributesConfig } from '../types/attributeTypes';

export function mergeComponentFields(
  fields: Attribute[],
  fieldsConf: AttributesConfig
) {
  fields = fields || [];

  const res: Attribute[] = (fields || []).map((field) => {
    const fieldConf = fieldsConf[field.name] || {};
    return { ...field, ...fieldConf };
  });

  const addFields: Attribute[] = Object.entries(fieldsConf)
    .map(([key, val]) => ({ ...val, name: key }))
    .filter((aField) => !fields.find((f) => f.name === aField.name));

  fields.push(...addFields);

  return fields.filter((f) => {
    if (typeof f.display === 'function') return f.display();
    return f.display !== false;
  });
}
