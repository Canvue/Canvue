import Layer from './Layer.vue'

Layer.install = function (app) {
    app.component(Layer.name, Layer);
};

/**
 * 图层资源
 */
export default Layer
