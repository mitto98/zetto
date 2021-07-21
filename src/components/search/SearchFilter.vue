<template>
  <div v-if="schema && expanded" class="search-filter">
    <formulate-form v-model="form" :schema="schema" autocomplete="off" />
  </div>
</template>

<script>
import { debounce } from 'lodash';
import {
  mapSearchPropertyToFormulateField,
  mergeComponentFields,
  searchFormToFilterOptions,
} from '../../utils/dataMapper';

export default {
  name: 'SearchFilter',
  props: {
    action: { type: Object, required: true },
    expanded: { type: Boolean, required: true },
  },
  data: () => ({
    schema: null,
    form: null,
  }),
  created() {
    this.loadSchema();
  },

  watch: {
    form: debounce(function () {
      const filterOpts = searchFormToFilterOptions(
        this.action.getSearchableProperties(),
        this.form
      );
      console.log(filterOpts);
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
