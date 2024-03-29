import { mergeComponentFields } from '../lib/fields';
import titledMixin, { titledMixinProps } from '../mixins/titledMixin';
import listenOnRoot from '../mixins/listenOnRoot';
import translatorMixin from '../mixins/translatorMixin';
import modelMixin, { modelMixinProps } from '../mixins/modelMixin';
import { EVENT_NAME_REFRESH_DATA } from '../constants/events';

export default {
  name: 'CrudRead',
  mixins: [titledMixin, listenOnRoot, translatorMixin, modelMixin],
  props: {
    id: { type: String },
    action: { type: [Object, String], required: true },
    fields: { type: Object, default: () => ({}) },
    entity: { type: [Object, String, Number], required: true },
    ...titledMixinProps,
    ...modelMixinProps,
  },
  data: () => ({
    loading: false,
    loadedItem: null,
  }),
  mounted() {
    this.listenOnRoot(EVENT_NAME_REFRESH_DATA, this.refreshDataHandler);
    this.fetchData();
  },
  computed: {
    tableFields() {
      if (!this.action) return [];
      return mergeComponentFields(this.action.properties, this.fields);
    },
    item() {
      if (this.entity._isPortofinoEntity) return this.entity;
      return this.loadedItem;
    },
  },
  methods: {
    async refreshDataHandler(id) {
      if (this.id && this.id === id) await this.fetchData();
    },
    async fetchData() {
      if (this.entity._isPortofinoEntity) return;
      this.loading = true;
      this.loadedItem = await this.action.get(this.entity);
      this.$emit('loaded', entity);
      this.loading = false;
    },
  },
  render(h) {
    if (this.loading) return h('p', this.$trans('zetto.search.loading'));
    return h('div', [
      this.title && h('h1', this.elementTitle),
      h(this.getModelComponent('detail'), {
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
