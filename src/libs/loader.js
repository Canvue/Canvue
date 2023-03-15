import {fabric} from "fabric";

export function loadFromURL(src, callback) {
    fabric.Image.fromURL(src, img => {
        callback && callback(img)
    }, {
        crossOrigin: 'Anonymous'
    })
}
