<template>
  <formulate-form
    v-model="form"
    :schema="schema"
    @submit="handleSubmit"
    autocomplete="off"
  />
</template>

<script>
import { mergeComponentFields } from '../utils/dataMapper';

export default {
  name: 'CrudCreate',
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    submitLabel: { type: String },
  },
  data: () => ({
    isLoading: false,
    form: {},
  }),
  computed: {
    schema() {
      if (!this.action) return [];
      const fields = mergeComponentFields(
        this.action.getInsertableAttributes(),
        this.fields
      ).map((att) => ({
        ...att,
        type: 'text',
      }));

      fields.push({
        type: 'submit',
        label: this.submitLabel || 'Crea nuovo',
      });

      return fields;
    },
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;
      const customer = await this.action.create(this.form);
      this.$emit('submit', customer);
      this.isLoading = false;
    },
  },
};
</script>
