import { mergeComponentFields } from '../lib/fields';
import { buildForm } from '../lib/forms/formFields';
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import translatorMixin from '../mixins/translatorMixin';
import modelMixin, { modelMixinProps } from '../mixins/modelMixin';

export default {
  name: 'CrudUpdate',
  mixins: [titledMixin, translatorMixin, modelMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    submitLabel: { type: String },
    entity: { type: [String, Number], required: true },
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
    this.fetchData();
  },
  methods: {
    handleFieldInput(fieldName, value) {
      this.value = { ...this.value, [fieldName]: value };
    },
    async fetchData() {
      if (!this.action) return [];
      this.isLoading = true;

      const entity = await this.action.get(this.entity);
      this.value = entity.toObject();

      let fields = mergeComponentFields(
        this.action.getUpdatableProperties(),
        this.fields
      );

      this.schema = await buildForm(this.action, fields);

      this.isLoading = false;
    },
    async handleSubmit(event) {
      this.isLoading = true;
      event.preventDefault();
      const value = this.validate ? this.validate(this.value) : this.value;
      const entity = await this.action.update(this.entity, value);
      this.$emit('submit', entity);
      this.$emit('updated', entity);
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
      const { type, value, required, ...attrs } = field;
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
