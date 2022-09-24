import {inject} from 'vue'
import {toDownload} from "@unjuanable/jokes";
import ev from "../../const/event";

export function useExportHandler(uuid = null) {
    const canvue = inject('canvue')

    /**
     * 导出SVG
     * @returns {(function(): void)|*}
     */
    function exportSVG() {
        return () => {
            normalizeVT(() => {
                const fileName = canvue.getStage(uuid).uuid + '.svg'
                const content = canvue.getStage(uuid).toSVG()
                toDownload(content, fileName, {type: 'image/svg+xml'})
            })
        }
    }

    /**
     * 导出PNG
     * @returns {(function(): void)|*}
     */
    function exportPNG() {
        return () => {
        }
    }

    /**
     * 导出JSON
     * @returns {(function(): void)|*}
     */
    function exportJSON() {
        return () => {
            normalizeVT(() => {
                const fileName = canvue.getStage(uuid).uuid + '.json'
                let content = canvue.getStage(uuid).toJSON()
                content.width = canvue.getStage(uuid).width
                content.height = canvue.getStage(uuid).height
                if (typeof content === 'object') {
                    content = JSON.stringify(content)
                }
                toDownload(content, fileName, {type: 'application/json'})
            })
        }
    }

    /**
     * 标准化画布尺寸
     * @param callback
     */
    function normalizeVT(callback) {
        // const VT = canvue.getStage(uuid).viewportTransform
        // const normalVT = VT.concat()
        // normalVT[0] = normalVT[3] = 1
        //
        // canvue.getStage(uuid).setWidth(canvue.getStage(uuid).width / VT[0])
        // canvue.getStage(uuid).setHeight(canvue.getStage(uuid).height / VT[3])
        // canvue.getStage(uuid).setViewportTransform(normalVT)
        // callback && callback()
        // canvue.getStage(uuid).setWidth(canvue.getStage(uuid).width * VT[0])
        // canvue.getStage(uuid).setHeight(canvue.getStage(uuid).height * VT[3])
        // canvue.getStage(uuid).setViewportTransform(VT)
        callback && callback()
    }

    /**
     * 注意回调方法的括号，需要保证方法内部this关键字作用域
     */
    function addExportsListener() {
        canvue.on(ev.stage.export.handler, exportSVG(), uuid)
        canvue.on(ev.stage.exportSVG.handler, exportSVG(), uuid)
        canvue.on(ev.stage.exportPNG.handler, exportPNG(), uuid)
        canvue.on(ev.stage.exportJSON.handler, exportJSON(), uuid)
    }


    return {
        addExportsListener
    }
}
