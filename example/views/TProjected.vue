<template>
    <div class="uv" style="zoom:20%">
        <v-projected :width="1024" :height="1024" ref="uv" mode="image" :delay="500" :stages="areas"
                     @change="onChange">
        </v-projected>
    </div>
    <div class="canvas">
        <template v-for="item in list">
            <v-stage class="left" :withGuideLine="false" :ref="(el)=>getArea(el,item.id)" :id="item.id"
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


const canvue = inject('canvue')
const uv = ref(null)
const areas = {} // ref 数组

/**
 * 动态获取动态生成的ref列表值
 * @param el
 * @param id
 */
const getArea = (el, id) => {
    if (el) {
        for (let item of list) {
            if (item.id === id) {
                areas[id] = {
                    uuid: id,
                    el: el,
                    width: item.width,
                    height: item.height,
                    offsetX: item.offsetX,
                    offsetY: item.offsetY,
                    shape: item.shape
                };
            }
        }

    }
}

const onChange = () => {
    uv.value.render()
    // uv.value.data.stage.renderAll()
}
/**
 * 测试数据
 * @type {UnwrapNestedRefs<[{shape: string, width: number, x: number, y: number, id: string, height: number},{shape: string, width: number, x: number, y: number, id: string, height: number}]>}
 */
const list = reactive([{
    id: 'aaa', width: 450, height: 450, offsetX: 0, offsetY: 0, shape: 'ellipse'
}, {
    id: 'bbb', width: 400, height: 400, offsetX: 450, offsetY: 0, shape: 'rect'
}])

const res = [
    new fabric.Rect({width: 400, height: 400, left: 100, top: 100, fill: 'red'}),
    new fabric.Rect({width: 400, height: 400, fill: 'blue'})
]

const del = (id) => {
    areas['aaa'].el.data.stage.remove(res[id])
}

const add = (id) => {
    areas['aaa'].el.data.stage.add(res[id])
}

onMounted(() => {
    // areas['aaa'].$el.onmousewheel = (e) => {
    //     e.preventDefault();
    //     res[0].objectCaching = false;
    //     res[0].scale(res[0].scaleX + (e.wheelDeltaY / 10000))
    //
    //     areas['aaa'].data.stage.renderAll()
    //     return false
    // }
    areas['aaa'].el.data.stage.add(res[0])
    areas['bbb'].el.data.stage.add(res[1])
})
</script>

<style>
.left {
    float: left;
}
</style>
