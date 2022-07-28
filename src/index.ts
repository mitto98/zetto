import mitt from 'mitt';
import { defu } from 'defu';
import * as components from './components';
import { Config } from './types/configType';
import defaultConfig from './defaultConfig';

type Events = {
  refreshData: string;
  // bar?: number;
};

declare module '@vue/runtime-core' {
  interface Vue {
    $zetto: {
      refresh: (id: string) => void;
      options: Config;
    };
  }
}

export default {
  install: (app, options: Config) => {
    const emitter = mitt<Events>();

    app.config.globalProperties.$zettoEventEmitter = emitter;
    app.config.globalProperties.$zetto = {
      options: defu(options, defaultConfig),
      refresh(id: string) {
        emitter.emit('refreshData', id);
      },
    };

    Object.entries(components).forEach(([componentName, component]) => {
      app.component(componentName, component);
    });
  },
};

export type { Config } from './types/configType';
export type { default as DataBroker } from './dataBrokers/DataBroker';
export { default as Bootstrap4 } from './models/bootstrap4';
export { default as Bootstrap5 } from './models/bootstrap5';
