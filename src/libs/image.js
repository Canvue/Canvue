import {fabric} from "fabric";

/**
 * 通过URL加载图片
 * @param src
 * @param callback
 */
export function loadFromURL(src, callback) {
    fabric.Image.fromURL(src, img => {
        callback && callback(img)
    }, {
        crossOrigin: 'Anonymous'
    })
}

/**
 * 绘制圆形图片
 * @param img
 * @param opts
 * @returns {*}
 */
export function circle(img, opts) {
    const _options = {
        width: 100,
        height: 100,
        originX: 'center',
        originY: 'center',
    }
    const options = Object.assign({}, _options, opts)
    return new fabric.Image(img, {
        width: options.width,
        height: options.height,
        left: 0,
        top: 0,
        dirty: true,
        clipPath: new fabric.Ellipse({
            rx: options.width / 2,
            ry: options.height / 2,
            originX: options.originX,
            originY: options.originY,
        }),
    })
}
