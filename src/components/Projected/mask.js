export const clipPathShape = {
    rect: (width, height, x, y) => {
        return new fabric.Rect({
            width: width,
            height: height,
            originX: 'center',
            originY: 'center',
            objectCaching: false,
        })
    },
    ellipse: (width, height, x, y) => {
        return new fabric.Ellipse({
            rx: width / 2,
            ry: height / 2,
            originX: 'center',
            originY: 'center',
            objectCaching: false,
        })
    }
}

export const patternMaskShape = {
    rect: (width, height, x, y) => {
        return new fabric.Rect({
            width: width,
            height: height,
            left: x,
            top: y,
            objectCaching: false,
        })
    },
    ellipse: (width, height, x, y) => {
        return new fabric.Ellipse({
            rx: width / 2,
            ry: height / 2,
            left: x,
            top: y,
            objectCaching: false,
        })
    }
}