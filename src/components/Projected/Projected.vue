<template>
    <canvas v-show="show" :id="id" ref="projected">
        <slot></slot>
    </canvas>
</template>

<script>
import {markRaw, onMounted, ref, watch} from "vue";
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
        config: {type: Object},
        width: {type: Number, default: 1024},
        height: {type: Number, default: 1024},
        bgColor: {type: String, default: 'rgba(255,255,255,0)'},
        delay: {type: Number, default: 0},
        mode: {
            type: String, default: 'pattern', validator(value) {
                return ['pattern', 'image'].includes(value);
            }
        },
    },
    emits: ["change"],
    setup(props, ctx) {
        const projected = ref(null) // Canvas DOM
        const data = markRaw({
            viewport: null,
        })
        const defaultStageOpts = {
            uuid: null, el: null, width: 0, height: 0, offsetX: 0, offsetY: 0, shape: 'rect'
        }

        const {bind} = props.mode === 'pattern' ? usePatternMode(props.delay) : useImageMode(props.delay)

        /**
         * 绑定Stage组件
         * @param {string} uuid StageUUID
         * @param {object|null} el StageRef
         * @param {number} width 宽度
         * @param {number} height 高度
         * @param {number} offsetX X偏移量
         * @param {number} offsetY Y偏移量
         * @param {string} shape 形状，默认：rect
         */
        const bindStage = (uuid, el, width, height, offsetX, offsetY, shape) => {
            const stage = Object.assign({}, defaultStageOpts, {uuid, el, width, height, offsetX, offsetY, shape})
            let area = bind(stage, () => {
                data.viewport.renderAll()
                ctx.emit("change", uuid)
            })
            data.viewport.add(area)
        }

        onMounted(() => {
            data.viewport = createView(projected.value, props.id, props.config)
            data.viewport.setWidth(props.width)
            data.viewport.setHeight(props.height)
            data.viewport.setBackgroundColor(props.bgColor)
        })

        return {data, projected, bindStage}
    }
}
</script>
