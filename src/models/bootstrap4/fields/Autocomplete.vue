<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <v-select
      :id="id"
      :name="id"
      :value="value"
      :options="paginated"
      :reduce="(c) => c.value"
      :filterable="false"
      @input="(value) => $emit('input', value)"
      @open="onOpen"
      @close="onClose"
      @search="(query) => (search = query.toLowerCase())"
    >
      <template #list-footer>
        <li v-show="hasNextPage" class="p-2 text-center" ref="load">
          {{ trans('zetto.search.fields.loading_more') }}
        </li>
      </template>
    </v-select>
  </div>
</template>

<script>
import vSelect from 'vue-select';

const NO_ELEMENT_LIMIT = 25;

export default {
  components: { vSelect },
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    value: { required: true },
    options: { type: Array },
    trans: { type: Function, required: true },
  },
  data: () => ({
    observer: null,
    limit: NO_ELEMENT_LIMIT,
    search: '',
  }),
  computed: {
    filtered() {
      return this.options.filter((opt) =>
        opt.label.toLowerCase().includes(this.search)
      );
    },
    paginated() {
      return this.filtered.slice(0, this.limit);
    },
    hasNextPage() {
      return this.paginated.length < this.filtered.length;
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(this.infiniteScroll);
  },
  methods: {
    async onOpen() {
      if (this.hasNextPage) {
        await this.$nextTick();
        this.observer.observe(this.$refs.load);
      }
    },
    onClose() {
      this.observer.disconnect();
    },
    async infiniteScroll([{ isIntersecting, target }]) {
      if (isIntersecting) {
        const ul = target.offsetParent;
        const scrollTop = target.offsetParent.scrollTop;
        this.limit += NO_ELEMENT_LIMIT;
        await this.$nextTick();
        ul.scrollTop = scrollTop;
      }
    },
  },
};
</script>
