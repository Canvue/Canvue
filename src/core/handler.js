import {preprocess} from "../libs/objects";
import ev from "../const/event";

class Handler {
    getStage
    emit

    /**
     * 清空舞台
     * @param {string,null} uuid - 舞台UUID
     */
    toClear(uuid = null) {
        this.getStage(uuid)?.clear()
        this.emit(ev.stage.clear.handler, null, uuid)
    }

    /**
     * 渲染并刷新画布数据
     * @param {string,null} uuid - 舞台UUID
     */
    toRefresh(uuid = null) {
        this.getStage(uuid)?.renderAll()
        this.emit(ev.stage.clear.handler, null, uuid)
    }

    /**
     * 添加对象
     * @param {object} object - 图层对象
     * @param {string,null}  layer - 图层类型,如果为空则不处理
     * @param {object} opt - 额外参数选项
     * @param {string,null}  uuid - 舞台UUID
     */
    toAdd(object, layer = null, opt = {}, uuid = null) {
        if (!this.getStage(uuid)) return
        layer && this.toPreprocess(object, layer, opt, uuid)
        this.getStage(uuid).add(object)
        this.emit(ev.stage.refresh.handler, null, uuid)
    }

    /**
     * 移除对象
     * @param {object} object - 图层对象
     * @param {string,null} uuid - 舞台UUID
     */
    toRemove(object, uuid = null) {
        object.canvas.remove(object)
        this.emit(ev.stage.refresh.handler, null, uuid)
    }

    /**
     * 替换对象
     * @param {object} object - 新图层对象
     * @param {number} index - 原图层位置
     * @param {string,null} layer - 新图层类型
     * @param {object} opt - 新图层选项
     * @param {string,null} uuid - 舞台UUID
     */
    toReplace(object, index, layer = null, opt = {}, uuid = null) {
        const origin = this.getStage().getObjects()[index]
        layer && this.toPreprocess(object, layer, opt)
        this.getStage(uuid).insertAt(object, index)
        this.getStage(uuid).remove(origin)
        this.emit(ev.stage.refresh.handler, null, uuid)
    }

    /**
     * 复制图层
     * @param {object} object - 图层对象
     * @param {number} offset - 偏移距离，xy同时
     * @param {string,null} uuid - 舞台UUID
     */
    toCopy(object, offset = 50, uuid = null) {
        const stage = object.canvas
        object.clone((clone) => {
            clone.set({
                left: clone.left + offset,
                top: clone.top + offset,
                evented: true,
            });
            // 判断为多图层框选的情况
            if (clone.type === 'activeSelection') {
                clone.canvas = stage;
                clone.forEachObject((obj) => {
                    obj = this.toPreprocess(obj, object.layer, object.opt)
                    stage.add(obj);
                });
                clone.setCoords();
            } else {
                clone = this.toPreprocess(clone, object.layer, object.opt)
                stage.add(clone);
            }
            this.emit(ev.stage.refresh.handler, null, uuid)
        });
    }

    /**
     * 图层标准化预处理
     * @param {object} object - 预处理对象
     * @param {string,null} layer - 图层类型
     * @param {object} opt - 附加参数
     * @param {string,null} uuid - 舞台UUID
     * @returns {*}
     */
    toPreprocess(object, layer, opt = {}, uuid = null) {
        object = preprocess(object, layer, opt)
        object.on('selected', () => {
            this.emit(ev.stage.selected.handler, object, uuid)
        })
        object.on('deselected', () => {
            this.emit(ev.stage.free.handler, object, uuid)
        })
        return object
    }

    /**
     * 自由绘制模式
     * @param {object} brush - fabric 笔刷对象
     * @param {string,null} uuid - 舞台UUID
     */
    toDraw(brush, uuid = null) {
        if (brush) {
            this.getStage(uuid).isDrawingMode = true
            this.getStage(uuid).freeDrawingBrush = brush
            this.emit(ev.stage.drawable.handler, true, uuid)
        } else {
            this.getStage(uuid).isDrawingMode = false
            this.getStage(uuid).freeDrawingBrush = null
            this.emit(ev.stage.drawable.handler, false, uuid)
        }
    }

}

export default Handler
