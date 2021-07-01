<template>
  <dl>
    <div v-for="field in tableFields" :key="field.name">
      <dt>{{ field.label }}</dt>
      <dd v-if="value">
        <slot
          :name="`data(${field.name})`"
          :value="value[field.name]"
          :item="value"
        >
          {{ value.getDisplayValue(field.name) }}
        </slot>
      </dd>
    </div>
  </dl>
</template>

<script>
import { mergeComponentFields } from '../utils/dataMapper.ts';
// import actionBased from '../mixins/actionBased';

export default {
  name: 'CrudDetail',
  //mixins: { actionBased },
  props: {
    action: { type: [Object, String], required: true },
    fields: { type: Array, default: null },
    id: { required: true },
  },
  data: () => ({
    isLoading: true,
    value: null,
  }),
  async mounted() {
    this.isLoading = true;
    this.value = await this.action.get(this.id);
    this.isLoading = false;
  },
  computed: {
    tableFields() {
      if (!this.action) return [];

      return mergeComponentFields(
        this.action.getSummaryAttributes(),
        this.fields
      );
    },
  },
};
</script>
