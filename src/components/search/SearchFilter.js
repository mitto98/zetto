import { h } from 'vue';
import { debounce } from 'lodash';
import translatorMixin from '../../mixins/translatorMixin';
import modelMixin, { modelMixinProps } from '../../mixins/modelMixin';
import { buildSearchForm } from '../../lib/forms/searchForm';
import { mergeComponentFields } from '../../lib/fields';

export default {
  name: 'SearchFilter',
  mixins: [translatorMixin, modelMixin],
  props: {
    action: { type: Object, required: true },
    fields: { type: Object, default: () => ({}) },
    expanded: { type: Boolean, required: true },
    ...modelMixinProps,
  },
  data: () => ({
    schema: [],
    value: {},
  }),
  created() {
    this.loadSchema();
  },
  watch: {
    value: {
      deep: true,
      handler: debounce(function () {
        this.$emit('search', this.value);
      }, 300),
    },
  },
  methods: {
    async loadSchema() {
      if (!this.action) return;
      let fields = mergeComponentFields(
        this.action.getSearchableProperties(),
        this.fields
      );

      this.schema = await buildSearchForm(this.action, fields);
    },
  },
  render() {
    if (!this.schema || !this.expanded) return;

    const button = this.getModelComponent('button');

    return h(
      'form',
      {
        autocomplete: 'off',
        class: 'form-row my-3',
      },
      [
        this.schema.map((field) =>
          h('div', { key: field.name, class: 'col-md-6' }, [
            h(this.getModelField(field.type), {
              id: field.name,
              props: {
                id: field.name,
                ...field,
                trans: this.$trans,
                value: this.value[field.name],
              },
              on: {
                input: (value) => {
                  this.value = { ...this.value, [field.name]: value };
                },
              },
            }),
          ])
        ),
        h('div', { class: 'col-12' }, [
          h(button, {
            props: { label: this.$trans('zetto.search.filter_clean') },
            on: {
              click: () => {
                this.value = {};
              },
            },
          }),
        ]),
      ]
    );
  },
};
