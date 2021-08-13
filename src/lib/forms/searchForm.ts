import { CrudAction } from '@manydesigns/portofino';
import {
  Attribute,
  FormField,
  FormFieldType,
} from '../../types/attributeTypes';
import { selectModeToField } from './formFields';

function getSearchFieldType(type: FormFieldType): FormFieldType {
  switch (type) {
    case 'string':
      return 'stringSearch';
    case 'date':
      return 'dateRange';
    default:
      return type;
  }
}

export async function buildSearchForm(
  action: CrudAction,
  fields: Attribute[]
): Promise<FormField[]> {
  return await Promise.all(
    fields.map(async (field) => {
      const res: FormField = {
        ...field,
        type: getSearchFieldType(field.type),
      };

      const sp = action.getSelectionProviderByPropertyName(field.name);

      if (sp) {
        const options = await sp.getOptions();
        res.type = selectModeToField(sp.searchSelectMode);
        res.options = options.map((o) => ({ value: o.v, label: o.l }));
      }

      return res;
    })
  );
}
