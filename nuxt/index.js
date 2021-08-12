import fs from 'fs';
import path from 'path';

const nuxtOptions = {
  configPath: false,
  vueSelectCSS: true,
};

export default function (moduleOptions) {
  let options = Object.assign(nuxtOptions, this.options.zetto, moduleOptions);

  if (
    !options.configPath &&
    fs.existsSync(`${this.options.srcDir}/zetto.config.js`)
  ) {
    options.configPath = '~/zetto.config.js';
  }

  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: options,
  });

  if (options.vueSelectCSS) {
    this.options.css.unshift('vue-select/src/scss/vue-select.scss');
  }
}
