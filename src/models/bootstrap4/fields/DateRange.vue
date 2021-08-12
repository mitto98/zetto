<template>
  <div class="form-row">
    <div class="col-sm">
      <date
        :id="`${id}_from`"
        :value="val.min"
        :label="trans('zetto.search.fields.range_from', { label })"
        :trans="trans"
        @input="handleMinChange"
      />
    </div>
    <div class="col-sm">
      <date
        :id="`${id}_to`"
        :value="val.max"
        :label="trans('zetto.search.fields.range_to', { label })"
        :trans="trans"
        @input="handleMaxChange"
      />
    </div>
  </div>
</template>

<script>
import Date from './Date.vue';

export default {
  components: { Date },
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    value: { required: true },
    trans: { type: Function, required: true },
  },
  computed: {
    val() {
      if (this.value) return this.value;
      return {};
    },
  },
  methods: {
    handleMinChange(val) {
      this.$emit('input', { ...this.val, min: val });
    },
    handleMaxChange(val) {
      this.$emit('input', { ...this.val, max: val });
    },
  },
};
</script>
