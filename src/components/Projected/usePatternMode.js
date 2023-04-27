import {patternMaskShape} from './mask'
import {noop} from "@unjuanable/jokes";
import {inject} from "vue";
import ev from "../../const/event";
import {throttle} from 'throttle-debounce';

export function usePatternMode(delay) {
    const canvue = inject('canvue') // global variable
    /**
     * 绑定舞台数据
     * @param {object} stage - 舞台
     * @param {function} callback
     */
    const bind = (stage, callback = noop) => {
        const pattern = new fabric.Pattern({
            source: stage.el.data.stage,
            repeat: 'no-repeat',
            crossOrigin: 'anonymous',
        });
        const shape = patternMaskShape.hasOwnProperty(stage.shape) ? stage.shape : 'rect' // 检测形状类型
        const shapeObj = patternMaskShape[shape](stage.width, stage.height, stage.offsetX, stage.offsetY) // 创建形状
        shapeObj.set('fill', pattern)

        const refreshFunc = throttle(delay, () => {
            callback && callback()
        })
        // add event
        canvue.on(ev.stage.loaded.handler, refreshFunc, stage.uuid)
        canvue.on(ev.stage.added.handler, refreshFunc, stage.uuid)
        canvue.on(ev.stage.removed.handler, refreshFunc, stage.uuid)
        canvue.on(ev.stage.modified.handler, refreshFunc, stage.uuid)


        callback && callback()
        return shapeObj
    }

    return {bind}
}
