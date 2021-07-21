<template>
  <formulate-form
    v-if="schema"
    v-model="form"
    :schema="schema"
    @submit="handleSubmit"
    autocomplete="off"
  />
</template>

<script>
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import { mapPropertyToFormulateField } from '../utils/dataMapper';
import { mergeComponentFields } from '../utils/dataMapper.ts';

export default {
  name: 'CrudCreate',
  mixins: [titledMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    submitLabel: { type: String },
    ...titledMixinProps,
  },
  data: () => ({
    isLoading: false,
    schema: null,
    form: {},
  }),
  created() {
    this.loadSchema();
  },
  methods: {
    async loadSchema() {
      if (!this.action) return [];
      const fields = mergeComponentFields(
        this.action.getInsertableAttributes(),
        this.fields
      ).map(mapPropertyToFormulateField);

      //TODO Custom selection provider
      for (const field of fields) {
        const sp = this.action.getSelectionProviderByPropertyName(field.name);
        if (sp) {
          field.type = 'select';
          field.options = (await sp.getOptions()).map((o) => ({
            value: o.v,
            label: o.l,
          }));
        }
      }

      fields.push({
        type: 'submit',
        label: this.submitLabel || 'Crea nuovo',
      });

      this.schema = fields;
    },
    async handleSubmit() {
      this.isLoading = true;
      const customer = await this.action.create(this.form);
      this.$emit('submit', customer);
      this.isLoading = false;
    },
  },
};
</script>
