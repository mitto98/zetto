<template>
  <ul class="pagination">
    <li class="page-item">
      <button
        class="page-link"
        :disabled="value === 1"
        @click="$emit('input', 1)"
        aria-label="Prima pagina"
      >
        <span aria-hidden="true">&laquo;</span>
      </button>
    </li>

    <li
      v-for="p in pagesArray"
      :key="p"
      :class="`page-item ${p === value && 'active'}`"
    >
      <button
        :class="`page-link ${p === value && 'active'}`"
        :aria-label="`Pagina ${p}`"
        @click="$emit('input', p)"
      >
        {{ p }}
      </button>
    </li>

    <li class="page-item">
      <button
        class="page-link"
        :disabled="value === numberOfPages"
        @click="$emit('input', numberOfPages)"
        aria-label="Ultima pagina"
      >
        <span aria-hidden="true">&raquo;</span>
      </button>
    </li>
  </ul>
</template>

<script>
const NUMBER_OF_PAGE_BUTTONS = 5;

export default {
  props: {
    value: { type: Number, required: true }, //currentPage
    totalRows: { type: Number, required: true },
    perPage: { type: Number, default: 10 },
    loading: { type: Boolean },
  },
  computed: {
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
