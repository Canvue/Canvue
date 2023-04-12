<template>
    <canvas :id="id" ref="projected">
        <slot></slot>
    </canvas>
</template>

<script>
import {inject, markRaw, onMounted, ref} from "vue";
import {usePatternMode} from "./usePatternMode";
import {useImageMode} from "./useImageMode";
import {createUUID, createView} from '../../libs'
import ev from "../../const/event";

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
        config: {type: Object},
        width: {type: Number, default: 1024},
        height: {type: Number, default: 1024},
        bgColor: {type: String, default: 'rgba(255,255,255.0)'},
        lazing: {type: Boolean, default: false},
        mode: {
            type: String, default: 'pattern', validator(value) {
                return ['pattern', 'image'].includes(value);
            }
        }
    },
    emits: ["change"],
    setup(props, ctx) {
        const canvue = inject('canvue') // global variable
        const projected = ref(null) // Canvas DOM
        const data = markRaw({
            viewport: null
        })

        const {stages, init} = props.mode === 'pattern' ? usePatternMode() : useImageMode()
        const bindStage = (uuid, width, height, offsetX, offsetY, shape = 'rect') => {
            /** 监听：舞台加载 **/
            canvue.on(ev.stage.loaded.handler, onChange, uuid)
            canvue.on(ev.stage.added.handler, onChange, uuid)
            canvue.on(ev.stage.removed.handler, onChange, uuid)
            /** 监听：舞台渲染 OR 舞台开对象发生修改**/
            props.lazing ? canvue.on(ev.stage.modified.handler, onChange, uuid) : canvue.on(ev.stage.rendered.handler, onChange, uuid)

            /**
             * 监听内容修改
             * @param stage
             */
            function onChange(stage) {
                if (data.viewport) {
                    if (!stages.hasOwnProperty(uuid)) {
                        const area = init(stage, uuid, width, height, offsetX, offsetY, shape)
                        data.viewport.add(area)
                    }
                    data.viewport.requestRenderAll()
                    ctx.emit("change", uuid)
                }
            }
        }

        onMounted(() => {
            data.viewport = createView(projected.value, props.id, props.config)
            data.viewport.setWidth(props.width)
            data.viewport.setHeight(props.height)
            data.viewport.setBackgroundColor(props.bgColor)
        })

        return {projected, bindStage}
    }
}
</script>
