<template>
  <div>
    <h1 v-if="title">{{ elementTitle }}</h1>
    <formulate-form
      v-if="schema"
      v-model="form"
      :schema="schema"
      @submit="handleSubmit"
      autocomplete="off"
    />
  </div>
</template>

<script>
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import { generateCreateFormSchema } from '../lib/forms/formFields';

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
      const fields = await generateCreateFormSchema(this.action, this.fields);

      fields.push({
        type: 'submit',
        label: this.submitLabel || 'Crea',
      });

      this.schema = fields;
    },
    async handleSubmit() {
      this.isLoading = true;
      const entity = await this.action.create(this.form);
      this.$emit('submit', entity);
      this.isLoading = false;
    },
  },
};
</script>
