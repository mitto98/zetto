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
          { value: '', label: 'Contiene' },
          { value: 'equals', label: 'È uguale a' },
          { value: 'starts', label: 'Inizia con' },
          { value: 'ends', label: 'Finisce per' },
        ],
      },
    ],
  };
}

export async function mapSearchPropertyToFormulateField(
  property: Attribute,
  selectionProvider: any
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
                `${property.label} da`
              ),
              makeColField(
                `${property.name}_to`,
                'date',
                'col',
                `${property.label} a`
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
  onFormClean: () => void
): Promise<FormulateSchema> {
  const fields = mergeComponentFields(
    action.getSearchableProperties(),
    fieldsConf
  );

  const searchFields = await Promise.all(
    fields.map((field) => {
      const sp = action.getSelectionProviderByPropertyName(field.name);
      return mapSearchPropertyToFormulateField(field, sp);
    })
  );

  return [
    {
      component: 'div',
      class: 'form-row',
      children: [
        ...searchFields,
        {
          name: 'Pulisci i filtri',
          type: 'button',
          inputClass: 'btn btn-secondary',
          '@click': onFormClean,
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
