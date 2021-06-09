const classedMixin = (group) => ({
  computed: {
    classes() {
      return this.$zetto.options.classes[group];
    },
  },
});

export default classedMixin;
