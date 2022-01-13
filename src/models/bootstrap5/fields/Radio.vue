<template>
  <div>
    <label :class="{ 'd-block': inline }">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <div
      v-for="opt in options"
      :key="opt.value"
      class="form-check"
      :class="{ 'form-check-inline': inline }"
    >
      <label :for="`${id}-${opt.value}`" class="form-check-label">
        <input
          :id="`${id}-${opt.value}`"
          :name="id"
          :value="opt.value"
          :checked="value === opt.value"
          type="radio"
          class="form-check-input"
          @input="$emit('input', opt.value)"
        />
        {{ opt.label }}
      </label>
    </div>
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
    // Component specific
    inline: { type: Boolean, default: false },
    trans: { type: Function, required: true },
    required: { type: Boolean, default: false },
  },
};
</script>
