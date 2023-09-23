import {createView, createUUID} from "./index";
import {usePatternMode} from "../components/Projected/usePatternMode";
import {useImageMode} from "../components/Projected/useImageMode";

const defaultOpt = {
    uuid: createUUID(),
    width: 1024,
    height: 1024,
    bgColor: 'rgba(255,255,255,0)',
    delay: 0,
}

const defaultStageOpts = {
    uuid: null,
    el: null,
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    shape: 'rect'
}

export function useProjectedCanvas(mode, options = {}, fabricConf = {}) {
    const opt = Object.assign({}, defaultOpt, options)
    const c = document.createElement("canvas")
    const projected = createView(c, opt.uuid, fabricConf)
    projected.setWidth(opt.width)
    projected.setHeight(opt.height)
    projected.setBackgroundColor(opt.bgColor, () => {
    })

    const {bind} = mode === 'pattern'
        ? usePatternMode(opt.delay)
        : useImageMode(opt.delay)

    function bindStage(opts, callback = null) {
        const stage = Object.assign({}, defaultStageOpts, opts)
        let area = bind(stage, () => {
            projected.renderAll()
            callback && callback(stage.uuid)
        })
        projected.add(area)
    }

    return {projected, bindStage}
}
