<template>
    <p>
        <input type="button" value="PNG" @click="exportPNG"/>
        <input type="button" value="SVG" @click="exportSVG"/>
        <input type="button" value="OBJ" @click="exportOBJ"/>
    </p>
    <div class="uv">
        <v-projected :width="800" :height="400" ref="uv" mode="image" :delay="100" :stages="bindStages"></v-projected>
    </div>
    <div class="canvas">
        <v-stage class="left" :withGuideLine="true" ref="stage" id="stage" :width="800" :height="400" active></v-stage>
    </div>
</template>

<script setup>
import {inject, onMounted, reactive, ref} from "vue";
import ev from "../../src/const/event.js";
import {circle, loadFromURL} from "../../src";

const canvue = inject('canvue')
const uv = ref(null)
const stage = ref(null) // ref 数组
const bindStages = reactive({})

onMounted(() => {
    bindStages["stage"] = {
        id: "stage",
        el: stage.value
    }

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
