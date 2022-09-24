import {fabric} from "fabric";
import Canvue from "./core"
import {InstallComponents} from "./components";
import event from './const/event'

const defaultOptions = {
    componentsPrefix: 'V', // 组件前缀
}

export default {
    install(app, customOptions = {}) {
        // 获取配置文件
        const options = Object.assign({}, defaultOptions, customOptions)
        const canvue = new Canvue(options)
        // 全局注入
        // 可以通过this.$canvue获取到canvue类的实例
        app.config.globalProperties.$canvue = canvue
        // 组件注入
        // 使用方式 const useCanvue = inject('canvue')
        app.provide('canvue', canvue)
        // 全局注册组件
        InstallComponents(app, options.componentsPrefix)
    }
}

export {
    fabric,
    event,
}

export * from './libs'
export * from './libs/objects'
export * from './libs/loader'
