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
    <Button :type="submit" variant="primary" :label="submitLabel || 'Crea'" />
    <Button v-for="(btn, i) in buttons" :key="i" v-bind="btn" />
  </form>
</template>

<script>
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import translatorMixin from '../mixins/translatorMixin';
import { buildForm } from '../lib/forms/formFields';
import { mergeComponentFields } from '../lib/fields';
import { Button, FormFields } from '../models/bootstrap4';

export default {
  components: { Button },
  name: 'CrudCreate',
  mixins: [titledMixin, translatorMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) }, // AttributesConfig with defaultValue field
    submitLabel: { type: String },
    buttons: { type: Array, default: () => [] },
    ...titledMixinProps,
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
    getFieldComponent(type) {
      return FormFields[type] || FormFields.string;
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
    async handleSubmit() {
      this.isLoading = true;
      const entity = await this.action.create(this.value);
      this.$emit('submit', entity);
      this.isLoading = false;
    },
  },
};
</script>
