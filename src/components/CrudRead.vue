<template>
  <table class="align-left">
    <tr v-for="field in tableFields" :key="field.name">
      <td class="font-bold">{{ field.label }}:&nbsp;</td>
      <td v-if="value">
        <slot
          :name="`data(${field.name})`"
          :value="value[field.name]"
          :item="value"
        >
          {{ value.getDisplayValue(field.name) }}
        </slot>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'CrudDetail',
  props: {
    action: { type: Object, required: true },
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

      let attrs = this.action.getAttributes();
      if (this.fields)
        attrs = attrs.filter((a) => this.fields.includes(a.name));

      return attrs;
    },
  },
};
</script>
