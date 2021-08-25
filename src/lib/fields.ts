import { startCase } from 'lodash';
import { AttributesConfig, BaseAttribute } from '../types/attributeTypes';

export function mergeComponentFields(
  fields: BaseAttribute[],
  fieldsConf: AttributesConfig
): BaseAttribute[] {
  if (!fields) return [];

  const res: BaseAttribute[] = fields.map((field) => {
    const fieldConf = fieldsConf?.[field.name] || {};
    return { ...field, ...fieldConf };
  });

  if (fieldsConf) {
    const addFields: BaseAttribute[] = Object.entries(fieldsConf)
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
