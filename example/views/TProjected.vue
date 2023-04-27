<template>
    <div class="uv" style="zoom:20%">
        <v-projected ref="projected" :width="1024" :height="1024" mode="image" :delay="0"
                     @change="onChange"></v-projected>
    </div>
    <div class="canvas">
        <template v-for="item in list">
            <v-stage class="left" :withGuideLine="false" :ref="(el)=>getStages(el,item.id)" :id="item.id"
                     :width="item.width" :height="item.height">
            </v-stage>
        </template>
    </div>
    <div class="operation">
        <input type="button" @click="add(0)" value="添加"/>
        <input type="button" @click="del(0)" value="删除"/>
    </div>
</template>

<script setup>

import {inject, onMounted, reactive, ref} from "vue";
import ev from "../../src/const/event";


const canvue = inject('canvue')
const projected = ref(null)
const stages = {} // stage refs

/**
 * 动态获取动态生成的ref列表值
 * @param el
 * @param id
 */
const getStages = (el, id) => {
    if (el) {
        stages[id] = el
    }
}

const onChange = () => {
    // uv.value.data.stage.renderAll()
}

const list = reactive([{
    id: 'aaa', width: 300, height: 300, offsetX: 0, offsetY: 0, shape: 'ellipse'
}, {
    id: 'bbb', width: 300, height: 300, offsetX: 450, offsetY: 0, shape: 'rect'
}])

const res = [
    new fabric.Rect({width: 400, height: 400, left: 100, top: 100, fill: 'red'}),
    new fabric.Rect({width: 400, height: 400, fill: 'blue'})
]

const del = (id) => {
    stages['aaa'].el.data.stage.remove(res[id])
}

const add = (id) => {
    stages['aaa'].el.data.stage.add(res[id])
}

onMounted(() => {
    for (let item of list) {
        projected.value.bindStage(item.id, stages[item.id], item.width, item.height, item.offsetX, item.offsetY, item.shape)
    }
    stages['aaa'].$el.onmousewheel = (e) => {
        e.preventDefault();
        res[0].objectCaching = false;
        res[0].scale(res[0].scaleX + (e.wheelDeltaY / 10000))
        canvue.emit(ev.stage.modified.handler, null, 'aaa')
        stages['aaa'].data.stage.renderAll()
        return false
    }
    stages['aaa'].data.stage.add(res[0])
    stages['bbb'].data.stage.add(res[1])
})
</script>

<style>
.left {
    float: left;
}
</style>
