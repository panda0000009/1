<!-- 公共布局组件 -->
<template>
	<div class="layout w-full h-full relative">
		<div class="layoutLeft absolute top-0 left-0 z-10">
			<slot name="left"></slot>
		</div>
		<div class="layoutMap w-full h-full">
			<slot name="map"></slot>
		</div>
		<div class="layoutRight absolute top-0 right-0 z-10">
			<slot name="right"></slot>
		</div>
		<img
			src="@/assets/img/bottomStreamer.png"
			alt=""
			class="bottomStreamer absolute bottom-0 left-0 w-full h-[34.0625rem] z-1" />
	</div>
</template>
<style scoped lang="scss">
	.layoutLeft,
	.layoutRight {
		width: 25.6875rem;
		height: 100%;
		padding-top: 1.375rem;
	}
	.layoutRight {
		// background-image: url('@/assets/img/rightMask.png');
		// background-size: 100% 100%;
		// background-repeat: no-repeat;
		// background-position: center center;
		background: linear-gradient(
			to right,
			rgba(31, 41, 51, 0) 0%,
			rgba(14, 29, 54, 0.8) 40%,
			rgba(0, 0, 0, 1) 100%
		);
	}
	.layoutLeft {
		// background-image: url('@/assets/img/leftMask.png');
		// background-size: 100% 100%;
		// background-repeat: no-repeat;
		// background-position: center center;

		background: linear-gradient(
			to right,
			rgba(0, 0, 0, 1) 0%,
			rgba(14, 29, 54, 0.8) 60%,
			rgba(31, 41, 51, 0) 100%
		);
	}
	.bottomStreamer {
		pointer-events: none;
	}
</style>
