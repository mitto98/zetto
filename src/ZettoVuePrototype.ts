import { EVENT_NAME_REFRESH_DATA } from './constants/events';
import defaultConfig from './defaultConfig';
import { mergeDeep } from './lib/utils';

export default class ZettoProto {
  #vm: any;
  #options: any;

  constructor(vm: any, options: any) {
    this.#vm = vm;
    this.#options = mergeDeep(defaultConfig, options);
  }

  get options() {
    return this.#options;
  }

  /**
   * @deprecated Use reload
   */
  refresh(id: string) {
    this.reload(id);
  }

  reload(id: string) {
    if (id && this.#vm.$root) this.#vm.$root.$emit(EVENT_NAME_REFRESH_DATA, id);
  }
}
