<template>
  <nav>
    {{ pagesArray }}
    <ul class="pagination justify-content-end">
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Precedente">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Precedente</span>
        </a>
      </li>
      <li
        v-for="p in pagesArray"
        :key="p"
        :class="`${'page-item'} ${p === value ? 'active' : ''}`"
        @click="$emit('input', p)"
      >
        <a class="page-link" href="#">{{ p + 1 }}</a>
      </li>
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Successivo">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Successivo</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    value: { type: Number, required: true }, //currentPAge
    totalRows: { type: Number, required: true },
    perPage: { type: Number, default: 10 },
  },
  computed: {
    numberOfPages() {
      const result = this.totalRows / this.perPage;
      return result < 1 ? 1 : result;
    },
    pagesArray() {
      const pages = [];

      if (this.numberOfPages > 3) {
        console.log('ciao');
        if (this.value === 0) {
          for (let i = 0; i < 3; i++) {
            pages.push(i);
          }
        } else if (this.value === this.numberOfPages - 1) {
          for (let i = this.value; i < this.numberOfPages; i++) {
            pages.push(i);
          }
        } else {
          for (let i = this.value - 1; i < this.value + 1; i++) {
            pages.push(i);
          }
        }
      } else {
        console.log('amigo');
        for (let i = 0; i < this.numberOfPages; i++) {
          pages.push(i);
        }
      }

      return pages;
    },
  },
};
</script>
