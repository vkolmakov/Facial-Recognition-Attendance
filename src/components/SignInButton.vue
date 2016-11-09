<template>
  <button class="button" @click="onClick">Sign In</button>
</template>

<script>
  export default {
   props: ["onClick"],
  }
</script>

<style scoped>
  button {
    background-color: #55c875;
    color: #fff;

    border: 1px solid #fff;
    border-radius: 10px;

    height: 50px;
    width: 300px;

    font-size: 1.2em;
    font-weight: 600;
  }
</style>
