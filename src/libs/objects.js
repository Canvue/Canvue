import {fabric} from "fabric";

/**
 * 对象预处理
 * @param objects
 * @param layer
 * @param opt
 * @returns {*}
 */
export function preprocess(objects, layer = 'layer', opt = {}) {
    if (Array.isArray(objects))
        objects = new fabric.Group(objects, {erasable: 'deep'});
    objects.layer = layer // 指定图层类型
    objects.opt = opt // 附加额外参数
    objects.set('erasable', true)
    // 导出后确保额外附加的属性字段一并导出
    objects.toObject = (function (toObject) {
        return function () {
            return fabric.util.object.extend(toObject.call(this), {
                layer: layer, // 指定图层类型
                opt: opt, // 添加额外参数
            })
        }
    })(objects.toObject)

    return objects
}

/**
 * 创建智能对象
 * @param shape 智能对象的初始形状 [rect circle polygon ...]
 * @param object 默认添加的对象
 */
export function createSmartObject(shape, object = null) {
    const patternSourceCanvas = new fabric.StaticCanvas(null, {
        centeredRotation: true,
        centeredScaling: true,
        enableRetinaScaling: false,
    });
    patternSourceCanvas.setDimensions({
        width: object?.getScaledWidth() ?? 300,
        height: object?.getScaledHeight() ?? 300,
    });
    const pattern = new fabric.Pattern({
        source: patternSourceCanvas.getElement(),
        repeat: 'repeat',
        crossOrigin: 'anonymous',
    });
    shape.set('fill', pattern)
    object.originX = 'center'
    object.originY = 'center'
    object && patternSourceCanvas.add(object);
    object.viewportCenter()
    patternSourceCanvas.renderAll();
    return shape
}
