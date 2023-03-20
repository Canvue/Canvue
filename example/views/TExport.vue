<template>
  <p>
    <input type="button" value="PNG" @click="exportPNG"/>
    <input type="button" value="SVG" @click="exportSVG"/>
    <input type="button" value="OBJ" @click="exportOBJ"/>
  </p>
  <div class="uv">
    <v-uv :width="800" :height="400" ref="uv" mode="image" :lazing="true"></v-uv>
  </div>
  <div class="canvas">
    <v-stage class="left" :withGuideLine="true" ref="stage" id="stage" :width="800" :height="400" active></v-stage>
  </div>
</template>

<script setup>
import {inject, onMounted, ref} from "vue";
import ev from "../../src/const/event.js";


const canvue = inject('canvue')
const uv = ref(null)
const stage = ref(null) // ref 数组

onMounted(() => {
  uv.value.bindStage("stage", 800, 400, 0, 0, "rect")

  const img = new Image()
  img.src = '/public/images/jiangxi.jpeg'

  const image = new fabric.Image(img, {
    width: 400,
    height: 400,
    left: 0,
    top: 0,
    dirty: true,
    clipPath: new fabric.Ellipse({
      rx: 200,
      ry: 200,
      originX: 'center',
      originY: 'center',
    }),
  })
  img.onload = () => {
    stage.value.data.stage.add(image)
  }
})
const exportPNG = () => {
  console.log(canvue)
  canvue.emit(ev.stage.exportPNG.handler)
}
const exportSVG = () => {
  console.log("svg")
  canvue.emit(ev.stage.exportSVG.handler)
}
const exportOBJ = () => {
  console.log("obj")
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
