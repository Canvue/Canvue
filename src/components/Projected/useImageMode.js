import {inject} from "vue";
import {clipPathShape} from "./mask";
import ev from "../../const/event";
import {noop} from "@unjuanable/jokes";
import {throttle} from "throttle-debounce";

export function useImageMode(delay) {
    const canvue = inject('canvue')

    /**
     * 绑定舞台数据
     * @param {object} stage - 舞台
     * @param {function} callback
     */
    const bind = (stage, callback = noop) => {
        const shape = clipPathShape.hasOwnProperty(stage.shape) ? stage.shape : 'rect' // 检测形状类型
        const shapeObj = clipPathShape[shape](stage.width, stage.height, stage.offsetX, stage.offsetY) // 创建形状

        const img = new Image(stage.width, stage.height)

        const image = new fabric.Image(img, {
            width: stage.width,
            height: stage.height,
            left: stage.offsetX,
            top: stage.offsetY,
            clipPath: shapeObj
        })
        const refreshFunc = throttle(delay, () => {
            img.src = stage.el.data.stage.toDataURL()
            img.onload = () => {
                image.set('dirty', true);
                callback && callback()
            }
        }, {noLeading: true})

        canvue.on(ev.stage.loaded.handler, refreshFunc, stage.uuid)
        canvue.on(ev.stage.added.handler, refreshFunc, stage.uuid)
        canvue.on(ev.stage.removed.handler, refreshFunc, stage.uuid)
        canvue.on(ev.stage.modified.handler, refreshFunc, stage.uuid)

        refreshFunc && refreshFunc()
        return image
    }

    return {bind}

}
