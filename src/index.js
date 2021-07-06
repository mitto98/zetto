import * as components from './components';
import ZettoProto from './ZettoVuePrototype';

// Vue.use(VueFormulate)

// install function executed by Vue.use()
export default function installZetto(Vue, options) {
  //TODO: Check if vue-formulate is installed

  Vue.mixin({
    beforeCreate() {
      this._zRoot = new ZettoProto(this, options);
    },
  });

  if (!Vue.prototype.$zetto) {
    Object.defineProperty(Vue.prototype, '$zetto', {
      get() {
        if (!this || !this._zRoot) console.warn('[Zetto] Cannot access vue VM');

        return this._zRoot;
      },
    });
  }

  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}
