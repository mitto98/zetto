<template>
  <formulate-form
    v-if="schema && expanded"
    v-model="value"
    :schema="schema"
    autocomplete="off"
  />
</template>

<script>
import { debounce } from 'lodash';
import translatorMixin from '../../mixins/translatorMixin';
import {
  buildSearchForm,
  searchFormToFilterOptions,
} from '../../lib/forms/searchForm';

export default {
  name: 'SearchFilter',
  mixins: [translatorMixin],
  props: {
    action: { type: Object, required: true },
    expanded: { type: Boolean, required: true },
  },
  data: () => ({
    schema: null,
    value: null,
    cacheSearchOpts: null,
  }),
  created() {
    this.loadSchema();
  },

  watch: {
    value: debounce(function () {
      this.cacheSearchOpts = searchFormToFilterOptions(
        this.action.getSearchableProperties(),
        this.value
      );
    }, 300),
    cacheSearchOpts(opts) {
      this.$emit('search', opts);
    },
  },
  methods: {
    async loadSchema() {
      if (!this.action) return;
      this.schema = await buildSearchForm(
        this.action,
        this.fields,
        () => (this.value = {}),
        this.$trans
      );
    },
  },
};
</script>
