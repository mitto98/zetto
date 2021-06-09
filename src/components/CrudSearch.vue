<template>
  <div>
    <table :class="classes.table">
      <thead :class="classes.tableHead">
        <tr>
          <th
            v-for="field in tableFields"
            :key="field.name"
            :class="classes.tableHeadCell"
          >
            <slot :name="`head(${field.name})`" :field="field">
              {{ field.label }}
            </slot>
          </th>
        </tr>
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
            <slot name="row" :item="item" />
          </td>
          <td
            v-else
            v-for="field in tableFields"
            :key="field.name"
            :class="classes.tableBodyCell"
          >
            <slot
              :name="`cell(${field.name})`"
              :value="item[field.name]"
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
import { cloneDeep, debounce } from 'lodash';
import classed from '../mixins/classed';
import { mergeComponentFields } from '../utils/dataMapper';
import { lazyPromise } from '../utils/utils';
import TableError from './fragments/TableError.vue';
import Pagination from './search/Pagination.vue';

export default {
  name: 'CrudSearch',
  components: { TableError, Pagination },
  mixins: [classed('search')],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    searchField: { type: String },
    createPage: { type: String },
    createLabel: { type: String },
    sort: { type: Object },
    filters: { type: Object },
    trigger: { type: Number },
  },
  data: () => ({
    loading: false,
    items: [],
    currentPage: 1,
    search: '',
    error: '',
  }),

  created() {
    this.fetchData();
  },

  watch: {
    trigger() {
      this.fetchData();
    },
    search: debounce(function () {
      this.fetchData();
    }, 300),
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
    async fetchData() {
      this.loading = true;
      const filters = this.filters ? cloneDeep(this.filters) : {};
      if (this.searchField) filters[this.searchField] = this.search;

      this.items = await lazyPromise(
        this.action.search({
          page: this.currentPage,
          filters,
          sort: this.sort,
        })
      );

      this.loading = false;
    },
  },
};
</script>
