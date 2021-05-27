// import VueFormulate from '@braid/vue-formulate'
import * as components from './components';
import defaultConfig from './defaultConfig';
import { mergeDeep } from './utils/utils';

// Vue.use(VueFormulate)

// install function executed by Vue.use()
export default function installZetto(Vue, options) {
  Vue.prototype.$zetto = {
    options: mergeDeep(defaultConfig, options),
  };

  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}

// export * from './components';
