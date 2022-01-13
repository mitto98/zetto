<template>
  <div class="form-check">
    <input
      :id="id"
      :name="id"
      :checked="value"
      type="checkbox"
      class="form-check-input"
      @input="$emit('input', !value)"
    />
    <label :for="id" class="form-check-label">
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'BooleanField',
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    value: { required: true },
    trans: { type: Function, required: true },
  },
};
</script>
