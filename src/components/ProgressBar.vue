<template>
  <div>
    <progress max="1" :value="progress"></progress>
  </div>
</template>

<script>
  export default {
    props: ['progress']
  }
</script>

<style scoped>
  * > progress {
    -webkit-appearance: none;
  }

  * > progress::-webkit-progress-value {
    transition: width 1s ease-out;
  }

  * > progress::-webkit-progress-bar {
    background: #fafafa;
  }
</style>
