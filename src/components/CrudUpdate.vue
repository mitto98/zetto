<template>
  <div>
    <h1 v-if="title">{{ elementTitle }}</h1>
    <formulate-form
      v-if="!isLoading"
      v-model="value"
      :schema="schema"
      @submit="handleSubmit"
      autocomplete="off"
    />
  </div>
</template>

<script>
import { format } from 'date-fns';
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import { generateUpdateFormSchema } from '../lib/forms/formFields';

export default {
  name: 'CrudUpdate',
  mixins: [titledMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    submitLabel: { type: String },
    entity: { type: [String, Number], required: true },
    ...titledMixinProps,
  },
  data: () => ({
    isLoading: false,
    schema: null,
    value: null,
  }),
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      if (!this.action) return [];
      this.isLoading = true;
      await Promise.all([this.loadSchema(), this.loadData()]);
      this.isLoading = false;
    },
    async loadSchema() {
      const fields = await generateUpdateFormSchema(this.action, this.fields);

      fields.push({
        type: 'submit',
        label: this.submitLabel || 'Salva',
      });

      this.schema = fields;
    },
    async loadData() {
      const value = (await this.action.get(this.entity)).toObject();
      Object.entries(value).forEach(([k, v]) => {
        if (v instanceof Date) value[k] = format(v, 'yyyy-MM-dd');
      });
      this.value = value;
    },
    async handleSubmit() {
      this.isLoading = true;
      const entity = await this.action.update(this.entity, this.schema);
      this.$emit('submit', entity);
      this.isLoading = false;
    },
  },
};
</script>
