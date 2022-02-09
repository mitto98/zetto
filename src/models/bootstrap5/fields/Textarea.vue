<template>
  <div class="mb-3">
    <label :for="id">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <textarea
      :id="id"
      :name="id"
      :value="value"
      :required="required"
      :rows="rows"
      v-bind.prop="$attrs"
      class="form-control"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    value: { required: true },
    required: { type: Boolean, default: false },
    //Placeholder
    rows: { type: Number, default: 3 },
  },
  computed: {
    htmlType() {
      if (this.type === 'string') return 'text';
      return this.type;
    },
  },
};
</script>
