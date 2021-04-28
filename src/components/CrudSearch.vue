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
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
          >
            <slot :name="`head(${field.name})`">
              {{ field.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.key">
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

    <!--
      <b-table striped hover show-empty responsive
               :busy="$fetchState.pending"
               :fields="tableFields"
               :items="items"
               v-bind="$attrs"
               empty-text="Nessun risultato trovato">
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
          <slot :name="name" v-bind="slotData"/>
        </template>
        <template v-slot:cell()="{item, field}">
          <span>{{ item.getDisplayValue(field.key) }}</span>
        </template>
      </b-table>

      <b-pagination v-if="action.totalRecords > action.config.rowsPerPage"
                    v-model="currentPage"
                    :total-rows="action.totalRecords"
                    :per-page="action.config.rowsPerPage"
                    :disabled="$fetchState.pending"
                    align="right"/>
     -->
  </div>
</template>

<script>
import { cloneDeep, debounce, isFunction, uniqBy } from 'lodash';
import { mergeComponentFields } from '../utils/dataMapper';
// import SearchInputField from '~/components/crud-pages/SearchInputField';

export default {
  name: 'CrudSearch',
  // components: {SearchInputField},
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
    items: [],
    currentPage: 1,
    search: '',
  }),

  fetchDelay: 300,
  async fetch() {
    await this.fetchData();
  },

  watch: {
    trigger() {
      this.$fetch();
    },
    search: debounce(function () {
      this.$fetch();
    }, 300),
    currentPage() {
      this.$fetch();
    },
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
    async fetchData() {
      const filters = this.filters ? cloneDeep(this.filters) : {};
      if (this.searchField) filters[this.searchField] = this.search;

      this.items = await this.action.search({
        page: this.currentPage,
        filters,
        sort: this.sort,
      });
    },
  },
};
</script>