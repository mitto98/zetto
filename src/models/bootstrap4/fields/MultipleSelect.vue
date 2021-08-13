<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <v-select
      :id="id"
      :name="id"
      :value="value"
      :options="options"
      :reduce="(c) => c.value"
      multiple
      @input="(value) => $emit('input', value)"
    />
  </div>
</template>

<script>
import vSelect from 'vue-select';

export default {
  components: { vSelect },
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    value: { required: true },
    options: { type: Array },
  },
};
</script>
