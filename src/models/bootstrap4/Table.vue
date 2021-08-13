<template>
  <div class="table-responsive">
    <table class="table">
      <thead v-if="headEnabled">
        <tr>
          <th
            v-for="field in fields"
            :key="field.name"
            scope="col"
            @click="() => onSortChange(field.name)"
          >
            <slot
              :name="`head(${field.name})`"
              :field="field"
              :sort="sort && sort.field === field.name ? sort.direction : null"
            >
              <slot
                name="head"
                :field="field"
                :sort="
                  sort && sort.field === field.name ? sort.direction : null
                "
              >
                <span class="d-block" style="cursor: pointer">
                  {{ field.label }}
                  <span>
                    <i
                      :style="{
                        borderBottomColor:
                          sort &&
                          sort.property === field.name &&
                          sort.direction === 'desc'
                            ? '#dee2e6'
                            : 'black',
                      }"
                      style="
                        display: inline-block;
                        border-bottom: 0.3em solid;
                        border-right: 0.3em solid transparent;
                        border-top: 0;
                        border-left: 0.3em solid transparent;
                        position: relative;
                        left: 9px;
                        bottom: 6px;
                      "
                    />
                    <i
                      :style="{
                        borderTopColor:
                          sort &&
                          sort.property === field.name &&
                          sort.direction === 'asc'
                            ? '#dee2e6'
                            : 'black',
                      }"
                      style="
                        display: inline-block;
                        border-top: 0.3em solid;
                        border-right: 0.3em solid transparent;
                        border-bottom: 0;
                        border-left: 0.3em solid transparent;
                        position: relative;
                      "
                    />
                  </span>
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
              <div
                style="padding: 20px 0; text-align: center; font-weight: bold"
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 50 50"
                  style="height: 60px; margin-bottom: 0.4rem"
                  xml:space="preserve"
                >
                  <circle style="fill: #d75a4a" cx="25" cy="25" r="25" />
                  <polyline
                    style="
                      stroke: #ffffff;
                      stroke-width: 2;
                      stroke-linecap: round;
                    "
                    points="16,34 25,25 34,16"
                  />
                  <polyline
                    style="
                      stroke: #ffffff;
                      stroke-width: 2;
                      stroke-linecap: round;
                    "
                    points="16,16 25,25 34,34"
                  />
                </svg>
                <br />
                {{ errror }}
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else-if="loading">
          <td :colspan="fields.length">
            <slot name="busy">
              <div style="padding: 20px 0; text-align: center">
                <!-- {{ $trans('zetto.search.loading') }} -->
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else-if="!items.length">
          <td :colspan="fields.length">
            <slot name="empty">
              <div style="padding: 20px 0; text-align: center">
                <!-- {{ $trans('zetto.search.no_results') }} -->
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
export default {
  props: {
    fields: { type: Array, required: true },
    items: { type: Array, required: true },
    headEnabled: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
    sort: { typ: Object },

    error: { required: true },
    action: { required: true },
  },
  methods: {
    onSortChange(field) {
      const SortDirMap = { asc: 'desc', desc: null };
      let direction = this.sort?.direction
        ? SortDirMap[this.sort?.direction]
        : 'asc';

      if (this.sort?.property !== field) direction = 'asc';

      if (direction) {
        this.$emit('sort', { direction: direction, property: field });
      } else {
        this.$emit('sort', null);
      }
    },
  },
};
</script>
