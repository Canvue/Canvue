import {markRaw} from "vue";
import {patternMaskShape} from './mask'

export function usePatternMode(viewport) {
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
        const pattern = new fabric.Pattern({
            source: stage.getElement(),
            repeat: 'no-repeat',
            crossOrigin: 'anonymous',
        });
        shape = patternMaskShape.hasOwnProperty(shape) ? shape : 'rect' // 检测形状类型
        const stdObj = patternMaskShape[shape](width, height, offsetX, offsetY) // 创建形状
        stdObj.set('fill', pattern)
        return stdObj
    }

    return {stages, init}
}