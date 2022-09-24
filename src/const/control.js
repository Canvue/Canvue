import {fabric} from "fabric";
import rotateIcon from "../assets/rotate.png";

/**
 * 自定义对象选择框
 */
export function customControls() {
    // 设置控制点是否显示
    fabric.Object.prototype.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        // bl: false,
        // br: false,
        // tl: false,
        // tr: false,
        // mtr: false,
    })
    // 修改控制点的形状，默认为`rect`矩形，可选的值还有`circle`圆形
    fabric.Object.prototype.cornerStyle = "circle";
    // 修改控制点的填充色
    fabric.Object.prototype.cornerColor = "white";
    // 修改控制点的大小
    fabric.Object.prototype.cornerSize = 14;
    // 设置控制点不透明，即可以盖住其下的控制线
    fabric.Object.prototype.transparentCorners = false;
    // 修改控制点的边框颜色
    fabric.Object.prototype.cornerStrokeColor = "gray";
    // // 取消控制点之间的连接线
    // fabric.Object.prototype.controls.mtr.withConnection = false;
    // // 调整控制点初始锚点位置
    // fabric.Object.prototype.controls.mtr.y = 0.5;
    // // 单独修改旋转控制点距离主体的纵向距离
    // fabric.Object.prototype.controls.mtr.offsetY = 30;
    // 自定义旋转按钮
    customControlMtr(rotateIcon)
    // fabric.Image.fromURL(rotateIcon, this.customControlMtr);
}

/**
 * 自定义旋转按钮
 * @param icon
 */
function customControlMtr(icon) {
    fabric.Image.fromURL(icon, (image, err) => {
        if (!err) {
            fabric.Object.prototype.controls.mtr = new fabric.Control({
                x: 0,
                y: 0.5,
                offsetY: 30,
                // cursorStyle: 'pointer',
                actionHandler: fabric.controlsUtils.rotationWithSnapping,
                cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
                // 渲染图标
                render: renderIcon(image._element, 0),
                // 设置控制点大小
                cornerSize: 18,
            });
        }
    })
}

/**
 * 绘制图标
 * @param image
 * @param initialAngle
 * @returns {(function(*, *, *, *, *): void)|*}
 */
function renderIcon(image, initialAngle) {
    return function (ctx, left, top, styleOverride, fabricObject) {
        let size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle + initialAngle));
        ctx.drawImage(image, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}