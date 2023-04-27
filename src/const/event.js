// Event Handler
const ev = {
    created: {handler: 'created'}, // 创建舞台
    destroy: {handler: 'destroy'}, // 销毁舞台
    activate: {handler: 'activate'}, // 选中并激活舞台
    inactivate: {handler: 'inactivate'}, // 释放之前被选中的舞台，可以优化性能
    /**
     * 舞台事件
     * {uuid} 舞台的UUID
     */
    stage: {
        loading: {handler: 'stage:{uuid}:loading'}, // 舞台开始加载
        loaded: {handler: 'stage:{uuid}:loaded'}, // 舞台加载完成
        clear: {handler: 'stage:{uuid}:clear'}, // 清空舞台中所有内容
        resize: {handler: 'stage:{uuid}:resize'}, // 重新调整舞台大小
        zoom: {handler: 'stage:{uuid}:zoom'}, // 缩放舞台显示尺寸
        drawable: {handler: 'stage:{uuid}:drawable'}, // 激活绘制模式
        export: {handler: 'stage:{uuid}:export'}, // 导出专用格式
        exportSVG: {handler: 'stage:{uuid}:exportSVG'}, // 导出SVG格式
        exportPNG: {handler: 'stage:{uuid}:exportPNG'}, // 导出PNG格式
        exportJSON: {handler: 'stage:{uuid}:exportJSON'}, // 导出JSON格式
        added: {handler: 'stage:{uuid}:added'}, // 添加图层
        removed: {handler: 'stage:{uuid}:removed'}, // 删除图层
        selected: {handler: 'stage:{uuid}:selected'}, // 选中图层
        free: {handler: 'stage:{uuid}:free'}, // 释放选中
        refresh: {handler: 'stage:{uuid}:sort'}, //更新图层列表排列
        modified: {handler: 'stage:{uuid}:modified'}, // 监听舞台中图层对象状态变化
        rendering: {handler: 'stage:{uuid}:rendering'}, // 监听舞台开始进行渲染
        rendered: {handler: 'stage:{uuid}:rendered'}, // 监听舞台渲染完当前帧
        projected: {handler: 'stage:{uuid}:projected'}
    },
    /**
     * 图层事件
     * {uuid} 图层的UUID
     */
    layer: {}
}

export default ev
