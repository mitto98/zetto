import Vue from 'vue'
import * as components from 'zetto';

<% if (options.configPath) { %>
import options from '<%= options.configPath %>'
<% } else { %>
const options = {}
<% } %>

<% if (options.registerFormulate) { %>
import VueFormulate from '@braid/vue-formulate';
Vue.use(VueFormulate, options.formulate);
<% } %>


Object.entries(components).forEach(([componentName, component]) => {
  Vue.component(componentName, component);
});
