import {inject} from "vue";
import ev from '../../const/event.js'

/**
 * 舞台生命周期事件
 * @param uuid
 * @returns {{loading: boolean, mounted: boolean}}
 */
export function useLifecycle(uuid) {
    const canvue = inject('canvue')
    const process = {
        mounted: false,
        loading: true
    }

    // 开始加载
    canvue.on(ev.stage.loading.handler, () => {
        process.loading = true
    }, uuid)
    // 加载完成
    canvue.on(ev.stage.loaded.handler, () => {
        process.loading = false
    }, uuid)

    return process
}