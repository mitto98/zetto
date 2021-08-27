<template>
  <div class="form-group">
    <label :for="id">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <select
      :id="id"
      :name="id"
      :value="value"
      :required="required"
      class="form-control"
      @input="$emit('input', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    value: { required: true },
    options: { type: Array },
    required: { type: Boolean, default: false },
    trans: { type: Function, required: true },
  },
};
</script>
