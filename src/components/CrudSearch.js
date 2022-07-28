import { h } from 'vue';
import translatorMixin from '../mixins/translatorMixin';
import modelMixin, { modelMixinProps } from '../mixins/modelMixin';
import SearchFilter from './search/SearchFilter';
import { mergeComponentFields } from '../lib/fields';
import { lazyPromise } from '../lib/utils';

export default {
  name: 'CrudSearch',
  mixins: [translatorMixin, modelMixin],
  props: {
    id: { type: String },
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    searchFields: { type: Object, default: () => ({}) },
    search: { type: [Boolean, String], default: false },
    pageSize: { type: [Number, Boolean], default: 10 },
    // searchField: { type: String },
    // createPage: { type: String },
    // createLabel: { type: String },
    // sort: { type: Object },
    // filters: { type: Object },
    showFilters: { type: Boolean, default: false },
    buttons: { type: Array, default: () => [] },
    headEnabled: { type: Boolean, default: true },
    ...modelMixinProps,
  },
  data: () => ({
    loading: false,
    items: [],
    currentPage: 1,
    formFilters: null,
    sort: null,
    error: '',
  }),
  mounted() {
    this.$zettoEventEmitter.on('refreshData', this.refreshDataHandler);
    this.dataBroker = new GuidamiBroker(this.$props);
    this.fetchData();
  },
  beforeDestroy() {
    this.$zettoEventEmitter.off('refreshData', this.refreshDataHandler);
  },
  watch: {
    currentPage() {
      this.fetchData();
    },
    sort() {
      this.fetchData();
    },
  },
  computed: {
    compPageSize() {
      if (!this.dataBroker) return 0;
      if (this.pageSize === false) return 0;
      return this.pageSize || this.action.config.rowsPerPage || 10;
    },
    tableFields() {
      if (!this.dataBroker) return [];

      return mergeComponentFields(
        this.dataBroker.getSearchFields(),
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
      this.$emit('search', s);
      this.fetchData();
    },
    async fetchData() {
      this.loading = true;

      try {
        this.items = await lazyPromise(
          this.dataBroker.search(
            this.formFilters,
            this.sort,
            this.currentPage,
            this.compPageSize
          )
        );
        this.$emit('loaded', this.items);
      } catch (e) {
        this.error = 'Errore, impossibile caricaricare i dati!';
      }

      this.loading = false;
    },
  },
  render() {
    return h('div', [
      this.search &&
        h(SearchFilter, {
          props: {
            action: this.action,
            fields: this.searchFields,
            expanded: this.showFilters,
            model: this.model,
          },
          on: { search: this.doSearch },
        }),
      h(this.getModelComponent('table'), {
        props: {
          fields: this.tableFields,
          items: this.items,
          sort: this.sort,
          headEnabled: this.headEnabled,
          loading: this.loading,
          error: this.error,
          action: this.action,
          trans: this.$trans,
        },
        on: {
          sort: (sort) => {
            this.sort = sort;
          },
        },
        scopedSlots: this.$scopedSlots,
      }),
      h('div', { class: 'd-flex justify-content-between w-100' }, [
        h(
          'div',
          this.buttons.map((btn) =>
            h(this.getModelComponent('button'), {
              key: btn.label,
              props: btn,
            })
          )
        ),
        this.action.totalRecords > this.pageSize &&
          h(this.getModelComponent('pagination'), {
            props: {
              value: this.currentPage,
              totalRows: this.action.totalRecords,
              perPage: this.pageSize,
              loading: this.loading,
            },
            on: {
              input: (page) => {
                this.currentPage = page;
              },
            },
          }),
      ]),
    ]);
  },
};
