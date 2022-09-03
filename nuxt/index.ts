import {
  defineNuxtModule,
  addPluginTemplate,
  createResolver,
  resolvePath,
} from '@nuxt/kit';
import fs from 'fs';

export default defineNuxtModule({
  meta: {
    name: 'zetto',
    configKey: 'zetto',
    compatibility: {
      nuxt: '^3.0.0-rc.6',
    },
  },
  // Default configuration options for the module
  defaults: {
    configPath: false,
    // vueSelectCSS: true,
  },
  async setup(moduleOptions, nuxt) {
    let importStatement = 'const options = {}';

    const configPath = await resolvePath('zetto.config', {
      extensions: ['.js', '.ts'],
    });

    if (fs.existsSync(configPath)) {
      importStatement = `import options from '${configPath}'`; // Validate js/ts
    }

    // @ts-ignore
    const resolver = createResolver(import.meta.url);
    addPluginTemplate({
      src: resolver.resolve('plugin.ts'),
      options: { importStatement },
    });

    // if (options.vueSelectCSS)
    //   nuxt.options.css.push('font-awesome/css/font-awesome.css')
  },
});
