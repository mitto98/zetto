import { CrudAction, EntityProperty } from '@manydesigns/portofino';
import { AttributesConfig } from '../../types/attributeTypes';
import { mergeComponentFields } from '../../utils/dataMapper';
import {
  FormulateSchema,
  mapPropertyToFormulateField,
  SchemaField,
} from './formulateUtils';

async function generateActionFormSchema(
  action: CrudAction,
  properties: EntityProperty[],
  fieldsConf: AttributesConfig
): Promise<FormulateSchema> {
  const fields: SchemaField[] = mergeComponentFields(
    properties,
    fieldsConf
  ).map(mapPropertyToFormulateField);

  //TODO Custom selection provider
  for (const field of fields) {
    const sp = action.getSelectionProviderByPropertyName(field.name);
    if (sp) {
      field.type = 'select';
      field.options = (await sp.getOptions()).map((o) => ({
        value: o.v,
        label: o.l,
      }));
    }
  }

  return fields;
}

export function generateCreateFormSchema(
  action: CrudAction,
  fieldsConf: AttributesConfig
): Promise<FormulateSchema> {
  return generateActionFormSchema(
    action,
    action.getInsertableAttributes(),
    fieldsConf
  );
}
export function generateUpdateFormSchema(
  action: CrudAction,
  fieldsConf: AttributesConfig
): Promise<FormulateSchema> {
  return generateActionFormSchema(
    action,
    action.getUpdatableAttributes(),
    fieldsConf
  );
}
