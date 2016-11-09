<template>
  <i :class="['fa fa-lg', isShown ? 'fa-times' : 'fa-bars']" aria-hidden="true" @click="onClick"b></i>
</template>

<script>
  export default {
    props: ['onClick', 'isShown']
  }
</script>

<style scoped>
  i {
    color: #fff;
    margin-left: 10px;
  }
</style>
