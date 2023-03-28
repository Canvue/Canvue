<template>
  <div class="canvas">
    <v-stage class="left" :withGuideLine="true" ref="stage" id="stage" :width="400" :height="400" active></v-stage>
  </div>
  <img ref="image" src='/public/images/tt.jpeg'/>
</template>


<script setup>
import {inject, onMounted, ref, toRaw} from "vue";
import {circle, loadFromURL} from "../../src/index.js";

const canvue = inject('canvue')
const stage = ref(null) // ref 数组
const image = ref(null)

onMounted(() => {
  loadFromURL('/public/images/jiangxi.jpeg', (img) => {
    const obj = circle(img, {width: 300, height: 500})
    stage.value.data.stage.add(obj)
  })

})

</script>

<style scoped>

</style>
