<template>
    <canvas v-show="show" :id="id" ref="projected">
        <slot></slot>
    </canvas>
</template>

<script>
import {markRaw, onMounted, ref} from "vue";
import {usePatternMode} from "./usePatternMode";
import {useImageMode} from "./useImageMode";
import {createUUID, createView} from '../../libs'

/**
 * 舞台图像投影的画布
 *    可以对应多个不同的舞台，将他们的投影组合在一起
 */
export default {
    name: "Projected",
    props: {
        id: {
            type: String, default() {
                return createUUID()
            }
        },
        show: {type: Boolean, default: true},
        teleport: {type: String},
        config: {type: Object},
        width: {type: Number, default: 1024},
        height: {type: Number, default: 1024},
        bgColor: {type: String, default: 'rgba(255,255,255.0)'},
        delay: {type: Number, default: 0},
        mode: {
            type: String, default: 'pattern', validator(value) {
                return ['pattern', 'image'].includes(value);
            }
        },
        stages: {type: Object}
    },
    emits: ["change"],
    setup(props, ctx) {
        const projected = ref(null) // Canvas DOM
        const data = markRaw({
            viewport: null,
        })
        const defaultStageValue = {
            uuid: null, el: null, width: 0, height: 0, offsetX: 0, offsetY: 0, shape: 'rect'
        }

        const {bind} = props.mode === 'pattern' ? usePatternMode(props.delay) : useImageMode(props.delay)

        const render = () => {
            if (data.viewport) {
                data.viewport.renderAll()
            }
        }

        onMounted(() => {
            data.viewport = createView(projected.value, props.id, props.config)
            data.viewport.setWidth(props.width)
            data.viewport.setHeight(props.height)
            data.viewport.setBackgroundColor(props.bgColor)
            for (let key in props.stages) {
                let stage = Object.assign({}, defaultStageValue, props.stages[key])
                let area = bind(stage, () => {
                    console.log("render")
                    data.viewport.requestRenderAll()
                    ctx.emit("change", stage.uuid)
                })
                data.viewport.add(area)
            }
        })

        return {data, render, projected, bind}
    }
}
</script>
