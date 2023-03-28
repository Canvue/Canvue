<template>
  <p>
    <input type="button" value="PNG" @click="exportPNG"/>
    <input type="button" value="SVG" @click="exportSVG"/>
    <input type="button" value="OBJ" @click="exportOBJ"/>
  </p>
  <div class="uv">
    <v-projected :width="800" :height="400" ref="uv" mode="image" :lazing="true"></v-projected>
  </div>
  <div class="canvas">
    <v-stage class="left" :withGuideLine="true" ref="stage" id="stage" :width="800" :height="400" active></v-stage>
  </div>
</template>

<script setup>
import {inject, onMounted, ref} from "vue";
import ev from "../../src/const/event.js";
import {circle, loadFromURL} from "../../src/index.js";

const canvue = inject('canvue')
const uv = ref(null)
const stage = ref(null) // ref 数组

onMounted(() => {
  uv.value.bindStage("stage", 800, 400, 0, 0, "rect")

  loadFromURL('/public/images/jiangxi.jpeg', (img) => {
    const image = circle(img, {width: 300, height: 500})
    stage.value.data.stage.add(image)
  })

})
const exportPNG = () => {
  canvue.emit(ev.stage.exportPNG.handler)
}
const exportSVG = () => {
  canvue.emit(ev.stage.exportSVG.handler)
}
const exportOBJ = () => {
  canvue.emit(ev.stage.export.handler)
}
</script>

<style scoped>
input {
  width: 120px;
  height: 30px;
}

.uv {
  background-color: darkgray
}

.canvas {
  background-color: darkgray
}
</style>
