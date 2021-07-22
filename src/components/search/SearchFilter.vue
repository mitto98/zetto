<template>
  <formulate-form
    v-if="schema"
    v-model="value"
    :schema="schema"
    autocomplete="off"
  />
</template>

<script>
import { debounce } from 'lodash';
import { mergeComponentFields } from '../../utils/dataMapper';
import {
  mapSearchPropertyToFormulateField,
  searchFormToFilterOptions,
} from '../../lib/forms/searchForm';

export default {
  name: 'SearchFilter',
  props: {
    action: { type: Object, required: true },
  },
  data: () => ({
    schema: null,
    value: null,
  }),
  created() {
    this.loadSchema();
  },

  watch: {
    value: debounce(function () {
      const filterOpts = searchFormToFilterOptions(
        this.action.getSearchableProperties(),
        this.value
      );
      if (filterOpts) this.$emit('search', filterOpts);
    }, 300),
  },
  methods: {
    async loadSchema() {
      if (!this.action) return;
      let fields = mergeComponentFields(
        this.action.getSearchableProperties(),
        this.fields
      );
      this.schema = [
        {
          component: 'div',
          class: 'form-row',
          children: await Promise.all(
            fields.map((field) => {
              const sp = this.action.getSelectionProviderByPropertyName(
                field.name
              );
              return mapSearchPropertyToFormulateField(field, sp);
            })
          ),
        },
      ];
    },
  },
};
</script>
