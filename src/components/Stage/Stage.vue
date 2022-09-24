<template>
  <div class="stage" :id="id" :style="style">
    <canvas ref="c">
      <slot></slot>
    </canvas>
    <unj-loading v-if="process.loading"></unj-loading>
  </div>
</template>

<script>
import {ref, reactive, inject, computed, watchEffect, onMounted, onUnmounted, markRaw} from "vue";
import {UnjLoading} from '@unjuanable/viper';
import {useLifecycle} from "./useLifecycle";
import {useExportHandler} from "./useExportHandler";
import {useCenteringGuides} from "./useCenteringGuides";
import {useAligningGuides} from "./useAligningGuides";

import ev from "../../const/event";
import {createUUID} from "../../libs";

export default {
  components: {UnjLoading},
  props: {
    id: {
      type: String, default() {
        return createUUID()
      }
    },
    config: {type: Object},
    width: {type: Number, default: 1024},
    height: {type: Number, default: 1024},
    zoom: {type: Number, default: 1.0},
    drawable: {type: Boolean, default: false},
    backgroundColor: {type: String},
    backgroundImage: {type: String},
    overlayColor: {type: String},
    overlayImage: {type: String},
    active: {type: Boolean, default: false},
    withGuideLine: {type: Boolean, default: true},
  },
  emits: ['update:width', 'update:height', 'update:drawable', 'update:zoom', 'loaded'],
  setup(props, ctx) {
    const canvue = inject('canvue') // global variable
    const c = ref(null) // refs['c']

    const data = reactive({
      stage: null,
      zoom: 1.0
    })

    const process = reactive(useLifecycle(props.id))
    const {addExportsListener} = useExportHandler(props.id)
    const {initCenteringGuides} = useCenteringGuides()
    const {initAligningGuides} = useAligningGuides()

    /** 计算当前舞台画布的尺寸 **/
    const style = computed(() => {
      if (process.mounted) {
        canvue.emit(ev.stage.resize.handler, {width: props.width, height: props.height}, props.id)
        canvue.emit(ev.stage.zoom.handler, props.zoom, props.id)
        return {
          width: props.width * props.zoom + 'px',
          height: props.height * props.zoom + 'px',
        }
      }
      return null
    })

    /**
     * 切换涂鸦模式
     */
    watchEffect(() => {
      if (process.mounted) {
        data.stage.isDrawingMode = props.drawable
      }
    })

    /**
     * 背景
     */
    watchEffect(() => {
      if (process.mounted) {
        data.stage.backgroundColor = props.backgroundColor
        data.stage.backgroundImage = props.backgroundImage
      }
    })

    /**
     * 前景
     */
    watchEffect(() => {
      if (process.mounted) {
        data.stage.overlayColor = props.overlayColor
        data.stage.overlayImage = props.overlayImage
      }
    })

    /** ⬇⬇⬇ 生命周期 ⬇⬇⬇ **/
    onMounted(() => {
      const stage = canvue.createStage(c.value, props.id, props.config)
      data.stage = markRaw(stage)

      props.active && canvue.setActive(props.id, (originStageUUID) => {
        canvue.emit(ev.activate.handler, props.id)
        canvue.emit(ev.inactivate.handler, originStageUUID)
      })

      props.withGuideLine && canvue.options.aligningGuidelines && initAligningGuides(stage)
      props.withGuideLine && canvue.options.centeringGuidelines && initCenteringGuides(stage)

      addExportsListener()

      data.stage.on('path:created', () => {
        canvue.emit(ev.stage.clear.handler, null, props.id)
      })
      data.stage.on('object:added', () => {
        canvue.emit(ev.stage.added.handler, data.stage, props.id)
      })
      data.stage.on('object:modified', () => {
        canvue.emit(ev.stage.modified.handler, data.stage, props.id)
      })
      data.stage.on('before:render', () => {
        canvue.emit(ev.stage.rendering.handler, data.stage, props.id)
      })
      data.stage.on('after:render', () => {
        canvue.emit(ev.stage.rendered.handler, data.stage, props.id)
      })

      /** 重置宽高 **/
      canvue.on(ev.stage.resize.handler, (size) => {
        data.stage.setDimensions({
          width: props.width,
          height: props.height,
        }, {backstoreOnly: true})
        size.width !== props.width && ctx.emit('update:width', size.width)
        size.height !== props.height && ctx.emit('update:height', size.height)
      }, props.id)

      /** 重置比例 **/
      canvue.on(ev.stage.zoom.handler, (zoom) => {
        data.stage.setDimensions({
          width: props.width * zoom + 'px',
          height: props.height * zoom + 'px'
        }, {cssOnly: true})
        zoom !== props.zoom && ctx.emit('update:zoom', zoom)
      }, props.id)

      /** 加载完成 **/
      canvue.emit(ev.stage.loaded.handler, stage, props.id)

      process.mounted = true
      ctx.emit('loaded', stage, props.id)
    })

    onUnmounted(() => {
      canvue.destroyStage(props.id)
    })

    return {
      c, process, data, style,
    }
  }
}
</script>

