import Vue from 'vue';
import { VueConstructor } from 'vue/types/umd';
import * as components from './components';
import ZettoProto from './ZettoVuePrototype';

declare module 'vue/types/vue' {
  interface Vue {
    $zetto: ZettoProto;
  }
}

// install function executed by Vue.use()
export default function installZetto(Vue: VueConstructor, options: any) {
  //TODO: Check if vue-formulate is installed
  // Vue.use(VueFormulate)

  Vue.mixin({
    beforeCreate() {
      this.$zetto = new ZettoProto(this, options);
    },
  });

  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}
