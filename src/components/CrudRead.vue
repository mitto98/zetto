<template>
  <div>
    <h1 v-if="title">{{ elementTitle }}</h1>
    <dl>
      <div v-for="field in tableFields" :key="field.name">
        <dt>{{ field.label }}</dt>
        <dd v-if="value">
          <slot
            :name="`data(${field.name})`"
            :value="value[field.name]"
            :item="value"
          >
            {{ value.getDisplayValue(field.name) }}
          </slot>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import { mergeComponentFields } from '../lib/fields';
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import listenOnRoot from '../mixins/listenOnRoot';
import { EVENT_NAME_REFRESH_DATA } from '../constants/events';

export default {
  name: 'CrudRead',
  mixins: [titledMixin, listenOnRoot],
  props: {
    id: { type: String },
    action: { type: [Object, String], required: true },
    fields: { type: Array, default: null },
    entity: { type: [String, Number], required: true },
    ...titledMixinProps,
  },
  data: () => ({
    isLoading: true,
    value: null,
  }),
  mounted() {
    this.listenOnRoot(EVENT_NAME_REFRESH_DATA, this.refreshDataHandler);
    this.fetchData();
  },
  computed: {
    tableFields() {
      if (!this.action) return [];

      return mergeComponentFields(
        this.action.getSummaryAttributes(),
        this.fields
      );
    },
  },
  methods: {
    async refreshDataHandler(id) {
      if (this.id && this.id === id) await this.fetchData();
    },
    async fetchData() {
      this.isLoading = true;
      this.value = await this.action.get(this.entity);
      this.isLoading = false;
    },
  },
};
</script>
