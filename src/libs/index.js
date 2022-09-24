import {fabric} from "fabric";
import {nanoid} from "nanoid";

/**
 * 创建UUID
 * @returns {string}
 */
export function createUUID() {
    return nanoid(8)
}

/**
 * 创建画布预览缩略图
 * @param c
 * @param uuid
 * @param config
 */
export function createView(c, uuid, config) {
    const defaultConfig = {
        centeredRotation: true,
        centeredScaling: true,
        enableRetinaScaling: false,
    }
    const preview = new fabric.StaticCanvas(c, Object.assign({}, defaultConfig, config))
    preview.uuid = uuid

    return preview
}

