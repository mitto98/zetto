import * as components from './components';
import defaultConfig from './defaultConfig.ts';
import { mergeDeep } from './utils/utils.ts';

// Vue.use(VueFormulate)

// install function executed by Vue.use()
export default function installZetto(Vue, options) {
  //TODO: Check if vue-formulate is installed

  Vue.prototype.$zetto = {
    options: mergeDeep(defaultConfig, options),
  };

  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}
