import fs from 'fs';
import path from 'path';

const defaultConfig = {
  configPath: false,
  registerFormulate: true,
};

export default function (moduleOptions) {
  let options = Object.assign(defaultConfig, this.options.zetto, moduleOptions);

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
}
