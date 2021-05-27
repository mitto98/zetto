<template>
  <div>
    <!-- <b-col md="6">
      <search-input-field v-if="searchField" v-model="search" class="mb-2"/>
    </b-col>

    <b-col v-if="createPage" offset-md="3" md="3" class="pb-2">
      <b-btn variant="primary" :to="createPage" block>
        <b-icon icon="plus"/>
        {{ createLabel || action.config.createTitle }}
      </b-btn>
    </b-col> -->

    <table class="table min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="field in tableFields"
            :key="field.name"
            class="
              px-6
              py-3
              text-left text-xs
              font-medium
              text-gray-500
              tracking-wider
            "
          >
            <slot :name="`head(${field.name})`">
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
          <td
            v-for="field in tableFields"
            :key="field.name"
            class="px-6 py-4 whitespace-nowrap"
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
      v-if="action.totalRecords > action.config.rowsPerPage"
      v-model="currentPage"
      :total-rows="action.totalRecords"
      :per-page="action.config.rowsPerPage"
      :disabled="loading"
    />

    <!-- 
    <button @click="loading = !loading">Toggle loading</button> &nbsp;
    <button @click="error = error ? null : 'Errore generico'">
      Toggle error
    </button> 
    -->
    <!--
      <b-pagination v-if="action.totalRecords > action.config.rowsPerPage"
                    :total-rows="action.totalRecords"
                    :per-page="action.config.rowsPerPage"
                    :disabled="$fetchState.pending"
                    align="right"/>
     -->
  </div>
</template>

<script>
import { cloneDeep, debounce } from 'lodash';
import { mergeComponentFields } from '../utils/dataMapper';
import { lazyPromise } from '../utils/utils';
import TableError from './fragments/TableError.vue';
import Pagination from './search/Pagination.vue';

export default {
  name: 'CrudSearch',
  components: { TableError, Pagination },
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
    pageSize: null,
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
