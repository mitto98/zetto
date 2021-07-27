import { isString } from 'lodash';
import { accessDotPath } from '../lib/utils';
import * as locales from '../locales';

export default {
  created() {
    this.$trans = (key: string, ...params: any[]): string => {
      const locale = this.$i18n?.locale || this.$zetto.options.locale;
      let res: string;

      if (this.$t) {
        res = this.$t(key, ...params);
        if (res !== key) return res;
      }

      res = accessDotPath(key, locales[locale]);
      if (isString(res)) {
        //Replace placeholders
        return res.replace(/\{([A-Za-z._\-$]+)}/gi, (_m, g) => params[0][g]);
      }
      return key;
    };
  },
};
