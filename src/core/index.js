import aggregation from 'aggregation/es6' // 模拟多重继承
import {fabric} from "fabric";
import {EventBus} from "@unjuanable/jokes/classes";

import Handler from './handler' // 操作处理类
import ev from '../const/event'
import {customControls} from "../const/control";

// 配置文件
const _defaultOptions = {
    aligningGuidelines: true,
    centeringGuidelines: true,
    controls: customControls,
}

class Canvue extends aggregation(EventBus, Handler) {

    constructor(options = {}) {
        super(options)
        this.options = Object.assign({}, _defaultOptions, options)
    }

    /**
     * Get 获取舞台中所有图层对象
     * @returns {*}
     */
    get layers() {
        return this.getActive()?.getObjects()
    }

    /**
     * 创建舞台
     * @param c Canvas Dom
     * @param uuid 唯一ID
     * @param config Fabric Canvas config
     * @returns {*}
     */
    createStage(c, uuid, config) {
        const defaultConfig = {
            centeredRotation: true,
            centeredScaling: true,
            enableRetinaScaling: false,
            controlsAboveOverlay: true,
        }
        let stage = new fabric.Canvas(c, Object.assign(defaultConfig, config))

        // 设置自定义数据
        stage.uuid = uuid // UUID

        // 导出自定义数据
        stage.toObject = ((toObject) => {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    uuid: stage.uuid,
                    scale: 1
                })
            }
        })(stage.toObject)

        this.options.controls && this.options.controls() // 设置自定义控制组件

        this.createPool(uuid, stage) // 加入舞台组

        // Fire Event
        this.emit(ev.created.handler, stage)

        return stage
    }

    /**
     * 获取舞台
     * @param uuid
     * @returns {*}
     */
    getStage(uuid = null) {
        return this.fetch(uuid)
    }

    /**
     * 销毁舞台
     * @param uuid
     */
    destroyStage(uuid) {
        this.removePool(uuid)
        this.emit(ev.destroy.handler)
    }

}

export default Canvue
