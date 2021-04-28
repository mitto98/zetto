<template>
  <b-input-group class="search-input">
    <template v-slot:prepend>
      <b-input-group-text class="bg-white pr-1">
        <b-icon icon="search"/>
      </b-input-group-text>
    </template>
    <b-form-input class="border-left-0"
                  placeholder="Cerca..."
                  :value="value"
                  @input="val => $emit('input', val)"/>
  </b-input-group>
</template>

<script>
export default {
  name: "SearchInputField",
  props: ['value'],
}
</script> s

<style scoped lang="sass">
.search-input

  &:focus-within
    outline: 0
    box-shadow: 0 0 0 0.2rem rgba(0, 109, 171, 0.25)

    .input-group-prepend
      border: 1px solid #2cb2ff
      border-right: none
      .input-group-text
        border: none

  input:focus
    box-shadow: none
    border-left: 1px solid white !important
</style>
