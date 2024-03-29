import {markRaw, toRaw} from "vue";

export function useAligningGuides() {
    const data = markRaw({
        stage: null,
        ctx: null,
        zoom: 1
    })

    const aligningLineOffset = 3
    const aligningLineMargin = 2
    const aligningLineWidth = 1
    const aligningLineColor = 'rgba(255,21,188,0.8)'

    let viewportTransform = []
    const verticalLines = []
    const horizontalLines = []

    const drawVerticalLine = (coords) => {
        drawLine(
            coords.x + 0.5,
            coords.y1 > coords.y2 ? coords.y2 : coords.y1,
            coords.x + 0.5,
            coords.y2 > coords.y1 ? coords.y2 : coords.y1);
    }

    const drawHorizontalLine = (coords) => {
        drawLine(
            coords.x1 > coords.x2 ? coords.x2 : coords.x1,
            coords.y + 0.5,
            coords.x2 > coords.x1 ? coords.x2 : coords.x1,
            coords.y + 0.5);
    }

    const drawLine = (x1, y1, x2, y2) => {
        data.ctx.save();
        data.ctx.lineWidth = aligningLineWidth;
        data.ctx.strokeStyle = aligningLineColor;
        data.ctx.beginPath();
        data.ctx.moveTo(((x1 + viewportTransform[4]) * data.zoom), ((y1 + viewportTransform[5]) * data.zoom));
        data.ctx.lineTo(((x2 + viewportTransform[4]) * data.zoom), ((y2 + viewportTransform[5]) * data.zoom));
        data.ctx.stroke();
        data.ctx.restore();
    }

    const isInRange = (value1, value2) => {
        value1 = Math.round(value1);
        value2 = Math.round(value2);
        for (let i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
            if (i === value2) {
                return true;
            }
        }
        return false;
    }

    const initAligningGuides = (stage) => {
        data.stage = stage
        data.ctx = stage.getSelectionContext()

        data.stage.on('mouse:down', () => {
            viewportTransform = stage.viewportTransform;
            data.zoom = stage.getZoom();
        });

        data.stage.on('object:moving', (e) => {

            let activeObject = e.target,
                canvasObjects = stage.getObjects(),
                activeObjectCenter = activeObject.getCenterPoint(),
                activeObjectLeft = activeObjectCenter.x,
                activeObjectTop = activeObjectCenter.y,
                activeObjectBoundingRect = activeObject.getBoundingRect(),
                activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
                activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
                horizontalInTheRange = false,
                verticalInTheRange = false,
                transform = stage._currentTransform;

            if (!transform) return;

            // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
            // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

            for (let i = canvasObjects.length; i--;) {
                // 排除自身和自身比较的问题
                if (toRaw(canvasObjects[i]) === activeObject) continue;

                let objectCenter = canvasObjects[i].getCenterPoint(),
                    objectLeft = objectCenter.x,
                    objectTop = objectCenter.y,
                    objectBoundingRect = canvasObjects[i].getBoundingRect(),
                    objectHeight = objectBoundingRect.height / viewportTransform[3],
                    objectWidth = objectBoundingRect.width / viewportTransform[0];

                // snap by the horizontal center line
                if (isInRange(objectLeft, activeObjectLeft)) {
                    verticalInTheRange = true;
                    verticalLines.push({
                        x: objectLeft,
                        y1: (objectTop < activeObjectTop)
                            ? (objectTop - objectHeight / 2 - aligningLineOffset)
                            : (objectTop + objectHeight / 2 + aligningLineOffset),
                        y2: (activeObjectTop > objectTop)
                            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
                }

                // snap by the resource edge
                if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
                    verticalInTheRange = true;
                    verticalLines.push({
                        x: objectLeft - objectWidth / 2,
                        y1: (objectTop < activeObjectTop)
                            ? (objectTop - objectHeight / 2 - aligningLineOffset)
                            : (objectTop + objectHeight / 2 + aligningLineOffset),
                        y2: (activeObjectTop > objectTop)
                            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
                }

                // snap by the right edge
                if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                    verticalInTheRange = true;
                    verticalLines.push({
                        x: objectLeft + objectWidth / 2,
                        y1: (objectTop < activeObjectTop)
                            ? (objectTop - objectHeight / 2 - aligningLineOffset)
                            : (objectTop + objectHeight / 2 + aligningLineOffset),
                        y2: (activeObjectTop > objectTop)
                            ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                            : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
                }

                // snap by the vertical center line
                if (isInRange(objectTop, activeObjectTop)) {
                    horizontalInTheRange = true;
                    horizontalLines.push({
                        y: objectTop,
                        x1: (objectLeft < activeObjectLeft)
                            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                            : (objectLeft + objectWidth / 2 + aligningLineOffset),
                        x2: (activeObjectLeft > objectLeft)
                            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
                }

                // snap by the content_top edge
                if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
                    horizontalInTheRange = true;
                    horizontalLines.push({
                        y: objectTop - objectHeight / 2,
                        x1: (objectLeft < activeObjectLeft)
                            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                            : (objectLeft + objectWidth / 2 + aligningLineOffset),
                        x2: (activeObjectLeft > objectLeft)
                            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
                }

                // snap by the bottom edge
                if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                    horizontalInTheRange = true;
                    horizontalLines.push({
                        y: objectTop + objectHeight / 2,
                        x1: (objectLeft < activeObjectLeft)
                            ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                            : (objectLeft + objectWidth / 2 + aligningLineOffset),
                        x2: (activeObjectLeft > objectLeft)
                            ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                            : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                    });
                    activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
                }
            }

            if (!horizontalInTheRange) {
                horizontalLines.length = 0;
            }

            if (!verticalInTheRange) {
                verticalLines.length = 0;
            }
        });

        data.stage.on('before:render', () => {
            data.stage.contextTop && data.stage?.clearContext(data.stage.contextTop);
        });

        data.stage.on('after:render', () => {
            for (let i = verticalLines.length; i--;) {
                drawVerticalLine(verticalLines[i]);
            }
            for (let i = horizontalLines.length; i--;) {
                drawHorizontalLine(horizontalLines[i]);
            }

            verticalLines.length = horizontalLines.length = 0;
        });

        data.stage.on('mouse:up', () => {
            verticalLines.length = horizontalLines.length = 0;
            stage.renderAll();
        });
    }

    return {
        initAligningGuides
    }
}
