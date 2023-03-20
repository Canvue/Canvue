import {markRaw} from 'vue'

export function useCenteringGuides() {
    const data = markRaw({
        stage: null,
        ctx: null,
    })

    const centerLineMargin = 2
    const centerLineColor = 'rgba(255,21,188,0.8)'
    const centerLineWidth = 1

    let canvasWidth = 0
    let canvasHeight = 0
    let canvasWidthCenter = 0
    let canvasHeightCenter = 0
    let canvasWidthCenterMap = {}
    let canvasHeightCenterMap = {}

    let viewportTransform
    let isInVerticalCenter
    let isInHorizontalCenter

    const showVerticalCenterLine = () => {
        showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
    }

    const showHorizontalCenterLine = () => {
        showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
    }

    const showCenterLine = (x1, y1, x2, y2) => {
        data.ctx.save();
        data.ctx.strokeStyle = centerLineColor;
        data.ctx.lineWidth = centerLineWidth;
        data.ctx.beginPath();
        data.ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
        data.ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
        data.ctx.stroke();
        data.ctx.restore();
    }

    const initCenteringGuides = (stage) => {
        data.stage = stage
        data.ctx = stage.getSelectionContext()

        data.stage.on('mouse:down', () => {
            viewportTransform = data.stage.viewportTransform;

            // 计算真实尺寸
            canvasWidth = data.stage.getWidth() / viewportTransform[0]
            canvasHeight = data.stage.getHeight() / viewportTransform[3]

            canvasWidthCenter = canvasWidth / 2
            canvasHeightCenter = canvasHeight / 2

            canvasWidthCenterMap = {}
            canvasHeightCenterMap = {}

            for (let i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin; i <= len; i++) {
                canvasWidthCenterMap[Math.round(i)] = true;
            }
            for (let i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin; i <= len; i++) {
                canvasHeightCenterMap[Math.round(i)] = true;
            }

        });

        data.stage.on('object:moving', (e) => {
            let object = e.target,
                objectCenter = object.getCenterPoint(),
                transform = data.stage._currentTransform;

            if (!transform) return;

            isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap;
            isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap;
            if (isInHorizontalCenter || isInVerticalCenter) {
                object.setPositionByOrigin(new fabric.Point((isInVerticalCenter ? canvasWidthCenter : objectCenter.x), (isInHorizontalCenter ? canvasHeightCenter : objectCenter.y)), 'center', 'center');
            }
        });

        data.stage.on('before:render', () => {
            data.stage.contextTop && data.stage?.clearContext(data.stage?.contextTop);
        });

        data.stage.on('after:render', () => {
            if (isInVerticalCenter) {
                showVerticalCenterLine();
            }
            if (isInHorizontalCenter) {
                showHorizontalCenterLine();
            }
        });

        data.stage.on('mouse:up', () => {
            isInVerticalCenter = isInHorizontalCenter = null;
            data.stage.renderAll();
        });
    }

    return {
        initCenteringGuides
    }
}


