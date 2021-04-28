import { isFunction } from 'lodash';

export function mergeComponentFields(fields, fieldsConf) {
  fields = fields.map((field) => {
    const fieldConf = fieldsConf[field.name] || {};
    return { ...field, ...fieldConf };
  });

  const addFields = Object.entries(fieldsConf)
    .map(([key, val]) => ({ ...val, name: key }))
    .filter((aField) => !fields.find((f) => f.name === aField.name));

  fields.push(...addFields);

  return fields.filter((f) => {
    if (isFunction(f?.display)) return f.display();
    return f?.display !== false;
  });
}
