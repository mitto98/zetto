<template>
  <div>
    <search-filter v-if="search" :action="action" @search="doSearch" />

    <table :class="cls.table" v-bind="$attrs">
      <thead v-if="headEnabled" :class="cls.tableHead">
        <tr>
          <th
            v-for="field in tableFields"
            :key="field.name"
            :class="cls.tableHeadCell"
          >
            <slot :name="`head(${field.name})`" :field="field">
              {{ field.label }}
            </slot>
          </th>
        </tr>
        <!-- <tr>
          <th
            v-for="field in tableFields"
            :key="field.name"
            :class="cls.tableHeadCell"
          >
            <input type="text" class="form-control" />
          </th>
        </tr> -->
      </thead>
      <tbody>
        <tr v-if="error">
          <td :colspan="tableFields.length">
            <slot name="error">
              <table-error :message="error" />
            </slot>
          </td>
        </tr>

        <tr v-else-if="loading">
          <td :colspan="tableFields.length">
            <slot name="busy">
              <div style="padding: 20px 0; text-align: center">
                Caricamento...
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else-if="!items.length">
          <td :colspan="tableFields.length">
            <slot name="busy">
              <div style="padding: 20px 0; text-align: center">
                Nessun risultato
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else v-for="item in items" :key="item.key">
          <td v-if="$scopedSlots.row" :colspan="tableFields.length">
            <slot name="row" :action="action" :item="item" />
          </td>
          <td
            v-else
            v-for="field in tableFields"
            :key="field.name"
            :class="cls.tableBodyCell"
          >
            <slot
              :name="`cell(${field.name})`"
              :value="item[field.name]"
              :action="action"
              :item="item"
            >
              {{ item.getDisplayValue(field.name) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination
      v-if="action.totalRecords > pageSize"
      v-model="currentPage"
      :total-rows="action.totalRecords"
      :per-page="pageSize"
      :disabled="loading"
    />
  </div>
</template>

<script>
import { EVENT_NAME_REFRESH_DATA } from '../constants/events';
import classed, { classedProps } from '../mixins/classedMixin';
import { mergeComponentFields } from '../utils/dataMapper.ts';
import { lazyPromise } from '../utils/utils.ts';
import TableError from './fragments/TableError.vue';
import Pagination from './search/Pagination.vue';
import SearchFilter from './search/SearchFilter.vue';

export default {
  name: 'CrudSearch',
  components: { TableError, SearchFilter, Pagination },
  mixins: [classed('search')],
  props: {
    id: { type: String },
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    search: { type: [Boolean, String], default: false },
    // searchField: { type: String },
    // createPage: { type: String },
    // createLabel: { type: String },
    sort: { type: Object },
    // filters: { type: Object },
    headEnabled: { type: Boolean, default: true },
    ...classedProps,
  },
  data: () => ({
    loading: false,
    items: [],
    currentPage: 1,
    formFilters: null,
    error: '',
  }),

  mounted() {
    this.$root.$on(EVENT_NAME_REFRESH_DATA, this.refreshDataHandler);
  },
  beforeDestroy() {
    this.$root.$off(EVENT_NAME_REFRESH_DATA, this.refreshDataHandler);
  },

  created() {
    this.fetchData();
  },

  watch: {
    currentPage() {
      this.fetchData();
    },
  },
  computed: {
    pageSize() {
      if (!this.action) return 0;
      return this.action.config.rowsPerPage || 10;
    },
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
    doSearch(s) {
      this.formFilters = s;
      this.fetchData();
    },
    async fetchData() {
      this.loading = true;
      // const filters = this.filters ? cloneDeep(this.filters) : {};
      // if (this.searchField) filters[this.searchField] = this.search;

      this.items = await lazyPromise(
        this.action.search({
          page: this.currentPage,
          filters: this.formFilters,
          sort: this.sort,
        })
      );

      this.loading = false;
    },
  },
};
</script>
