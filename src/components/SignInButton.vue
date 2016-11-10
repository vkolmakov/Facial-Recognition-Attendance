<template>
  <button v-if="!isLoading" class="button" @click="onClick">Sign In</button>
  <div v-else class="button"><div class="loading"></div></div>
</template>

<script>
  export default {
   props: ['onClick', 'isLoading'],
  }
</script>

<style scoped>
  .button {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 1.2em;
    font-weight: 600;

    background-color: #55c875;
    color: #fff;

    border: 1px solid #fff;
    border-radius: 10px;

    height: 50px;
    width: 300px;

  }

  div.button {
    display: inherit;
    align-items: center;
    justify-content: center;

    background-color: #3aabd0;
  }

  div.button > .loading {
    width: 20px;
    height: 20px;

    border-radius: 75%;

    border-top: 0.2em solid rgba(255, 255, 255, 0.2);
    border-right: 0.2em solid rgba(255, 255, 255, 0.2);
    border-bottom: 0.2em solid rgba(255, 255, 255, 0.2);
    border-left: 0.2em solid #fff;

    animation: spin 1.1s infinite linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

</style>
