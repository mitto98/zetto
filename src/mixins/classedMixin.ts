import { mergeDeep } from '../utils/utils';

const classedMixin = (group: any) => ({
  computed: {
    cls() {
      if (!this.classes) return {};
      return mergeDeep(this.$zetto.options.classes[group], this.classes);
    },
  },
});

export default classedMixin;

export const classedProps = {
  classes: { default: () => ({}) },
};
