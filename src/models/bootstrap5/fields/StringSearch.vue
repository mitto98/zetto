<template>
  <div class="form-row mb-3">
    <div class="col-12">
      <label :for="id">{{ label }}</label>
    </div>
    <div class="col-sm-4">
      <select
        :id="`${id}-mode`"
        :name="`${id}-mode`"
        class="form-control"
        :value="value ? value.mode : null"
        @input="handleModeChange"
      >
        <option value="">
          {{ trans('zetto.search.fields.mode.contains') }}
        </option>
        <option value="equals">
          {{ trans('zetto.search.fields.mode.equals') }}
        </option>
        <option value="starts">
          {{ trans('zetto.search.fields.mode.starts') }}
        </option>
        <option value="ends">
          {{ trans('zetto.search.fields.mode.ends') }}
        </option>
      </select>
    </div>
    <div class="col">
      <input
        :id="id"
        :name="id"
        :value="value ? value.value : null"
        type="text"
        class="form-control"
        @input="handleInput"
      />
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
    trans: { type: Function, required: true },
  },
  methods: {
    handleModeChange(e) {
      this.$emit('input', { ...(this.value || {}), mode: e.target.value });
    },
    handleInput(e) {
      this.$emit('input', { ...(this.value || {}), value: e.target.value });
    },
  },
};
</script>
