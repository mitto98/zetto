// import Vue from 'vue'
// import VueFormulate from '@braid/vue-formulate'
import * as components from './components';

// Vue.use(VueFormulate)


// install function executed by Vue.use()
export default function installCavolacci(Vue) {
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
};

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from './components';