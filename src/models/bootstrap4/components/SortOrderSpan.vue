<template>
  <span>
    <i
      :style="{
        borderBottomColor: direction === 'desc' ? '#dee2e6' : 'black',
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
        borderTopColor: direction === 'asc' ? '#dee2e6' : 'black',
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
</template>

<script>
export default {
  props: ['direction'],
};
</script>
