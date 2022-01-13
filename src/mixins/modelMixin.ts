import Model from '../types/ModelType';

export default {
  computed: {
    activeModel() {
      return this.model || 'default';
    },
    modelComponents() {
      return this.$zetto.options.models[this.activeModel];
    },
  },
  methods: {
    getModelComponent(name: keyof Model) {
      const comp = this.modelComponents[name];
      if (!comp) throw new Error(`Unknown component: ${name}`);
      return comp;
    },
    getModelField(fieldType: string) {
      const FF = this.modelComponents.formFields;
      return FF[fieldType] || FF.string;
    },
  },
};

export const modelMixinProps = {
  model: { type: [String] },
};
