<template>
  <div class="uv">
    <v-uv :width="800" :height="400" ref="uv" mode="image" :lazing="false"></v-uv>
  </div>
  <div class="canvas">
    <template v-for="item in list">
      <v-stage class="left" :withGuideLine="false" :ref="(el)=>getArea(el,item.id)" :id="item.id" :width="item.width" :height="item.height"></v-stage>
    </template>
  </div>
</template>

<script>

import {inject, onMounted, reactive, ref} from "vue";

export default {
  name: "TestUV",
  setup() {
    const canvue = inject('canvue')
    const uv = ref(null)
    const areas = {} // ref 数组
    /**
     * 动态获取动态生成的ref列表值
     * @param el
     */
    const getArea = (el, id) => {
      if (el) {
        areas[id] = el;
      }
    }
    /**
     * 测试数据
     * @type {UnwrapNestedRefs<[{shape: string, width: number, x: number, y: number, id: string, height: number},{shape: string, width: number, x: number, y: number, id: string, height: number}]>}
     */
    const list = reactive([{
      id: 'aaa', width: 400, height: 400, x: 0, y: 0, shape: 'ellipse'
    }, {
      id: 'bbb', width: 400, height: 400, x: 400, y: 0, shape: 'rect'
    }])

    onMounted(() => {
      for (let item of list) {
        uv.value.bindStage(item.id, item.width, item.height, item.x, item.y, item.shape)
      }
      areas['aaa'].data.stage.add(new fabric.Rect({width: 400, height: 400, left: 100, top: 100, fill: 'red'}))
      areas['bbb'].data.stage.add(new fabric.Rect({width: 400, height: 400, fill: 'blue'}))

      // const img = new Image()
      // img.src = '/public/images/jiangxi.jpeg'
      //
      // const image = new fabric.Image(img, {
      //   width: 400,
      //   height: 400,
      //   left: 0,
      //   top: 0,
      //   dirty: true,
      //   clipPath: new fabric.Ellipse({
      //     rx: 200,
      //     ry: 200,
      //     originX: 'center',
      //     originY: 'center',
      //   }),
      // })
      // img.onload = () => {
      //   areas['aaa'].data.stage.add(image)
      // }
    })

    return {uv, getArea, list}
  }
}
</script>

<style>
.left {
  float: left;
}
</style>
