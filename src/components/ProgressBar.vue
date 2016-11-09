<template>
  <progress max="1" :value="progress" :class="color"></progress>
</template>

<script>
  export default {
    props: ['progress'],

    computed: {
      color() {
        return {
          start: this.progress < 0.4,
          middle: this.progress >= 0.4 && this.progress < 0.8,
          end: this.progress >= 0.8,
        }
      },
    },
  }
</script>

<style scoped>
  progress {
    -webkit-appearance: none;
  }

  progress[value] {
    height: 50px;
    width: 300px;
  }

  progress::-webkit-progress-bar {
    background: #fafafa;
    border: 1px solid #fff;
    border-radius: 10px;
  }

  progress::-webkit-progress-value {
    transition: all 1s ease-out;
    border-radius: 10px;
  }

  progress.start::-webkit-progress-value {
    background: #fba49e;
  }

  progress.middle::-webkit-progress-value {
    background: #3aabd0;
  }

  progress.end::-webkit-progress-value {
    background: #55c875;
  }
</style>
