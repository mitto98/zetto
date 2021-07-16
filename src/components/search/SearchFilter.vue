<template>
  <div>
    <formulate-form
      v-if="schema"
      v-model="form"
      :schema="schema"
      @submit="handleSubmit"
      autocomplete="off"
    />
    <pre>{{ form }}</pre>
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
      this.$emit(
        'search',
        searchFormToFilterOptions(
          this.action.getSearchableProperties(),
          this.form
        )
      );
    }, 300),
  },
  methods: {
    async loadSchema() {
      if (!this.action) return;

      let fields = mergeComponentFields(
        this.action.getSearchableProperties(),
        this.fields
      );

      this.schema = await Promise.all(
        fields.map((field) => {
          const sp = this.action.getSelectionProviderByPropertyName(field.name);
          return mapSearchPropertyToFormulateField(field, sp);
        })
      );
    },
    handleSubmit(x) {
      this.action.getSearchableProperties().forEach((prop) => {});
      console.log(x);
    },
  },
};
</script>
