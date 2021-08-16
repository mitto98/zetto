<template>
  <button
    :class="`btn btn-${variant || 'secondary'} mr-1`"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="sr-only">loading</span>
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm mr-2"
      role="status"
      aria-hidden="true"
    />
    {{ label }}
  </button>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    type: { type: String, default: 'button' },
    onClick: { type: Function },
    disabled: { type: Boolean },

    variant: { type: String, default: 'secondary' },
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    async handleClick() {
      if (this.onClick) {
        this.loading = true;
        try {
          await this.onClick();
        } finally {
          this.loading = false;
        }
      } else {
        this.$emit('click');
      }
    },
  },
};
</script>
