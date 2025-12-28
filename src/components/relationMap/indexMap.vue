<template>
	<div class="w-full h-full mapMin relative">
		<div
			ref="firstDiv"
			class="mapBox outer-octagon mb-[0.8125rem] w-full h-full relative overflow-hidden">
			<div ref="secondDiv" class="mapBoxDiv">
				<div ref="thirdDiv" class="mapBoxInner">
					<div
						class="relative"
						style="width: calc(100% - 1px); height: calc(100% - 1px)">
						<div
							id="view_content"
							class="w-full h-full bg-[#071C32]"
							ref="network"></div>
						<slot name="mapCon"></slot>
					</div>
				</div>
			</div>
			<img class="mapVectorTop2" src="@/assets/img/mapVectorTop2.png" alt="" />
			<img
				class="mapVectorLeft2"
				src="@/assets/img/mapVectorLeft2.png"
				alt="" />
			<img
				class="mapVectorRight2"
				src="@/assets/img/mapVectorRight2.png"
				alt="" />
		</div>
		<img class="mapVectorLeft" src="@/assets/img/mapVectorLeft.png" alt="" />
		<img class="mapVectorRight" src="@/assets/img/mapVectorRight.png" alt="" />
	</div>
</template>

<script setup>
	const firstDiv = ref(null);
	const secondDiv = ref(null);
	const thirdDiv = ref(null);
	// 同步宽度的函数
	const syncWidth = () => {
		const screenWidth =
			window.innerWidth || document.documentElement.clientWidth;
		if (firstDiv.value && thirdDiv.value) {
			const firstWidth = firstDiv.value.offsetWidth;
			const firstHeight = firstDiv.value.offsetHeight;
			const a = 1260 * (screenWidth / 1920);
			secondDiv.value.style.width = `${a}px`;
			secondDiv.value.style.height = `${a}px`;
			thirdDiv.value.style.width = `${firstWidth}px`;
			thirdDiv.value.style.height = `${firstHeight}px`;
		}
	};
	onMounted(() => {
		syncWidth();
		window.addEventListener('resize', syncWidth);
	});
	onBeforeUnmount(() => {
		window.removeEventListener('resize', syncWidth);
	});
</script>

<style lang="scss" scoped>
	.mapMin {
		padding: 0 3.375rem;
		box-sizing: border-box;
		.mapVectorLeft {
			position: absolute;
			top: 15.625%;
			left: 0.625rem;
			width: 2.625rem;
		}
		.mapVectorRight {
			position: absolute;
			top: 15.625%;
			right: 0.625rem;
			width: 2.625rem;
		}
	}
	.mapBox {
		// height: 45.625rem;
		.mapVectorTop2 {
			position: absolute;
			top: 0;
			left: 50%;
			z-index: 2;
			transform: translateX(-50%);
			width: 5.125rem;
		}

		.mapVectorLeft2 {
			position: absolute;
			top: 50%;
			left: 0;
			z-index: 2;
			transform: translateY(-50%);
			width: 0.6875rem;
		}

		.mapVectorRight2 {
			position: absolute;
			top: 50%;
			right: 0;
			z-index: 2;
			transform: translateY(-50%);
			width: 0.6875rem;
		}

		& .mapBoxDiv {
			box-sizing: border-box;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) rotate(45deg);
			overflow: hidden;
			border: 1px solid rgba(94, 188, 245, 0.38);
		}

		& .mapBoxInner {
			// height: 45.625rem;
			box-sizing: border-box;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%) rotate(-45deg);
			content: ' ';
			border: 1px solid rgba(94, 188, 245, 0.38);
			overflow: hidden;
		}
	}
</style>
