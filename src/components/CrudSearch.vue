<template>
  <div>
    <h1 v-if="title">
      <!-- <slot
        name="title"
        :openFilter="() => (expanded = !expanded)"
        isFilterOpen="expanded"
      > -->
      {{ elementTitle }}
      <button class="btn btn-link" @click="expanded = !expanded">Filtra</button>
      <!-- </slot> -->
    </h1>

    <search-filter
      v-if="search"
      :action="action"
      :expanded="expanded"
      @search="doSearch"
    />

    <div :class="cls.tableWrapper">
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
              <slot name="empty">
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
    </div>

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
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import listenOnRoot from '../mixins/listenOnRoot';
import { mergeComponentFields } from '../lib/fields';
import { lazyPromise } from '../lib/utils.ts';
import TableError from './fragments/TableError.vue';
import Pagination from './search/Pagination.vue';
import SearchFilter from './search/SearchFilter.vue';

export default {
  name: 'CrudSearch',
  components: { TableError, SearchFilter, Pagination },
  mixins: [titledMixin, classed('search'), listenOnRoot],
  props: {
    id: { type: String },
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    search: { type: [Boolean, String], default: false },
    pageSize: { type: [Number, Boolean], default: 10 },
    // searchField: { type: String },
    // createPage: { type: String },
    // createLabel: { type: String },
    sort: { type: Object },
    // filters: { type: Object },
    headEnabled: { type: Boolean, default: true },
    ...classedProps,
    ...titledMixinProps,
  },
  data: () => ({
    loading: false,
    items: [],
    currentPage: 1,
    formFilters: null,
    error: '',
    expanded: false,
  }),

  mounted() {
    this.listenOnRoot(EVENT_NAME_REFRESH_DATA, this.refreshDataHandler);
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
    compPageSize() {
      if (!this.action) return 0;
      if (this.pageSize === false) return 0;
      return this.pageSize || this.action.config.rowsPerPage || 10;
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
      const searchParams = {
        page: this.currentPage,
        filters: this.formFilters,
        sort: this.sort,
      };

      // Pagination settings
      if (this.pageSize === false) searchParams.pagination = false;
      else searchParams.pageSize = this.compPageSize;

      // Prop filters
      // const filters = this.filters ? cloneDeep(this.filters) : {};
      // if (this.searchField) filters[this.searchField] = this.search;

      try {
        this.items = await lazyPromise(this.action.search(searchParams));
      } catch (e) {
        this.error = 'Errore, impossibile caricaricare i dati!';
      }

      this.loading = false;
    },
  },
};
</script>
