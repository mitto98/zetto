<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="htmlType"
      :name="id"
      :value="value"
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
  },
  computed: {
    htmlType() {
      if (this.type === 'string') return 'text';
      return this.type;
    },
  },
};
</script>
