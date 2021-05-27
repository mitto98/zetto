import Vue from 'vue'
import Zetto from 'zetto'

<% if (options.configPath) { %>
import options from '<%= options.configPath %>'
<% } else { %>
const options = {}
<% } %>

<% if (options.registerFormulate) { %>
import VueFormulate from '@braid/vue-formulate';
Vue.use(VueFormulate, options.formulate);
<% } %>

Vue.use(Zetto, options);
