<template>
  <canvas :id="id" ref="c">
    <slot></slot>
  </canvas>
</template>

<script>
import {onMounted, onUnmounted, inject, reactive, ref, watch} from "vue";
import {createView, createUUID} from '../../libs'

/**
 * 图层预览组件
 *    将舞台中的对象提取出来加载并预览
 */
export default {
  props: {
    id: {
      type: String, default() {
        return createUUID()
      }
    },
    klass: {type: Object},
    config: {type: Object},
    width: {type: Number, default: 80},
    height: {type: Number, default: 80},
  },
  setup(props, context) {
    const canvue = inject('canvue') // global variable
    const c = ref(null) // Canvas DOM

    const data = reactive({
      viewport: null
    })

    const scale = reactive({
      x: 1,
      y: 1,
      max: 1,
      min: 1
    })

    /**
     * 显示预览效果
     */
    const onPreview = () => {
      if (!data.viewport) return
      scale.x = props.width / props.klass.width
      scale.y = props.height / props.klass.height
      scale.max = scale.x > scale.y ? scale.x : scale.y
      scale.min = scale.x <= scale.y ? scale.x : scale.y
      data.viewport.clear()
      props.klass.clone((obj) => {
        obj.scale(scale.min, scale.min)
        data.viewport.add(obj)
        obj.centerH()
        obj.centerV()
        data.viewport.renderAll()
      })
    }

    watch(() => props.klass, (val, oldVal) => {
      if (val && val !== oldVal) {
        val.on('modified', onPreview)
        oldVal && oldVal.off('modified', onPreview)
        onPreview()
      }
    }, {immediate: true, deep: true})

    onMounted(() => {
      data.viewport = createView(c.value, props.id, props.config)
      data.viewport.setWidth(props.width)
      data.viewport.setHeight(props.height)
      onPreview()
    })

    onUnmounted(() => {
    })

    return {
      c
    }
  }
}
</script>
