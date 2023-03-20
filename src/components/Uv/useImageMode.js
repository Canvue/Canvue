import {inject, markRaw} from "vue";
import {clipPathShape} from "./mask";
import ev from "../../const/event";

export function useImageMode() {
    const canvue = inject('canvue')
    const stages = markRaw({})

    /**
     * 初始化绑定舞台数据
     * @param {object} stage - 舞台
     * @param {string} uuid - 舞台唯一ID
     * @param {number} width - 舞台宽度
     * @param {number} height - 舞台高度
     * @param {number} offsetX - 舞台内容相对UV的left偏移量
     * @param {number} offsetY - 舞台内容相对UV的top偏移量
     * @param {string}[shape=rect] shape - 最终结果pattern表现的形状
     */
    const init = (stage, uuid, width, height, offsetX, offsetY, shape = 'rect') => {
        stages[uuid] = {uuid, stage, width, height, offsetX, offsetY}
        shape = clipPathShape.hasOwnProperty(shape) ? shape : 'rect' // 检测形状类型
        const stdObj = clipPathShape[shape](width, height, offsetX, offsetY) // 创建形状
        const img = new Image()
        const image = new fabric.Image(img, {
            width,
            height,
            left: offsetX,
            top: offsetY,
            clipPath: stdObj
        })
        const refresh = () => {
            img.src = stage.toDataURL()
            image.set('dirty', true);
            canvue.emit(ev.stage.rendered.handler)
        }
        stage.on('object:modified', refresh)
        canvue.on(ev.stage.added.handler, refresh, uuid)
        return image
    }

    return {stages, init}

}
