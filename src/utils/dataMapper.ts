import { EntityProperty, PropertyType } from '@manydesigns/portofino';
import { isEmpty } from 'lodash';
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

function mapAttrToFormType(type: PropertyType): string {
  if (type === 'string') return 'text';
  if (type === 'boolean') return 'checkbox';
  return type;
}

export function mapPropertyToFormulateField(property: Attribute) {
  return {
    ...property,
    type: mapAttrToFormType(property.type),
  };
}

export async function mapSearchPropertyToFormulateField(
  property: Attribute,
  selectionProvider: any
) {
  let children: any[];

  function makeField(
    name: string,
    type: string,
    className: string,
    label?: string
  ): any {
    return {
      component: 'div',
      class: className,
      children: [
        { name, type, label: label || ' ', class: !label ? 'pt-2' : null },
      ],
    };
  }

  function makeStringSearchMode(
    name: string,
    className: string,
    label?: string
  ) {
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

  if (selectionProvider) {
    let options = await selectionProvider.getOptions();

    children = [
      {
        component: 'div',
        class: 'col',
        children: [
          {
            name: property.name,
            type: 'select',
            label: property.label,
            placeholder: 'Nessuna selezione',
            options: options.map((o: any) => ({ value: o.v, label: o.l })),
          },
        ],
      },
    ];
  } else {
    switch (property.type) {
      case 'date':
        children = [
          makeField(
            `${property.name}_from`,
            'date',
            'col',
            `${property.label} da`
          ),
          makeField(
            `${property.name}_to`,
            'date',
            'col',
            `${property.label} a`
          ),
        ];
        break;
      case 'string':
        children = [
          makeStringSearchMode(
            `${property.name}_mode`,
            'col-md-4',
            property.label
          ),
          makeField(property.name, 'text', 'col'),
        ];
        break;
      default:
        children = [
          makeField(property.name, mapAttrToFormType(property.type), 'col'),
        ];
        break;
    }
  }

  return {
    component: 'div',
    class: 'form-row',
    children,
  };
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
