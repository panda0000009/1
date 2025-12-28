// 设计稿尺寸（1920×1080）
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

function setRemUnit() {
	// 实际屏幕尺寸
	const screenWidth = document.documentElement.clientWidth || window.innerWidth;
	const screenHeight =
		document.documentElement.clientHeight || window.innerHeight;

	// 计算宽度和高度的缩放比例
	const scaleX = screenWidth / DESIGN_WIDTH; // 宽度比例
	const scaleY = screenHeight / DESIGN_HEIGHT; // 高度比例

	// 取较小的比例作为最终缩放比例（避免内容超出屏幕）
	const scale = Math.min(scaleX, scaleY);

	// 限制最大缩放比例（例如在超宽屏上不超过1.5倍）
	const maxScale = 1.5;
	const actualScale = Math.min(scale, maxScale);

	// 计算根元素font-size（1rem = 设计稿100px，与设计稿等比例缩放）
	const fontSize = actualScale * 16;

	// 应用到根元素
	document.documentElement.style.fontSize = `${fontSize.toFixed(2)}px`;

	// 可选：设置页面最小高度为屏幕高度，避免内容过短时高度不足
	document.documentElement.style.minHeight = `${screenHeight}px`;
}

// 初始化
setRemUnit();

// 监听窗口尺寸变化（包括旋转、缩放）
window.addEventListener('resize', setRemUnit);
window.addEventListener('load', setRemUnit);
