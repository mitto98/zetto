<template>
  <div style="padding: 20px 0; text-align: center; font-weight: bold">
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
        style="stroke: #ffffff; stroke-width: 2; stroke-linecap: round"
        points="16,34 25,25 34,16"
      />
      <polyline
        style="stroke: #ffffff; stroke-width: 2; stroke-linecap: round"
        points="16,16 25,25 34,34"
      />
    </svg>
    <br />
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: { type: String },
  },
};
</script>
