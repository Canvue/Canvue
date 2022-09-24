<template>
  <test-u-v/>
</template>

<script>
import TestUV from "./components/TestUV.vue";

export default {
  name: "Example",
  components: {TestUV},
  setup() {

  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

</style>