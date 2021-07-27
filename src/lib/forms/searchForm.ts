import { CrudAction, EntityProperty } from '@manydesigns/portofino';
import { isEmpty } from 'lodash';
import { Attribute, AttributesConfig } from '../../types/attributeTypes';
import { mergeComponentFields } from '../fields';
import {
  FormulateSchema,
  mapAttrToFormType,
  SchemaComponent,
  SchemaField,
} from './formulateUtils';

function makeColField(
  name: string,
  type: string,
  className: string,
  label?: string
): SchemaComponent {
  return {
    component: 'div',
    class: className,
    children: [makeField(name, type, label)],
  };
}

function makeField(name: string, type: string, label?: string): SchemaField {
  return { name, type, label: label || ' ', class: !label ? 'pt-2' : null };
}

function makeStringSearchMode(
  trans: Function,
  name: string,
  className: string,
  label?: string
): SchemaComponent {
  return {
    component: 'div',
    class: className,
    children: [
      {
        name,
        type: 'select',
        label,
        options: [
          { value: '', label: trans('zetto.search.fields.mode.contains') },
          { value: 'equals', label: trans('zetto.search.fields.mode.equals') },
          { value: 'starts', label: trans('zetto.search.fields.mode.starts') },
          { value: 'ends', label: trans('zetto.search.fields.mode.ends') },
        ],
      },
    ],
  };
}

export async function mapSearchPropertyToFormulateField(
  property: Attribute,
  selectionProvider: any,
  trans: Function
): Promise<SchemaComponent> {
  let children: FormulateSchema;

  if (selectionProvider) {
    let options = await selectionProvider.getOptions();
    children = [
      {
        name: property.name,
        type: 'select',
        label: property.label,
        placeholder: 'Nessuna selezione',
        options: options.map((o: any) => ({ value: o.v, label: o.l })),
      },
    ];
  } else {
    switch (property.type) {
      case 'date':
        children = [
          {
            component: 'div',
            class: 'form-row',
            children: [
              makeColField(
                `${property.name}_from`,
                'date',
                'col',
                trans('zetto.search.fields.range_from', {
                  label: property.label,
                })
              ),
              makeColField(
                `${property.name}_to`,
                'date',
                'col',
                trans('zetto.search.fields.range_to', { label: property.label })
              ),
            ],
          },
        ];
        break;
      case 'string':
        children = [
          {
            component: 'div',
            class: 'form-row',
            children: [
              makeStringSearchMode(
                trans,
                `${property.name}_mode`,
                'col-4',
                property.label
              ),
              makeColField(property.name, 'text', 'col'),
            ],
          },
        ];
        break;
      default:
        children = [makeField(property.name, mapAttrToFormType(property.type))];
        break;
    }
  }

  return {
    component: 'div',
    class: 'col-md-6',
    children,
  };
}

export async function buildSearchForm(
  action: CrudAction,
  fieldsConf: AttributesConfig,
  onFormClean: () => void,
  trans: Function
): Promise<FormulateSchema> {
  const fields = mergeComponentFields(
    action.getSearchableProperties(),
    fieldsConf
  );

  const searchFields = await Promise.all(
    fields.map((field) => {
      const sp = action.getSelectionProviderByPropertyName(field.name);
      return mapSearchPropertyToFormulateField(field, sp, trans);
    })
  );

  return [
    {
      component: 'div',
      class: 'form-row',
      children: [
        ...searchFields,
        {
          component: 'div',
          class: 'col-12',
          children: [
            {
              name: trans('zetto.search.filter_clean'),
              type: 'button',
              inputClass: 'btn btn-secondary',
              '@click': onFormClean,
            },
          ],
        },
      ],
    },
  ];
}

export function searchFormToFilterOptions(
  properties: EntityProperty[],
  form: object
) {
  const filterOpts = {};
  properties.forEach((prop) => {
    if (prop.type === 'date') {
      if (form[`${prop.name}_from`] || form[`${prop.name}_to`])
        filterOpts[prop.name] = {};
      if (form[`${prop.name}_from`])
        filterOpts[prop.name].from = form[`${prop.name}_from`];
      if (form[`${prop.name}_to`])
        filterOpts[prop.name].to = form[`${prop.name}_to`];
    } else if (form[prop.name]) {
      if (form[`${prop.name}_mode`])
        filterOpts[prop.name] = {
          mode: form[`${prop.name}_mode`],
          value: form[prop.name],
        };
      else filterOpts[prop.name] = form[prop.name];
    }
  });
  return isEmpty(filterOpts) ? null : filterOpts;
}
