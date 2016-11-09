<template>
  <button :class="[destructive ? 'destructive' : 'default']" @click="onClick">{{ text }}</button>
</template>

<script>
  export default {
    props: ['onClick', 'text', 'destructive'],
  }
</script>

<style scoped>
  button {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;

    height: 35px;
    width: 60px;

    padding: 0;
    border: none;

    margin-left: 1px;
    font-weight: 600;
    color: #fff;
  }

  button.default{
    background-color: #3aabd0;
  }

  button.destructive {
    background-color: #fba49e;
  }
</style>
