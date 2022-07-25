import { defineNuxtPlugin } from '#app'
import Zetto from 'zetto';
<%= options.importStatement %>

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(Zetto, options);
});
