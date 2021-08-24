<template>
  <div class="table-responsive">
    <table class="table">
      <thead v-if="headEnabled">
        <tr>
          <th
            v-for="field in fields"
            :key="field.name"
            scope="col"
            @click="() => onSortChange(field)"
          >
            <slot
              :name="`head(${field.name})`"
              :field="field"
              :sort="getFieldSortDirection(field)"
            >
              <slot
                name="head"
                :field="field"
                :sort="getFieldSortDirection(field)"
              >
                <span
                  class="d-block"
                  :style="{
                    cursor: isFieldSortable(field) ? 'pointer' : 'default',
                  }"
                >
                  {{ field.label }}
                  <sort-order-span
                    v-if="isFieldSortable(field)"
                    :direction="getFieldSortDirection(field)"
                  />
                </span>
              </slot>
            </slot>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="error">
          <td :colspan="fields.length">
            <slot name="error">
              <table-error :message="error" />
            </slot>
          </td>
        </tr>

        <tr v-else-if="loading">
          <td :colspan="fields.length">
            <slot name="busy">
              <div style="padding: 20px 0; text-align: center">
                {{ trans('zetto.search.loading') }}
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else-if="!items.length">
          <td :colspan="fields.length">
            <slot name="empty">
              <div style="padding: 20px 0; text-align: center">
                {{ trans('zetto.search.no_results') }}
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else v-for="item in items" :key="item.key">
          <td v-if="$scopedSlots.row" :colspan="fields.length">
            <slot name="row" :action="action" :item="item" />
          </td>
          <td v-else v-for="field in fields" :key="field.name">
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
</template>

<script>
import SortOrderSpan from './components/SortOrderSpan.vue';
import TableError from './components/TableError.vue';

export default {
  components: { SortOrderSpan, TableError },
  props: {
    fields: { type: Array, required: true },
    items: { type: Array, required: true },
    headEnabled: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
    sort: { typ: Object },

    error: { required: true },
    action: { required: true },
    trans: { required: true },
  },
  methods: {
    isFieldSortable(field) {
      return field.sortable !== false && !field.custom;
    },
    getFieldSortDirection(field) {
      if (this.isFieldSortable(field))
        return this.sort && this.sort.property === field.name
          ? this.sort.direction
          : null;
    },
    onSortChange(field) {
      if (!this.isFieldSortable(field)) return;

      const SortDirMap = { asc: 'desc', desc: null };
      let direction = this.sort?.direction
        ? SortDirMap[this.sort?.direction]
        : 'asc';

      if (this.sort?.property !== field.name) direction = 'asc';

      this.$emit(
        'sort',
        direction ? { direction: direction, property: field.name } : null
      );
    },
  },
};
</script>
