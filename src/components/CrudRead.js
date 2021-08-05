import { mergeComponentFields } from '../lib/fields';
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import listenOnRoot from '../mixins/listenOnRoot';
import { EVENT_NAME_REFRESH_DATA } from '../constants/events';
import { Detail } from '../models/bootstrap4';

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
    loading: true,
    item: null,
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
      this.loading = true;
      this.item = await this.action.get(this.entity);
      this.loading = false;
    },
  },
  render(h) {
    return h('div', [
      h('h1', this.elementTitle),
      h(Detail, {
        props: {
          fields: this.tableFields,
          item: this.item,
          loading: this.loading,
        },
        scopedSlots: this.$scopedSlots,
      }),
    ]);
  },
};
