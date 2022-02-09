import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import translatorMixin from '../mixins/translatorMixin';
import modelMixin, { modelMixinProps } from '../mixins/modelMixin';
import { buildForm } from '../lib/forms/formFields';
import { mergeComponentFields } from '../lib/fields';

export default {
  name: 'CrudCreate',
  mixins: [titledMixin, translatorMixin, modelMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) }, // AttributesConfig with defaultValue field
    submitLabel: { type: String },
    buttons: { type: Array, default: () => [] },
    ...titledMixinProps,
    ...modelMixinProps,
    validate: { type: Function }, // (data: any) => any
  },
  data: () => ({
    isLoading: false,
    schema: [],
    value: {},
  }),
  created() {
    this.loadSchema();
  },
  methods: {
    handleFieldInput(fieldName, value) {
      this.value = { ...this.value, [fieldName]: value };
    },
    async loadSchema() {
      if (!this.action) return;

      let fields = mergeComponentFields(
        this.action.getInsertableAttributes(),
        this.fields
      );

      Object.entries(this.fields).forEach(([key, { defaultValue }]) => {
        if (defaultValue !== undefined) this.value[key] = defaultValue;
      });

      this.schema = await buildForm(this.action, fields);
    },
    async handleSubmit(event) {
      this.isLoading = true;
      event.preventDefault();
      const value = this.validate ? this.validate(this.value) : this.value;
      const entity = await this.action.create(value);
      this.$emit('submit', entity);
      this.$emit('created', entity);
      this.isLoading = false;
    },
  },
  render(h) {
    const button = this.getModelComponent('button');
    const getFieldNode = (field) => {
      const slot = this.$scopedSlots[`field(${field.name})`]?.({
        value: this.value[field.name],
        handleInput: (val) => this.handleFieldInput(field.name, val),
      });
      if (slot) return slot;
      const { type, value, ...attrs } = field;
      return h(this.getModelField(field.type), {
        id: field.name,
        attrs: { ...attrs },
        props: {
          id: field.name,
          ...field,
          value: this.value[field.name],
          trans: this.$trans,
        },
        on: {
          input: (val) => this.handleFieldInput(field.name, val),
        },
      });
    };

    return h(
      'form',
      {
        autocomplete: 'off',
        on: { submit: this.handleSubmit },
      },
      [
        this.title && h('h1', this.elementTitle),
        this.schema.map((field) =>
          h('div', { key: field.name }, [getFieldNode(field)])
        ),
        h(button, {
          props: {
            type: 'submit',
            variant: 'primary',
            label: this.submitLabel || 'Crea',
          },
        }),
        this.buttons.map((btn, i) => h(button, { key: i, props: btn })),
      ]
    );
  },
};
