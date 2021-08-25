<template>
  <form v-if="schema && expanded" class="form-row my-3">
    <div v-for="fs in schema" :key="fs.name" class="col-md-6">
      <component
        :is="getFieldComponent(fs.type)"
        :id="fs.name"
        :trans="$trans"
        v-bind="fs"
        v-model="value[fs.name]"
      />
    </div>
    <div class="col-12">
      <Button
        @click="value = {}"
        :label="$trans('zetto.search.filter_clean')"
      />
    </div>
  </form>
</template>

<script>
import { debounce } from 'lodash';
import translatorMixin from '../../mixins/translatorMixin';
import { buildSearchForm } from '../../lib/forms/searchForm';
import { mergeComponentFields } from '../../lib/fields';
import { Button, FormFields } from '../../models/bootstrap4';

export default {
  name: 'SearchFilter',
  components: { Button },
  mixins: [translatorMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    expanded: { type: Boolean, required: true },
  },
  data: () => ({
    schema: [],
    value: {},
  }),
  created() {
    this.loadSchema();
  },

  watch: {
    value: {
      deep: true,
      handler: debounce(function () {
        this.$emit('search', this.value);
      }, 300),
    },
  },
  methods: {
    getFieldComponent(type) {
      return FormFields[type] || FormFields.string;
    },
    async loadSchema() {
      if (!this.action) return;
      let fields = mergeComponentFields(
        this.action.getSearchableProperties(),
        this.fields
      );

      this.schema = await buildSearchForm(this.action, fields);
    },
  },
};
</script>
