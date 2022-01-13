import { VueConstructor } from 'vue/types/umd';
import * as components from './components';
import defaultConfig from './defaultConfig';
import { mergeDeep } from './lib/utils';
import { Config } from './types/configType';
import ZettoProto from './ZettoVuePrototype';

declare module 'vue/types/vue' {
  interface Vue {
    $zetto: ZettoProto;
  }
}

// install function executed by Vue.use()
export default function installZetto(Vue: VueConstructor, options: any) {
  Vue.mixin({
    beforeCreate() {
      this.$zetto = new ZettoProto(this, options);
    },
  });

  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}

export function defineConfig(config: Partial<Config>): Config {
  return mergeDeep<Config>(defaultConfig, config);
}

export { default as Bootstrap4 } from './models/bootstrap4';
export { default as Bootstrap5 } from './models/bootstrap5';
