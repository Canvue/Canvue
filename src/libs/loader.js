import {fabric} from "fabric";

export function loadFromURL(src, callback) {
    fabric.Image.fromURL(src, img => {
        img.setAttribute('crossOrigin', 'anonymous');
        callback && callback(img)
    })
}
