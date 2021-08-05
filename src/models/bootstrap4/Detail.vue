<template>
  <dl>
    <div v-for="field in fields" :key="field.name">
      <dt>{{ field.label }}</dt>
      <dd v-if="item">
        <slot
          :name="`data(${field.name})`"
          :value="item[field.name]"
          :item="item"
        >
          {{ item.getDisplayValue(field.name) }}
        </slot>
      </dd>
    </div>
  </dl>
</template>

<script>
export default {
  props: {
    fields: { type: Array, required: true },
    item: { type: Object, required: true },
    loading: { type: Boolean, required: true },
  },
};
</script>
