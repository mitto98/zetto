import Vue from 'vue'
import Zetto from 'zetto'

<% if (options.configPath) { %>
import options from '<%= options.configPath %>'
<% } else { %>
const options = {}
<% } %>

Vue.use(Zetto, options);
