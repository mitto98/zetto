<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <date-picker :value="value" @input="(x) => $emit('input', x)">
      <template v-slot="{ inputValue, inputEvents }">
        <input
          :id="id"
          :value="inputValue"
          :required="required"
          class="form-control"
          placeholder="dd/mm/yyyy"
          v-on="inputEvents"
        />
      </template>
    </date-picker>
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

export default {
  components: { DatePicker },
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    value: { required: true },
    required: { type: Boolean, default: false },
    trans: { type: Function, required: true },
  },
};
</script>
