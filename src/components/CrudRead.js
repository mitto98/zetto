import { h } from 'vue';
import { mergeComponentFields } from '../lib/fields';
import translatorMixin from '../mixins/translatorMixin';
import modelMixin, { modelMixinProps } from '../mixins/modelMixin';
import GuidamiBroker from '../dataBrokers/GuidamiBroker';

export default {
  name: 'CrudRead',
  mixins: [translatorMixin, modelMixin],
  props: {
    id: { type: String },
    // action: { type: [Object, String], required: true },
    fields: { type: Object, default: () => ({}), required: false },
    entity: { type: [Object, String, Number], required: true },
    ...modelMixinProps,
  },
  data: () => ({
    loading: false,
    loadedItem: null,
    dataBroker: null,
  }),
  created() {
    this.$zettoEventEmitter.on('refreshData', this.refreshDataHandler);
    console.log({ ...this.$props }, { ...this.$attrs });
    this.dataBroker = new GuidamiBroker({ ...this.$attrs });
    this.fetchData();
  },
  beforeDestroy() {
    this.$zettoEventEmitter.off('refreshData', this.refreshDataHandler);
  },
  computed: {
    tableFields() {
      if (!this.dataBroker) return [];
      return mergeComponentFields(this.dataBroker.getReadFields(), this.fields);
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
      this.loadedItem = await this.dataBroker.get(this.entity);
      this.$emit('loaded', this.entity);
      this.loading = false;
    },
  },
  render() {
    if (this.loading) return h('p', this.$trans('zetto.search.loading'));
    return h(this.getModelComponent('detail'), {
      props: {
        fields: this.tableFields,
        item: this.item,
        loading: this.loading,
      },
      scopedSlots: this.$scopedSlots,
    });
  },
};
