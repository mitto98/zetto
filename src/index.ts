import * as components from './components';
import ZettoProto from './ZettoVuePrototype';

// Vue.use(VueFormulate)

// install function executed by Vue.use()
export default function installZetto(Vue: any, options: any) {
  //TODO: Check if vue-formulate is installed

  Vue.mixin({
    beforeCreate() {
      //todo dismettere questo costruttore e fare una cosa tipo https://github.com/kazupon/vue-i18n/blob/v8.x/src/extend.js
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
