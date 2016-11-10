<template>
  <div>
    {{ message }}
  </div>
</template>

<script>
  export default {
    props: ['message'],
  }

</script>

<style scoped>
  div {
    color: #fba49e;
    font-size: 1.8em;
    font-weight: 500;
  }
</style>
