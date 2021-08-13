import {
  CrudAction,
  SearchSelectMode,
  SelectMode,
} from '@manydesigns/portofino';
import {
  Attribute,
  FormField,
  FormFieldType,
} from '../../types/attributeTypes';

export function selectModeToField(
  searchDm: SearchSelectMode | SelectMode
): FormFieldType {
  switch (searchDm) {
    case SearchSelectMode.Dropdown:
      return 'select';
    case SearchSelectMode.Autocomplete:
      return 'autocomplete';
    case SearchSelectMode.Radio:
      return 'radio';
    case SearchSelectMode.Checkbox:
      return 'multiple';
    case SearchSelectMode.MultipleSelect:
      return 'multipleSelect';
  }
}

export async function buildForm(
  action: CrudAction,
  fields: Attribute[]
): Promise<FormField[]> {
  return await Promise.all(
    fields.map(async (field) => {
      const res: FormField = {
        name: field.name,
        label: field.label,
        type: field.type,
      };

      const sp = action.getSelectionProviderByPropertyName(field.name);

      if (sp) {
        const options = await sp.getOptions();
        res.type = selectModeToField(sp.selectMode);
        res.options = options.map((o) => ({ value: o.v, label: o.l }));
      }

      return res;
    })
  );
}
