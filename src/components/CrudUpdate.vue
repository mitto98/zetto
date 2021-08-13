<template>
  <form @submit.prevent="handleSubmit" autocomplete="off">
    <h1 v-if="title">{{ elementTitle }}</h1>
    <component
      v-for="fs in schema"
      :key="fs.name"
      :is="getFieldComponent(fs.type)"
      :id="fs.name"
      :trans="$trans"
      v-bind="fs"
      v-model="value[fs.name]"
    />

    <button type="submit" class="btn btn-primary">
      {{ submitLabel || 'Salva' }}
    </button>
  </form>
</template>

<script>
import { mergeComponentFields } from '../lib/fields';
import { buildForm } from '../lib/forms/formFields';
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import translatorMixin from '../mixins/translatorMixin';
import * as FormFields from '../models/bootstrap4/fields';

export default {
  name: 'CrudUpdate',
  mixins: [titledMixin, translatorMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    submitLabel: { type: String },
    entity: { type: [String, Number], required: true },
    ...titledMixinProps,
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
    getFieldComponent(type) {
      return FormFields[type] || FormFields.string;
    },
    async fetchData() {
      if (!this.action) return [];
      this.isLoading = true;

      const entity = await this.action.get(this.entity);
      this.value = entity.toObject();

      console.log(this.value);

      let fields = mergeComponentFields(
        this.action.getUpdatableProperties(),
        this.fields
      );

      this.schema = await buildForm(this.action, fields);

      this.isLoading = false;
    },
    async handleSubmit() {
      this.isLoading = true;
      const entity = await this.action.update(this.entity, this.value);
      this.$emit('submit', entity);
      this.isLoading = false;
    },
  },
};
</script>
