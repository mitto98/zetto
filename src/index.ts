import * as components from './components';
import ZettoProto from './ZettoVuePrototype';

declare module '@vue/runtime-core' {
  interface Vue {
    $zetto: ZettoProto;
  }
}

export default {
  install: (app, options) => {
    app.config.globalProperties.$zetto = new ZettoProto(app, options);

    Object.entries(components).forEach(([componentName, component]) => {
      app.component(componentName, component);
    });
  },
};

export type { Config } from './types/configType';
export { default as Bootstrap4 } from './models/bootstrap4';
export { default as Bootstrap5 } from './models/bootstrap5';
