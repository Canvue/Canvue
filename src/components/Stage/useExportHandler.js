import {inject} from 'vue'
import {dataURLImageToFile, stringToFile, toDownload} from "@unjuanable/jokes";
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
                const fileName = canvue.getStage(uuid).uuid
                const content = canvue.getStage(uuid).toSVG()
                toDownload(stringToFile(content, fileName, 'image/svg+xml', "svg"))
            })
        }
    }

    /**
     * 导出PNG
     * @returns {(function(): void)|*}
     */
    function exportPNG() {
        return () => {
            normalizeVT(() => {
                const fileName = canvue.getStage(uuid).uuid
                const dataURL = canvue.getStage(uuid).toDataURL({
                    format: 'png',
                })
                toDownload(dataURLImageToFile(dataURL, fileName))
            })
        }
    }

    /**
     * 导出JSON
     * @returns {(function(): void)|*}
     */
    function exportJSON() {
        return () => {
            normalizeVT(() => {
                const fileName = canvue.getStage(uuid).uuid
                let content = canvue.getStage(uuid).toJSON()
                content.width = canvue.getStage(uuid).width
                content.height = canvue.getStage(uuid).height
                if (typeof content === 'object') {
                    content = JSON.stringify(content)
                }
                toDownload(stringToFile(content, fileName, "application/json"))
            })
        }
    }

    /**
     * 导出前标准化处理
     * @param callback
     */
    function normalizeVT(callback) {
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
