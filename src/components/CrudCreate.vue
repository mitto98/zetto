<template>
  <form @submit.prevent="handleSubmit" autocomplete="off">
    <h1 v-if="title" class="mb-2">{{ elementTitle }}</h1>
    <div v-for="field in schema" :key="field.name">
      <slot
        :name="`field(${field.name})`"
        :value="value[field.name]"
        :handleInput="(val) => handleFieldInput(field.name, val)"
      >
        <component
          :is="getFieldComponent(field.type)"
          :id="field.name"
          :value="value[field.name]"
          :trans="$trans"
          v-bind="field"
          @input="(val) => handleFieldInput(field.name, val)"
        />
      </slot>
    </div>

    <Button type="submit" variant="primary" :label="submitLabel || 'Crea'" />
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
    getFieldComponent(type) {
      return FormFields[type] || FormFields.string;
    },
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
    async handleSubmit() {
      this.isLoading = true;
      const value = this.validate ? this.validate(this.value) : this.value;
      const entity = await this.action.create(value);
      this.$emit('submit', entity);
      this.isLoading = false;
    },
  },
};
</script>
