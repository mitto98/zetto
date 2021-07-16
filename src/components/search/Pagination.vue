<template>
  <nav>
    <ul :class="classes.ul">
      <li :class="`${classes.li} ${classes.first}`">
        <button
          :class="classes.button"
          :disabled="value === 1"
          @click="$emit('input', 1)"
          aria-label="Precedente"
        >
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Precedente</span>
        </button>
      </li>

      <li
        v-for="p in pagesArray"
        :key="p"
        :class="`${classes.li} ${p === value ? classes.active : ''}`"
      >
        <button
          :class="`${classes.button} ${p === value ? classes.active : ''}`"
          @click="$emit('input', p)"
        >
          {{ p }}
        </button>
      </li>

      <li :class="`${classes.li} ${classes.last}`">
        <button
          :class="classes.button"
          :disabled="value === numberOfPages"
          @click="$emit('input', numberOfPages)"
          aria-label="Successivo"
        >
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Successivo</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
const NUMBER_OF_PAGE_BUTTONS = 5;

export default {
  props: {
    value: { type: Number, required: true }, //currentPage
    totalRows: { type: Number, required: true },
    perPage: { type: Number, default: 10 },
  },
  computed: {
    classes() {
      return this.$zetto.options.classes.search.pagination;
    },
    numberOfPages() {
      return Math.ceil(this.totalRows / this.perPage);
    },
    pagesArray() {
      const pages = [];

      if (this.numberOfPages > NUMBER_OF_PAGE_BUTTONS) {
        let start = this.value - Math.floor(NUMBER_OF_PAGE_BUTTONS / 2);
        if (start <= 0) start = 1;

        let end = start + NUMBER_OF_PAGE_BUTTONS;
        if (end > this.numberOfPages) {
          end = this.numberOfPages + 1;
          start = end - NUMBER_OF_PAGE_BUTTONS;
        }

        for (let i = start; i < end; i++) {
          pages.push(i);
        }
      } else {
        for (let i = 1; i <= this.numberOfPages; i++) {
          pages.push(i);
        }
      }

      return pages;
    },
  },
};
</script>
