<!-- 项目对比剧场 -->
<template>
	<div class="pages">
		<Layout>
			<template #left>
				<div class="w-full h-full left">
					<SecondTile label="动态调控台" leftPadding="3.8125rem"></SecondTile>
					<div class="pl-[1.6875rem] pr-[0.4375rem]">
						<Arrowhead
							class="my-3"
							name="场景体系"
							direction="bottom"
							@directionChange="handleTitleToggle('project1')" />
						<div v-show="titleStates.project1" class="scenario-section">
							<div class="scenario-tabs">
								<div
									v-for="(scenario, index) in scenarioList"
									:key="index"
									class="scenario-tab"
									:class="{ active: activeScenario === scenario.value }"
									@click="handleScenarioChange(scenario.value)">
									<img
										v-if="activeScenario === scenario.value"
										:src="getAssetsFile('target-4-cur')"
										alt=""
										class="scenario-tab-bg" />
									<img
										v-else
										:src="getAssetsFile('target-4')"
										alt=""
										class="scenario-tab-bg" />
									<span class="scenario-tab-text">{{ scenario.label }}</span>
								</div>
							</div>
							<div class="px-[20px]">
								<CustomSelect
									popper-class="my-popper"
									v-model="projectName"
									:options="projectNameList"
									:footer="true"
									:isBg="false"
									@select="handleProjectChange">
									<template #footer>
										<div
											class="more-box cursor-pointer"
											style="text-align: right"
											@click="handleMore">
											查看更多 >>
										</div>
									</template>
								</CustomSelect>
							</div>
						</div>
						<!-- 情景选择 -->
						<Arrowhead
							class="my-3"
							name="情景选择"
							direction="bottom"
							@directionChange="handleTitleToggle('scene')"></Arrowhead>
						<div
							v-show="titleStates.scene"
							class="bg-[rgba(17,46,70,0.8)] py-[16px] px-[20px] mb-3 rounded-[4px]">
							<div class="w-full mb-[11px]">
								<el-select
									v-model="subPCompletedInfo"
									multiple
									collapse-tags
									collapse-tags-tooltip
									placeholder="请选择"
									popper-class="my-popper"
									@change="subPCompletedProjectChange">
									<el-option
										v-for="item in subPCompletedProjectInfos"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
									<template #footer>
										<div
											class="more-box cursor-pointer"
											style="text-align: right"
											@click="handleMore">
											查看更多 >>
										</div>
									</template>
								</el-select>
							</div>
							<div class="target-item">
								<div class="flex items-center">
									<img
										:src="diamond"
										alt=""
										class="w-[14px] h-[14px] mr-[8px]" />
									<span :class="['indicator-label']">情景描述：</span>
								</div>
							</div>
							<div class="scene-info">
								<div class="flex">
									<span class="mr-1">1.</span>
									<div class="scene-info-item">
										<span class="label"
											>{{
												subPCompletedProjectInfos.find(
													n => n.id == subPCompletedInfo
												)?.name || ''
											}}：</span
										>
										{{
											subPCompletedProjectInfos.find(
												n => n.id == subPCompletedInfo
											)?.remark ||
											'在年度建设用地供应计划中，将供应规模重点配置为居住用地。'
										}}
									</div>
								</div>
								<!-- <div class="flex">
									<span class="mr-1">2.</span>
									<div class="scene-info-item">
										<span class="label">商服用地主导供给情景：</span>
										在年度建设用地供应计划中，将供应规模核心投向商服用地。
									</div>
								</div>
								<div class="flex">
									<span class="mr-1">3.</span>
									<div class="scene-info-item">
										<span class="label">工业用地主导供给情景：</span>
										在年度建设用地供应计划中，将供应规模主要配置为工业用地。
									</div>
								</div>
								<div class="flex">
									<span class="mr-1">4.</span>
									<div class="scene-info-item">
										<span class="label">建设用地均衡供给情景：</span>
										将供应规模按比例均衡分配至居住、商服、工业等各类用地。
									</div>
								</div> -->
							</div>
						</div>
						<!-- 选择目标 -->
						<Arrowhead
							class="my-3"
							name="选择目标"
							direction="bottom"
							@directionChange="handleTitleToggle('target')"></Arrowhead>
						<div v-show="titleStates.target" class="target-section">
							<div
								v-for="(target, index) in targetList"
								:key="index"
								class="target-item relative cursor-pointer"
								@click="handleTargetChange(target.value)">
								<div class="flex items-center">
									<img
										:src="diamond"
										alt=""
										class="w-[14px] h-[14px] mr-[8px]" />
									<span
										:class="[
											'indicator-label',
											{ active: activeTarget === target.value }
										]"
										>{{ target.label }}</span
									>
								</div>
							</div>
						</div>

						<!-- 选择指标 -->
						<Arrowhead
							class="my-3"
							name="选择指标"
							direction="bottom"
							@directionChange="handleTitleToggle('indicator')"></Arrowhead>
						<div v-show="titleStates.indicator" class="indicator-section">
							<div class="indicator-item">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">指标类型</span>
								</div>
								<CustomSelect
									v-model="activeLx"
									:options="lxList"
									placeholder="人口密度调控"
									:isBg="false"
									@select="indicatorTypeChangeHandle">
								</CustomSelect>
							</div>
							<!-- 具体指标 -->
							<div class="indicator-item mt-3">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">具体指标</span>
								</div>
								<CustomSelect
									v-model="activeZb"
									:options="zbList"
									placeholder="中心城区人口密度"
									:isBg="false"
									returnItem
									@select="zbChange">
								</CustomSelect>
							</div>
						</div>

						<!-- 选择单元、年份 -->
						<Arrowhead
							class="my-3"
							name="选择单元、年份"
							direction="bottom"
							@directionChange="handleTitleToggle('unitYear')"></Arrowhead>
						<div v-show="titleStates.unitYear" class="unit-year-section">
							<div class="indicator-item">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">选择单元</span>
								</div>
								<CustomSelect
									v-model="dyCurrent"
									:options="dyList"
									placeholder="街道"
									:isBg="false"
									@select="regionSelectedHandle">
								</CustomSelect>
							</div>
							<!-- 选择年份 -->
							<div class="indicator-item mt-3">
								<div class="indicator-label-wrapper">
									<img :src="diamond" alt="" class="indicator-diamond-icon" />
									<span class="indicator-label">选择年份</span>
								</div>
								<CustomSelect
									v-model="yearCurrent"
									:options="yearList"
									placeholder="2024年"
									:isBg="false"
									@select="getRes">
								</CustomSelect>
							</div>
						</div>

						<!-- 其他数据范围 -->
						<Arrowhead
							class="my-3"
							name="其他数据范围"
							direction="left"
							@directionChange="handleTitleToggle('vector')"></Arrowhead>
						<div v-show="titleStates.vector" class="vector-statistics-section">
							<div class="vector-table-container">
								<table :border="1" class="vector-table">
									<thead class="bg-[rgba(1,128,254,0.3686)] text-[#04ABFF]">
										<tr>
											<th style="text-align: center">项目空间数据名称</th>
											<th style="text-align: center" width="64px">显示</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(item, index) in vectorDataList" :key="index">
											<td>{{ item.name }}</td>
											<td style="width: 64px">
												<el-switch
													v-model="item.visible"
													@change="handleVectorToggle(item, index)" />
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<!-- 智能问答 -->
						<Arrowhead
							class="my-3"
							name="智能问答"
							direction="bottom"
							@directionChange="handleTitleToggle('summary')"></Arrowhead>
						<SummaryCom v-if="titleStates.summary"></SummaryCom>
					</div>
				</div>
			</template>
			<template #map>
				<div
					v-if="showMap"
					class="w-[calc(100%-51.375rem)] h-[91.666666%] ml-[25.6875rem] pt-[1.5rem]">
					<RelationMap>
						<template #mapCon>
							<div class="absolute top-0 left-0 w-full h-full">
								<MaxMap :showMap="false" :mapTools="false" :showVector="false">
									<template #mapCon>
										<div class="w-full h-full flex flex-wrap">
											<template v-if="splitScreenCnt === 1">
												<MapViewer
													ref="firstMapViewer"
													:mapName="'OneScrn-firstMapViewer'"></MapViewer>
												<el-select
													v-model="projectName1"
													placeholder="请选择"
													popper-class="my-popper"
													style="width: 182px; height: 42px"
													class="map-select"
													@change="
														subProjectChangehandle(
															'firstMapViewer',
															'OneScrn-firstMapViewer'
														)
													">
													<el-option
														v-for="item in subPCompletedProjectInfos"
														:key="item.id"
														:label="item.name"
														:value="item.id" />
												</el-select>
												<div
													class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
													@click.stop>
													<p class="legendTitle">图例</p>
													<ul>
														<li
															class="mb-[6px] h-[13px] flex items-center"
															v-for="item in firstlegendList"
															:key="item.name">
															<span
																class="flex w-[23px] h-[12px] mr-[5px]"
																:style="{ backgroundColor: item.color }"></span>
															<span class="text-[#fff] font-size-[12px]">{{
																item.name
															}}</span>
														</li>
													</ul>
												</div>
											</template>
											<template v-else-if="splitScreenCnt === 2">
												<Splitpanes :dbl-click-splitter="false">
													<Pane :size="50" :min-size="50" :max-size="50">
														<MapViewer
															ref="firstMapViewer"
															:mapName="'TwoScrn-firstMapViewer'"></MapViewer>
														<el-select
															v-model="projectName1"
															placeholder="请选择"
															popper-class="my-popper"
															style="width: 182px; height: 42px"
															class="map-select"
															@change="
																subProjectChangehandle(
																	'firstMapViewer',
																	'TwoScrn-firstMapViewer'
																)
															">
															<el-option
																v-for="item in subPCompletedProjectInfos"
																:key="item.id"
																:label="item.name"
																:value="item.id" />
														</el-select>
														<div
															class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
															@click.stop>
															<p class="legendTitle">图例</p>
															<ul>
																<li
																	class="mb-[6px] h-[13px] flex items-center"
																	v-for="item in firstlegendList"
																	:key="item.name">
																	<span
																		class="flex w-[23px] h-[12px] mr-[5px]"
																		:style="{
																			backgroundColor: item.color
																		}"></span>
																	<span class="text-[#fff] font-size-[12px]">{{
																		item.name
																	}}</span>
																</li>
															</ul>
														</div>
													</Pane>
													<Pane :size="50" :min-size="50" :max-size="50">
														<MapViewer
															ref="secondMapViewer"
															:mapName="'TwoScrn-secondMapViewer'"></MapViewer>
														<el-select
															v-model="projectName2"
															placeholder="请选择"
															popper-class="my-popper"
															style="width: 182px; height: 42px"
															class="map-select"
															@change="
																subProjectChangehandle(
																	'secondMapViewer',
																	'TwoScrn-secondMapViewer'
																)
															">
															<el-option
																v-for="item in subPCompletedProjectInfos"
																:key="item.id"
																:label="item.name"
																:value="item.id" />
														</el-select>
														<div
															class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
															@click.stop>
															<p class="legendTitle">图例</p>
															<ul>
																<li
																	class="mb-[6px] h-[13px] flex items-center"
																	v-for="item in secondlegendList"
																	:key="item.name">
																	<span
																		class="flex w-[23px] h-[12px] mr-[5px]"
																		:style="{
																			backgroundColor: item.color
																		}"></span>
																	<span class="text-[#fff] font-size-[12px]">{{
																		item.name
																	}}</span>
																</li>
															</ul>
														</div>
													</Pane>
												</Splitpanes>
											</template>
											<template v-else-if="splitScreenCnt === 4">
												<Splitpanes horizontal :dbl-click-splitter="false">
													<Pane :size="50" :min-size="50" :max-size="50">
														<Splitpanes :dbl-click-splitter="false">
															<Pane :size="50" :min-size="50" :max-size="50">
																<MapViewer
																	ref="firstMapViewer"
																	:mapName="'FourScrn-firstMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName1"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'firstMapViewer',
																			'FourScrn-firstMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<!-- <div
																	v-if="projectName1"
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in firstlegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div> -->
															</Pane>
															<Pane :size="50" :min-size="50" :max-size="50">
																<MapViewer
																	ref="secondMapViewer"
																	:mapName="'FourScrn-secondMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName2"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'secondMapViewer',
																			'FourScrn-secondMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<!-- <div
																	v-if="projectName2"
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in secondlegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div> -->
															</Pane>
														</Splitpanes>
													</Pane>
													<Pane :size="50" :min-size="50" :max-size="50">
														<Splitpanes :dbl-click-splitter="false">
															<Pane :size="50" :min-size="50" :max-size="50">
																<MapViewer
																	ref="thirdMapViewer"
																	:mapName="'FourScrn-thirdMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName3"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'thirdMapViewer',
																			'FourScrn-thirdMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<!-- <div
																	v-if="projectName3"
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in thirdlegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div> -->
															</Pane>
															<Pane :size="50" :min-size="50" :max-size="50">
																<MapViewer
																	ref="fourthMapViewer"
																	:mapName="'FourScrn-fourthMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName4"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'fourthMapViewer',
																			'FourScrn-fourthMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<div
																	v-if="projectName4"
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in fourthlegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div>
															</Pane>
														</Splitpanes>
													</Pane>
												</Splitpanes>
											</template>
											<template v-else-if="splitScreenCnt === 6">
												<Splitpanes horizontal :dbl-click-splitter="false">
													<Pane :size="50" :min-size="50" :max-size="50">
														<Splitpanes :dbl-click-splitter="false">
															<Pane
																:size="66.67"
																:min-size="66.67"
																:max-size="66.67">
																<MapViewer
																	ref="firstMapViewer"
																	:mapName="'SixScrn-firstMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName1"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'firstMapViewer',
																			'SixScrn-firstMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<div
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in firstlegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div>
															</Pane>
															<Pane
																:size="33.33"
																:min-size="33.33"
																:max-size="33.33">
																<Splitpanes
																	horizontal
																	:dbl-click-splitter="false">
																	<Pane
																		:size="50"
																		:min-size="50"
																		:max-size="50">
																		<MapViewer
																			ref="secondMapViewer"
																			:mapName="'SixScrn-secondMapViewer'"></MapViewer>
																		<el-select
																			v-model="projectName2"
																			placeholder="请选择"
																			popper-class="my-popper"
																			style="width: 182px; height: 42px"
																			class="map-select"
																			@change="
																				subProjectChangehandle(
																					'secondMapViewer',
																					'SixScrn-secondMapViewer'
																				)
																			">
																			<el-option
																				v-for="item in subPCompletedProjectInfos"
																				:key="item.id"
																				:label="item.name"
																				:value="item.id" />
																		</el-select>
																		<div
																			class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																			@click.stop>
																			<p class="legendTitle">图例</p>
																			<ul>
																				<li
																					class="mb-[6px] h-[13px] flex items-center"
																					v-for="item in secondlegendList"
																					:key="item.name">
																					<span
																						class="flex w-[23px] h-[12px] mr-[5px]"
																						:style="{
																							backgroundColor: item.color
																						}"></span>
																					<span
																						class="text-[#fff] font-size-[12px]"
																						>{{ item.name }}</span
																					>
																				</li>
																			</ul>
																		</div>
																	</Pane>
																	<Pane
																		:size="50"
																		:min-size="50"
																		:max-size="50">
																		<MapViewer
																			ref="thirdMapViewer"
																			:mapName="'SixScrn-thirdMapViewer'"></MapViewer>
																		<el-select
																			v-model="projectName3"
																			placeholder="请选择"
																			popper-class="my-popper"
																			style="width: 182px; height: 42px"
																			class="map-select"
																			@change="
																				subProjectChangehandle(
																					'thirdMapViewer',
																					'SixScrn-thirdMapViewer'
																				)
																			">
																			<el-option
																				v-for="item in subPCompletedProjectInfos"
																				:key="item.id"
																				:label="item.name"
																				:value="item.id" />
																		</el-select>
																		<div
																			class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																			@click.stop>
																			<p class="legendTitle">图例</p>
																			<ul>
																				<li
																					class="mb-[6px] h-[13px] flex items-center"
																					v-for="item in thirdlegendList"
																					:key="item.name">
																					<span
																						class="flex w-[23px] h-[12px] mr-[5px]"
																						:style="{
																							backgroundColor: item.color
																						}"></span>
																					<span
																						class="text-[#fff] font-size-[12px]"
																						>{{ item.name }}</span
																					>
																				</li>
																			</ul>
																		</div>
																	</Pane>
																</Splitpanes>
															</Pane>
														</Splitpanes>
													</Pane>
													<Pane :size="50" :min-size="50" :max-size="50">
														<Splitpanes :dbl-click-splitter="false">
															<Pane
																:size="33.33"
																:min-size="33.33"
																:max-size="33.33">
																<MapViewer
																	ref="fourthMapViewer"
																	:mapName="'SixScrn-fourthMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName4"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'fourthMapViewer',
																			'SixScrn-fourthMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<div
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in fourthlegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div>
															</Pane>
															<Pane
																:size="33.33"
																:min-size="33.33"
																:max-size="33.33">
																<MapViewer
																	ref="fiveMapViewer"
																	:mapName="'SixScrn-fiveMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName5"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'fiveMapViewer',
																			'SixScrn-fiveMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<div
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in fivelegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div>
															</Pane>
															<Pane
																:size="33.34"
																:min-size="33.34"
																:max-size="33.34">
																<MapViewer
																	ref="sixMapViewer"
																	:mapName="'SixScrn-sixMapViewer'"></MapViewer>
																<el-select
																	v-model="projectName6"
																	placeholder="请选择"
																	popper-class="my-popper"
																	style="width: 182px; height: 42px"
																	class="map-select"
																	@change="
																		subProjectChangehandle(
																			'sixMapViewer',
																			'SixScrn-sixMapViewer'
																		)
																	">
																	<el-option
																		v-for="item in subPCompletedProjectInfos"
																		:key="item.id"
																		:label="item.name"
																		:value="item.id" />
																</el-select>
																<div
																	class="legendWrapper absolute w-[170px] overflow-hidden overflow-y-auto bg-[rgba(4,110,163,0.8)] select-none"
																	@click.stop>
																	<p class="legendTitle">图例</p>
																	<ul>
																		<li
																			class="mb-[6px] h-[13px] flex items-center"
																			v-for="item in sixlegendList"
																			:key="item.name">
																			<span
																				class="flex w-[23px] h-[12px] mr-[5px]"
																				:style="{
																					backgroundColor: item.color
																				}"></span>
																			<span
																				class="text-[#fff] font-size-[12px]"
																				>{{ item.name }}</span
																			>
																		</li>
																	</ul>
																</div>
															</Pane>
														</Splitpanes>
													</Pane>
												</Splitpanes>
											</template>
										</div>
									</template>
								</MaxMap>
							</div>
						</template>
					</RelationMap>
				</div>
			</template>
			<template #right>
				<div class="w-full h-full right">
					<SecondTile
						label="数据仪表盘"
						direction="right"
						rightPadding="5rem"></SecondTile>
					<div class="pl-[0.375rem] pr-8">
						<Arrowhead
							class="my-3"
							name="全市总体情况"
							direction="left"
							:isChange="false"></Arrowhead>
						<div class="projectRanking bg-[#112E46] h-40 overflow-hidden">
							<div class="rankingHeader">
								<div class="rankingTitle">各项目排名情况</div>
								<div class="rankingIcon">◀</div>
							</div>
							<div class="rankingContent">
								<div class="projectBars">
									<div
										v-for="(project, index) in projectRankingData"
										:key="index"
										class="projectBarItem">
										<div class="projectName" :title="project.name">
											{{ project.name }}
										</div>
										<div class="progressBar">
											<div
												class="progressFill"
												:style="{
													width: project.percentage + '%'
												}"></div>
										</div>
										<div class="projectPercentage">
											<span style="color: #dbeaea; margin-right: 4px"
												>{{ project.value.toFixed(2) }}{{ project.unit }}</span
											>
										</div>
									</div>
								</div>
							</div>
						</div>
						<Arrowhead
							class="my-3"
							:name="'中心外围情况'"
							direction="left"
							:isChange="false">
							<el-select
								v-model="selectedDistrict"
								placeholder="请选择查询区域"
								popper-class="my-popper"
								size="small"
								style="width: 5.9375rem"
								@change="districtSelectedChange">
								<el-option
									v-for="item in districtOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value" />
							</el-select>
						</Arrowhead>
						<!-- TODO:1 -->
						<div class="pl-[0.875rem] mt-[0.75rem] h-[calc(100%-17rem)]">
							<div class="dbTable w-[23.125rem] h-full">
								<DbTableHeader
									:list="[
										{ name: '行政区划', class: 'w-30' },
										{ name: '龙头项目', class: 'w-30' },
										{ name: '政策补贴', class: 'w-30' },
										{ name: '人才引进', class: 'w-30' },
										{ name: '政策补贴', class: 'w-30' }
									]"></DbTableHeader>
								<div class="dbTableBody">
									<div
										class="dbTableRow"
										v-for="item in resultQuery"
										:key="item"
										style="font-size: 14px">
										<span class="w-30 truncate" :title="item.indicatorName">{{
											item.indicatorName
										}}</span>
										<span
											class="flex-1 truncate"
											:class="
												Number(item.changeRate) < 0
													? 'green'
													: Number(item.changeRate) > 0
													? 'red'
													: ''
											"
											:title="convertData(item.monitorValue + item?.unit)"
											>{{ convertData(item.monitorValue + item?.unit) }}</span
										>
										<span
											class="flex-1 truncate"
											:class="
												Number(item.changeRate) < 0
													? 'green'
													: Number(item.changeRate) > 0
													? 'red'
													: ''
											"
											:title="convertData(item.predictValue + item?.unit)"
											>{{ convertData(item.predictValue + item?.unit) }}</span
										>
										<span
											class="w-[5.625rem] !color-white flex items-center justify-center">
											<img
												class="mr-2"
												src="@/assets/img/TimeSpaceRadar/up.png"
												alt=""
												width="13"
												height="10"
												v-if="Number(item.changeRate) > 0" />
											<img
												class="mr-2"
												src="@/assets/img/TimeSpaceRadar/down.png"
												alt=""
												width="13"
												height="10"
												v-if="Number(item.changeRate) < 0" />
											{{ Number(item.changeRate) < 0 ? '' : '+'
											}}{{ (item.changeRate * 100).toFixed(2) }}%
										</span>
									</div>
								</div>
							</div>
						</div>
						<!-- <div
							class="job-housing-chart bg-[#112e46] p-4 pb-2 relative h-[11.625rem]">
							<div
								class="chart-legend flex gap-2 absolute right-4 z-2 left-[60%]">
								<div class="legend-item flex items-center">
									<div class="legend-square warning"></div>
									<span class="legend-text">中心城区</span>
								</div>
								<div class="legend-item flex items-center">
									<div class="legend-square safe"></div>
									<span class="legend-text">外围地区</span>
								</div>
							</div>
							<div style="width: 100%; height: 100%">
								<ECharts
									:option="jobHousingChartOpt()"
									:resize="false"></ECharts>
							</div>
						</div> -->
						<Arrowhead
							class="my-3"
							name="区县镇街情况"
							direction="left"
							:isChange="false">
							<div class="flex items-center">
								<img
									class="cursor-pointer"
									src="@/assets/img/sort.png"
									width="20"
									alt=""
									@click="sortHande" />
								<el-select
									v-model="selectedDistrict2"
									placeholder="请选择查询区域"
									popper-class="my-popper"
									size="small"
									style="width: 5.9375rem; margin-left: 1.875rem"
									@change="districtSelectedChange2">
									<el-option
										v-for="item in districtOptions2"
										:key="item.value"
										:label="item.label"
										:value="item.value" />
								</el-select>
							</div>
						</Arrowhead>
							<!-- TODO:1 -->
							<div class="pl-[0.875rem] mt-[0.75rem] h-[calc(100%-17rem)]">
								<div class="dbTable w-[23.125rem] h-full">
									<DbTableHeader
										:list="[
										{ name: '行政区划', class: 'w-30' },
										{ name: '龙头项目', class: 'w-30' },
										{ name: '政策补贴', class: 'w-30' },
										{ name: '人才引进', class: 'w-30' },
										{ name: '政策补贴', class: 'w-30' }
										]"></DbTableHeader>
									<div class="dbTableBody">
										<div
											class="dbTableRow"
											v-for="item in resultQuery"
											:key="item"
											style="font-size: 14px">
											<span class="w-30 truncate" :title="item.indicatorName">{{
												item.indicatorName
											}}</span>
											<span
												class="flex-1 truncate"
												:class="
													Number(item.changeRate) < 0
														? 'green'
														: Number(item.changeRate) > 0
														? 'red'
														: ''
												"
												:title="convertData(item.monitorValue + item?.unit)"
												>{{ convertData(item.monitorValue + item?.unit) }}</span
											>
											<span
												class="flex-1 truncate"
												:class="
													Number(item.changeRate) < 0
														? 'green'
														: Number(item.changeRate) > 0
														? 'red'
														: ''
												"
												:title="convertData(item.predictValue + item?.unit)"
												>{{ convertData(item.predictValue + item?.unit) }}</span
											>
											<span
												class="w-[5.625rem] !color-white flex items-center justify-center">
												<img
													class="mr-2"
													src="@/assets/img/TimeSpaceRadar/up.png"
													alt=""
													width="13"
													height="10"
													v-if="Number(item.changeRate) > 0" />
												<img
													class="mr-2"
													src="@/assets/img/TimeSpaceRadar/down.png"
													alt=""
													width="13"
													height="10"
													v-if="Number(item.changeRate) < 0" />
												{{ Number(item.changeRate) < 0 ? '' : '+'
												}}{{ (item.changeRate * 100).toFixed(2) }}%
											</span>
										</div>
									</div>
								</div>
							</div>
						<!-- <div class="bg-[#112E46] w-full h-[18.625rem] pt-4">
							<ECharts :option="jdChartOpt" :resize="false"></ECharts>
						</div> -->
					</div>
				</div>
			</template>
		</Layout>
		<AddProject
			v-if="modelValue"
			:show="btnType === 'history'"
			@close="(modelValue = false), (btnType = '')"></AddProject>
	</div>
</template>
<script setup>
	import { Splitpanes, Pane } from 'splitpanes';
	import 'splitpanes/dist/splitpanes.css';
	import { Plus, Minus } from '@element-plus/icons-vue';
	import cityApi from '@/api/index.js';
	import { useAppStore } from '@/stores/modules/app.js';
	const useStore = useAppStore();
	import MapViewer from '@/views/MapViewer/Index.vue';
	import RelationMap from '@/components/relationMap/indexMap.vue';
	import AddProject from '@/components/addProject/index.vue';
	import MaxMap from '@/components/mapView/maxMap.vue';
	import ZbListCom from '@/components/lists/zbList.vue';
	import diamond from '@/assets/img/diamond.png';
	import * as echarts from 'echarts';
	import ECharts from '@/components/eCharts/index.vue';
	import { getMatchedIndicators, getAssetsFile } from '@/utils/index.js';

	import buildLayer, {
		LayerType
	} from '@/components/map/primitive/layer/Layer';
	import { useMapStore } from '@/stores/modules/map.js';
	const mapStore = useMapStore();

	// 新增：选择目标
	const activeTarget = ref('');
	const targetList = ref([
		{
			value: 'population',
			label: '人口承载能力增强'
		},
		{
			value: 'function',
			label: '综合服务功能提升'
		},
		{
			value: 'core',
			label: '产业集群培育'
		}
	]);
	const selectedDistrict2 = ref('全部区县');
	const districtOptions2 = ref([
		{
			value: '全部区县',
			label: '全部区县'
		},
		{
			value: '全部街道',
			label: '全部街道'
		}
	]);
	const sortDirection = ref(false);

	const fourDtaList = ref([]);
	const districtSelectedChange2 = () => {
		sortDirection.value = !sortDirection.value;
		if (selectedDistrict2.value) {

			let projectIds = [
				projectName1.value,
				projectName2.value,
				projectName3.value,
				projectName4.value,
				projectName5.value,
				projectName6.value
			].filter(Boolean);

			let vals1 = comparedResInfo.value?.childProjects.filter(n =>
				projectIds.includes(n.id)
			);
			fourDtaList.value = []
			vals1.forEach(m => {
				let datas = m.resultDatas;
				let level = selectedDistrict2.value.replace('全部', '');
				let filterDatas = datas.filter(m => m.regionLevel == level);

				let vals = filterDatas;
				if (sortDirection.value) {
					// 升序
					vals = [...filterDatas].sort((a, b) => b.predictValue - a.predictValue);
				} else {
					// 降序
					vals = [...filterDatas].sort((a, b) => a.predictValue - b.predictValue);
				}
				fourDtaList.value.push({
					name: m.nodeName,
					yearData: vals
				})

			});

			let indicatorInfo = zbList.value.find(n => n.value == activeZb.value);
			setJdChartOpt()
		}
	};
	// 矢量范围与统计数据
	const vectorDataList = ref([
		{
			id: 'center',
			name: '中心城区范围',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [5]
		},
		{
			id: 'country',
			name: '区县间OD',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [2]
		},
		{
			id: 'street',
			name: '街道间OD',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [3]
		},
		{
			id: 'smallschool',
			name: '小学800m',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [1]
		},
		{
			id: 'hospital',
			name: '医院2000m',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [0]
		},
		{
			id: 'middleschool',
			name: '中学1200m',
			visible: false,
			url: 'http://192.168.225.8:6080/arcgis/rest/services/%E6%8E%A8%E6%BC%94%E6%95%B0%E6%8D%AE/%E7%A9%BA%E9%97%B4%E6%99%BA%E4%BC%98_%E5%85%B6%E4%BB%96%E7%9F%A2%E9%87%8F%E6%95%B0%E6%8D%AE/MapServer',
			layers: [4]
		}
	]);
	const barChartRef = ref(null); // 柱状图
	let barChart = null; // 柱状图实例
	const selectedDistrict = ref('中心外围');
	const districtOptions = ref([
		{
			value: '中心外围',
			label: '中心外围'
		},
		{
			value: '三核四极',
			label: '三核四极'
		}
	]);
	const legendList = ref([
		{ name: '人口指标', color: '#E39BA7' },
		{ name: '土地指标', color: '#E8C46D' },
		{ name: '产业指标', color: '#1FC6FF' },
		{ name: '交通指标', color: '#8B72FC' },
		{ name: '公服指标', color: '#E64E50' },
		{ name: '结构指标', color: '#067076' },
		{ name: '结构指标', color: '#7EF48B' },
		{ name: '韧性指标', color: '#F959D6' }
	]);

	const firstlegendList = ref(JSON.parse(JSON.stringify(legendList.value)));
	const secondlegendList = ref(JSON.parse(JSON.stringify(legendList.value)));
	const thirdlegendList = ref(JSON.parse(JSON.stringify(legendList.value)));
	const fourthlegendList = ref(JSON.parse(JSON.stringify(legendList.value)));
	const fivelegendList = ref(JSON.parse(JSON.stringify(legendList.value)));
	const sixlegendList = ref(JSON.parse(JSON.stringify(legendList.value)));

	// 指标变化TOP5
	const trafficData = ref([]);
	// 统一管理所有Title组件的状态
	const titleStates = ref({
		project1: true,
		project: true,
		special: true,
		showType: true,
		chooseUnit: true,
		zbType: true,
		zb: true,
		target: true,
		indicator: true,
		unitYear: true,
		scene: true,
		vector: false,
		year: true,
		cstz: true,
		summary: true
	});
	// 显示地图
	const showMap = ref(true);
	// 处理Title组件的切换事件
	const handleTitleToggle = (key, value) => {
		titleStates.value[key] = !titleStates.value[key];
	};
	const projectName1 = ref('');
	const projectName2 = ref('');
	const projectName3 = ref('');
	const projectName4 = ref('');
	const projectName5 = ref('');
	const projectName6 = ref('');

	// 选择年份
	const yearCurrent = ref('2030');
	const yearList = ref([
		{ id: '2030', value: '2030', label: '2030年' },
		{ id: '2035', value: '2035', label: '2035年' },
		{ id: '2040', value: '2040', label: '2040年' }
	]);
	const activeLx = ref('');
	const lxList = ref([]);
	const activeZb = ref('');
	const zbList = ref([]);
	const projectName = ref('');
	const projectNameList = ref([{ value: '0', label: '新建推演项目' }]);
	const modelValue = ref(false);
	const btnType = ref(''); // add: 新建项目, history: 历史项目

	// 场景体系
	const activeScenario = ref('spatial');
	const scenarioList = ref([
		{ value: 'spatial', label: '空间智优' },
		{ value: 'economy', label: '产业智兴' },
		{ value: 'livable', label: '宜居智享' },
		{ value: 'green', label: '绿美智绘' },
		{ value: 'resilient', label: '韧性智安' },
		{ value: 'heritage', label: '名城智护' },
		{ value: 'digital', label: '数字智治' }
	]);

	const handleMore = () => {
		btnType.value = 'history';
		modelValue.value = true;
	};

	const firstMapViewer = ref(null);
	const secondMapViewer = ref(null);
	const thirdMapViewer = ref(null);
	const fourthMapViewer = ref(null);
	const fiveMapViewer = ref(null);
	const sixMapViewer = ref(null);

	const barChartData = ref({
		districts: ['天河区', '越秀区', '黄埔区'],
		afterProject: [730, 790, 1180],
		beforeProject: [930, 990, 700]
	});

	// 表态名称
	const projectCompareTitle = ref('老年人比例总值对比（%）');
	const selectedIndicatorInfo = ref(null);

	// 项目排名数据
	const projectRankingData = ref([
		{ name: '1.居住用地主导供应情景', percentage: 36, value: 36, unit: '%' },
		{ name: '2.商服用地主导供给情景', percentage: 23, value: 23, unit: '%' },
		{ name: '3.工业用地主导供给情景', percentage: 17, value: 17, unit: '%' },
		{ name: '4.建设用地均衡供给情景', percentage: 15, value: 15, unit: '%' }
	]);
	const projectRankingDataAvg = ref(0.0);
	const landUseTypeList = ref([]);

	// 预警信息
	const warningInfo = ref('');
	const warningInfoList = ref([]);
	const projectNames = ref([]);

	// 柱状图初始化
	const initBarChart = (unit = '%') => {
		if (!barChartRef.value) {
			return;
		}
		// 如果已存在实例，先销毁
		if (barChart) {
			barChart.dispose();
			barChart = null;
		}
		barChart = echarts.init(barChartRef.value);
		let clrs = [
			['#77f2fc', '#57a4fb'],
			['#f877a6', '#f6415c'],
			['#42e796', '#218355'],
			['#f0e65f', '#8d8737']
		];
		projectNames.value = barChartData.value.datas?.map((m, index) => {
			return {
				color1: clrs[index][0],
				color2: clrs[index][1],
				name: barChartData.value.projectNames[index]
			};
		});

		let items = barChartData.value.datas?.map((m, index) => {
			return {
				name: barChartData.value.projectNames[index],
				type: 'bar',
				data: m,
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: clrs[index][0] },
						{ offset: 1, color: clrs[index][1] }
					]),
					borderRadius: [4, 4, 0, 0]
				},
				emphasis: {
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: clrs[index][0] },
							{ offset: 1, color: clrs[index][1] }
						])
					}
				},
				barWidth: '12px'
			};
		});

		const option = {
			backgroundColor: 'transparent',
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				borderColor: '#00f6ff',
				borderWidth: 1,
				textStyle: {
					color: '#fff'
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '15%', // 调整为与参考demo一致
				top: '35%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: barChartData.value.districts,
				axisLine: {
					lineStyle: {
						color: '#00f6ff'
					}
				},
				axisLabel: {
					color: '#fff',
					fontSize: 12,
					rotate: 0
				},
				axisTick: {
					alignWithLabel: true,
					lineStyle: {
						color: '#00f6ff'
					}
				}
			},
			yAxis: {
				type: 'value',
				name: unit,
				nameTextStyle: {
					color: '#fff',
					fontSize: 12,
					align: 'right',
					padding: [0, -14, 0, 0]
				},
				axisLine: {
					lineStyle: {
						color: '#00f6ff'
					}
				},
				axisLabel: {
					color: '#fff',
					fontSize: 12
				},
				splitLine: {
					lineStyle: {
						color: 'rgba(0, 246, 255, 0.2)',
						type: 'dashed'
					}
				}
			},
			series: items,
			dataZoom: [
				{
					type: 'inside', // 内置型缩放（鼠标滚轮）
					xAxisIndex: 0,
					start: 0,
					end: 30,
					zoomOnMouseWheel: true,
					moveOnMouseMove: true,
					moveOnMouseWheel: true
				},
				{
					type: 'slider',
					show: true,
					xAxisIndex: 0,
					bottom: 10, // 距离底部距离
					height: 12, // 滑块高度，与参考demo一致
					borderColor: 'transparent', // 透明边框
					backgroundColor: 'rgba(0, 0, 0, 0.3)', // 背景色
					fillerColor: 'rgba(0, 246, 255, 0.6)', // 选中区域填充色
					borderRadius: 6, // 圆角
					handleSize: 12, // 手柄大小
					handleStyle: {
						color: '#00f6ff', // 手柄颜色
						borderColor: '#00f6ff',
						borderWidth: 1,
						shadowBlur: 0,
						shadowColor: '#00f6ff'
					},
					moveHandleStyle: {
						color: '#00f6ff'
					},
					textStyle: {
						color: '#fff',
						fontSize: 10
					},
					dataBackground: {
						lineStyle: {
							color: 'rgba(0, 246, 255, 0.3)',
							width: 1
						},
						areaStyle: {
							color: 'rgba(0, 246, 255, 0.1)'
						}
					},
					selectedDataBackground: {
						lineStyle: {
							color: '#00f6ff',
							width: 1
						},
						areaStyle: {
							color: 'rgba(0, 246, 255, 0.3)'
						}
					},
					brushStyle: {
						color: 'rgba(0, 246, 255, 0.2)'
					},
					emphasis: {
						handleStyle: {
							color: '#00f6ff',
							borderColor: '#00f6ff',
							borderWidth: 1
						}
					},
					start: 0,
					end: 30,
					zoomLock: false, // 是否锁定选择区域
					showDetail: false // 不显示详细数值
				}
			]
		};
		barChart.setOption(option);
		// 添加窗口大小变化监听
		window.addEventListener('resize', () => barChart.resize());
	};

	// 柱状图
	const barData = ref([
		{
			name: '居住用地',
			yearData: [
				{ label: '中心城区', value: 88.8 },
				{ label: '外围地区', value: 88.8 }
			]
		},
		{
			name: '商服用地',
			yearData: [
				{ label: '中心城区', value: 89.7 },
				{ label: '外围地区', value: 90.6 }
			]
		},
		{
			name: '工业用地',
			yearData: [
				{ label: '中心城区', value: 92.7 },
				{ label: '外围地区', value: 79.3 }
			]
		},
		{
			name: '建设用地',
			yearData: [
				{ label: '中心城区', value: 89.8 },
				{ label: '外围地区', value: 78.1 }
			]
		}
	]);
	const jobHousingChartOpt = () => {
		const areas = ['中心城区', '外围地区'];
		const landTypes = ['居住用地主导供应情景', '商业服务用地主导供应情景', '工业用地主导供应情景', '均衡用地主导供应情景'];

		const series = landTypes.map(landType => {
			const landTypeItem = barData.value.find(item => item.name === landType);
			const data = areas.map(area => {
				const areaItem = landTypeItem?.yearData.find(
					item => item.label === area
				);
				return areaItem ? areaItem.value : 0;
			});
			return {
				type: 'bar',
				barWidth: 20,
				barGap: '35%',
				name: landType,
				data,
				itemStyle: {
					color: function (params) {
						if (params.seriesName === '居住用地主导供应情景') {
							return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#BD3329' },
								{ offset: 1, color: '#F58F32' }
							]);
						}
						if (params.seriesName === '商业服务用地主导供应情景') {
							return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#340108' },
								{ offset: 1, color: '#C84134' }
							]);
						}
						if (params.seriesName === '工业用地主导供应情景') {
							return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#60F5FF' },
								{ offset: 1, color: '#3FA4FF' }
							]);
						} else {
							return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#38B4DD' },
								{ offset: 1, color: '#264188' }
							]);
						}
					}
				},
				// label: {
				// 	show: true,
				// 	position: 'top',
				// 	formatter: '{c}',
				// 	color: '#fff',
				// 	fontSize: 12,
				// 	fontFamily: 'AlibabaPuHuiTi-75'
				// }
			};
		});

		return {
			tooltip: { trigger: 'axis' },
			grid: {
				left: '3%',
				right: '3%',
				bottom: '0%',
				top: '28%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data: ['中心城区', '外围地区'],
				axisLabel: {
					color: '#fff',
					fontSize: 12,
					fontFamily: 'SourceHanSansCN-Regular',
					margin: 12
				}
			},
			yAxis: {
				type: 'value',
				name: selectedIndicatorInfo.value?.nodeName + '(' + selectedIndicatorInfo.value?.unit + ')' || '劳动力人口占比（%）',
				// max: 100,
				nameTextStyle: {
					color: '#B3C0CC',
					fontSize: 12,
					align: 'left',
					padding: [0, 0, 0, -30]
				},
				splitLine: {
					lineStyle: {
						color: '#35414C',
						type: 'dashed',
						width: 1
					}
				},
				axisLabel: {
					color: '#B3C0CC',
					fontSize: 12
				}
			},
			series
		};
	};
	const jdChartOpt = ref(null);

	/**
	 * 颜色映射配置（集中维护，方便同步图例+系列颜色）
	 * key: 系列名称
	 * value: { start: 渐变起始色, end: 渐变结束色 }
	 */
	const SERIES_COLOR_MAP = {
		居住用地主导供应情景: { start: '#60F5FF', end: '#3FA4FF' },
		商服用地主导供应情景: { start: '#FF72A6', end: '#FF3657' },
		建设用地均衡供给情景: { start: '#FEC133', end: '#FE9314' },
		工业用地主导供应情景: { start: '#2AEFA1', end: '#09CC7E' }
	};

	/**
	 * 获取系列对应的线性渐变颜色
	 * @param {string} seriesName 系列名称
	 * @returns {echarts.graphic.LinearGradient} 渐变配置
	 */
	const getSeriesGradient = seriesName => {
		const { start, end } = SERIES_COLOR_MAP[seriesName] || {
			start: '#fff',
			end: '#ccc'
		};
		return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
			{ offset: 0, color: start },
			{ offset: 1, color: end }
		]);
	};

	/**
	 * 图表系列基础数据（仅维护名称和数据，样式通过函数统一生成）
	 */
	const SERIES_BASE_DATA = [
		{ name: '居住用地主导供应情景', data: [20, 49, 30, 50] },
		{ name: '商服用地主导供应情景', data: [26, 59, 32, 44] },
		{ name: '建设用地均衡供给情景', data: [26, 59, 32, 44] },
		{ name: '工业用地主导供应情景', data: [26, 59, 32, 44] }
	];

	/**
	 * 生成单个系列的完整配置（核心：将color提至series顶层，让图例识别）
	 * @param {Object} item 系列基础数据
	 * @returns {Object} 系列完整配置
	 */
	const generateSeriesConfig = item => ({
		name: item.name,
		type: 'bar',
		barWidth: 13,
		// 关键：将颜色提至series顶层，图例标记会自动拾取该颜色
		color: getSeriesGradient(item.name),
		tooltip: {
			valueFormatter: value => `${value}%`
		},
		itemStyle: {
			borderRadius: 4 // 仅保留非颜色相关的样式
		},
		data: item.data
	});

	/**
	 * 生成图例配置（可选：让图例文本颜色也同步系列主色）
	 * @returns {Object} 图例配置
	 */
	const generateLegendConfig = () => ({
		// 将legend.data改为对象数组，实现单个图例项的文本颜色定制
		data: SERIES_BASE_DATA.map(item => ({
			name: item.name,
			textStyle: {
				color: '#C4C4C4',
				fontSize: 12,
				fontFamily: 'AlibabaPuHuiTi-55'
			}
		})),
		// 如需统一图例样式，可保留公共配置（优先级低于data中的textStyle）
		textStyle: {
			color: '#C4C4C4',
			fontSize: 12,
			fontFamily: 'AlibabaPuHuiTi-55'
		}
	});

	/**
	 * 设置图表配置项（核心修复：图例颜色与系列同步）
	 */
	const setJdChartOpt = () => {
		const chartOpt = {
			tooltip: { trigger: 'axis' },
			toolbox: {},
			grid: { top: '26%' },
			legend: generateLegendConfig(), // 生成带颜色的图例配置
			xAxis: [
				{
					type: 'category',
					data: ['明珠街道', '明明街道', '小明街道', '二明街道'],
					axisPointer: { type: 'shadow' },
					axisLabel: {
						color: '#fff',
						fontSize: 12,
						fontFamily: 'SourceHanSansCN-Regular',
						margin: 12
					}
				}
			],
			yAxis: {
				type: 'value',
				max: 100,
				nameTextStyle: {
					color: '#B3C0CC',
					fontSize: 14,
					align: 'left',
					padding: [0, 0, 10, 0]
				},
				splitLine: {
					lineStyle: {
						color: '#344D62',
						type: 'solid',
						width: 1
					}
				},
				axisLabel: {
					color: '#B3C0CC',
					fontSize: 14
				}
			},
			series: SERIES_BASE_DATA.map(generateSeriesConfig)
		};

		console.log(chartOpt)
		jdChartOpt.value = chartOpt;
	};
	// 选择单元
	const dyCurrent = ref('');
	const dyList = ref([]);
	const dyHandleChange = value => {
		dyCurrent.value = value;
		getDeductionResultStatistics();
	};
	const handleYearChange = obj => {
		yearCurrent.value = obj?.id || obj?.value;
		getDeductionResultStatistics();
	};
	const handleZbTypeChange = value => {
		activeLx.value = value;
		indicatorTypeChangeHandle();
	};
	const handleZbChange = item => {
		activeZb.value = item.value;
		getDeductionResultStatistics();
	};
	const completedProjectInfos = ref([]);

	const subPCompletedInfo = ref([]);
	const subPCompletedProjectInfos = ref([]);
	const splitScreenList = ref([
		{ label: '一屏', value: 1 },
		{ label: '二屏', value: 2 },
		{ label: '四屏', value: 4 },
		{ label: '六屏', value: 6 }
	]);
	const splitScreenCnt = ref(4);
	const comparedResInfo = ref(null);
	// 项目指标分区对比
	const selectedDistricts = ref([]);
	const selectedSubProjects = ref([]);
	const selectedSubProject = ref('');

	// 指标详情查询，切换行政区划
	const districtSelectedChange = () => {
		if (selectedDistrict.value) {
			// let datas = completedProjectInfos.value.indicatorData;
			// let filterDatas = datas.filter(
			// 	m => m.regionLevel == selectedDistricts.value
			// );
			// barData.value = filterDatas.map(m => {
			// 	return {
			// 		name: m.xzqmc,
			// 		value: m.predictValue
			// 	};
			// });

			let projectIds = [
				projectName1.value,
				projectName2.value,
				projectName3.value,
				projectName4.value,
				projectName5.value,
				projectName6.value
			].filter(Boolean);

			barData.value = [];
			let vals1 = comparedResInfo.value?.childProjects.filter(n =>
				projectIds.includes(n.id)
			);
			vals1.forEach(m => {
				let datas = m.resultDatas;
				let filterDatas = datas.filter(
					m => m.regionLevel == selectedDistrict.value
				);
				let yearData = filterDatas.map(m => {
					return {
						label: m.xzqmc,
						value: m.predictValue
					};
				});
				barData.value.push({
					name: m.name,
					yearData: yearData
				});
			});


			let indicatorInfo = zbList.value.find(n => n.value == activeZb.value);
			selectedIndicatorInfo.value = indicatorInfo;
			jobHousingChartOpt(indicatorInfo);
		}
	};
	// 选择专题
	const activeZt = ref('');
	const planningWarningTopicList = ref([]);
	const planningWarningTopicInfos = ref([]);
	// 处理专题选择变化
	const handleSpecialChange = obj => {
		activeZt.value = obj.value;
		handleWarningTopicChange();
	};

	// 场景体系选择
	const handleScenarioChange = async value => {
		// 根据场景更新相关数据
		// getCatalogGetById('ZBC053');
		if (value == 'spatial') {
			activeScenario.value = value;
			await initProjects('YYGF');
		}
		if (value == 'economy') {
			activeScenario.value = value;
			await initProjects('YYGF_CYZX');
		}
	};

	// 获取数据（getRes方法，如果不存在则添加占位）
	const getRes = async () => {
		// 根据选择的单元和年份获取数据
		// 这里可以调用API获取数据
	};
	// 获取项目列表
	const initProjects = async (bizType = 'YJLD') => {
		try {
			const res = await cityApi.projectQueryWithPage({
				adminFlag: useStore.userInfo?.adminFlag || '1',
				loginUser: useStore.userInfo?.username || '',
				current: 1,
				size: 2,
				endTime: '',
				startTime: '',
				eq_status: '3',
				eq_bizType: bizType,
				like_name: ''
			});
			if (res.resultCode === 'S') {
				completedProjectInfos.value = res.data || [];
				let firstItem = JSON.parse(JSON.stringify(projectNameList.value[0]));
				projectNameList.value = res.data.map(m => {
					return { value: m.id, label: m.name };
				});
				projectNameList.value.unshift(firstItem);
				projectName.value = projectNameList.value[1].value;
				handleProjectChange(projectNameList.value[1]?.value);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	// 选择项目的场景按钮选择
	const handleProjectScenarioChange = value => {
		activeProjectScenario.value = value;
		// 根据场景更新项目列表或相关数据
	};

	// 目标选择
	const handleTargetChange = value => {
		activeTarget.value = value;
		// 根据目标更新相关数据
		lxList.value = targetList.value
			.find(m => m.nodeId == value)
			.children.map(m => {
				return {
					...m,
					value: m.nodeId,
					label: m.nodeName
				};
			});
		lxList.value = lxList.value.filter(m => m.children?.length > 0);
		activeLx.value = lxList.value[0]?.value;
		indicatorTypeChangeHandle(lxList.value[0]?.value);
	};

	const handleProjectChange = value => {
		if (value === '0') {
			btnType.value = 'add';
			modelValue.value = true;
		} else {
			projectName.value = value;
			let projInfo = completedProjectInfos.value.find(
				n => n.id == projectName.value
			);
			// 切换单元
			dyList.value =
				projInfo?.rangeType.split(',').map(d => {
					return { value: d, id: d, label: d };
				}) || [];
			// dyCurrent.value = projInfo?.rangeType.split(',')[0] || '';
			dyCurrent.value = '区县';
			// 切换年份
			yearList.value = projInfo.predictYear.split(',').map(m => {
				return { label: m, value: m };
			});
			yearCurrent.value = yearList.value[0].value || '';
			getZb()
			if (activeScenario.value == 'spatial') {
				getDetailQuery('YYGF', 'YYGF3');
			}
			if (activeScenario.value == 'economy') {
				getDetailQuery('YYGF_CYZX', 'YYGF_CYZX1');
			}
			// // 切换专题
			// const indicatorIds =
			// 	completedProjectInfos.value.find(n => n.id == projectName.value)
			// 		?.indicatorIds || '';
			// const tree = getMatchedIndicators(
			// 	planningWarningTopicInfos.value,
			// 	indicatorIds,
			// 	'nodeId'
			// );
			// // 获取该项目的专题信息
			// planningWarningTopicList.value = tree.map(m => {
			// 	return { ...m, value: m.nodeId, label: m.nodeName };
			// });
			// if (planningWarningTopicList.value?.length) {
			// 	activeZt.value = planningWarningTopicList.value[0].value;
			// 	handleWarningTopicChange();
			// }
		}
	};

	const getZb = async () => {
		try {
			const res = await cityApi.resultTree({
				current: 1,
				size: 1000,
				projectType: 'MAIN',
				array_indicatorId: '',
				eq_indicatorId: '', // 指标ID
				eq_projectId: projectName.value, // 推演项目ID
				eq_predictYear: yearCurrent.value, // 目标年份
				eq_regionLevel: '', // dyCurrent.value, // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: '', // 行政区代码
				like_indicatorName: '' // 指标名称
			});
			if (res.resultCode === 'S') {
				// 选择目标
				targetList.value = res.data[0].children.map(m => {
					return Object.assign(m, {
						value: m.nodeId,
						label: m.nodeName,
						data: m
					});
				});
				handleTargetChange(targetList.value[0].value);
			}
		} catch (error) {
			console.error('专门获取指标树接口:', error);
		}
	}

	const subPCompletedProjectChange = () => {
		console.log('subPCompletedInfo:', subPCompletedInfo);

		return false;
		subPCompletedInfo.value;
		let findItem = subPCompletedProjectInfos.value.find(
			n => n.id == subPCompletedInfo.value
		);
	};

	// 专题
	const handleWarningTopicChange = () => {
		let topic = planningWarningTopicInfos.value.find(
			m => m.nodeId == activeZt.value
		);
		lxList.value = topic.children
			.filter(n => n.children.length > 0)
			.map(m => {
				return { label: m.nodeName, value: m.nodeId };
			});
		activeLx.value = lxList.value[0].value;
		indicatorTypeChangeHandle(lxList.value[0].value);
	};
	// 指标类型
	const indicatorTypeChangeHandle = value => {
		activeLx.value = value;
		// 根据指标类型更新指标列表
		zbList.value = [];
		const zbChildren = lxList.value.filter(n => n.value == value);
		if (zbChildren) {
			zbList.value = zbChildren[0].children.map(m => {
				return {
					...m,
					value: m.nodeId,
					label: m.nodeName
				};
			});
			zbChange(zbList.value[0]);
		}
	};

	// 指标选择事件
	const zbChange = item => {
		activeZb.value = item.value;
		getDeductionResultStatistics();
	};

	// 获取子项目
	const getDetailQuery = async (bizType = 'YJLD', actionType = 'YJLD1') => {
		try {
			const res = await cityApi.projectDetailQuery({
				projectId: projectName.value,
				bizType: bizType,
				actionType: actionType
			});
			if (res.resultCode === 'S') {
				subPCompletedProjectInfos.value = (res.data?.childProjects || []).map(
					m => {
						return Object.assign(m, {
							value: m.id,
							label: m.name,
							data: m
						});
					}
				);
				subPCompletedInfo.value = subPCompletedProjectInfos.value[0]?.id || '';
				// 子项目集合
				warningInfoList.value = subPCompletedProjectInfos.value.map(m => {
					return { value: m.id, label: m.name, data: m };
				});
				warningInfo.value = warningInfoList.value[0].value;
			}
		} catch (error) {
			console.error('获取子项目失败:', error);
		}
	};
	// 项目指标排名
	const indicatorSortChangehandle = () => {
		trafficData.value = [];
		let subProjInfo = comparedResInfo.value?.childProjects.find(
			n => n.id == warningInfo.value
		);
		if (subProjInfo) {
			let vals = JSON.parse(JSON.stringify(subProjInfo.resultDatas)).sort(
				(a, b) => b.changeRate - a.changeRate
			);
			let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
			trafficData.value = vals.slice(0, 5).map(n => {
				return {
					name: n.xzqmc,
					time:
						(indicatorInfo?.unit == '%'
							? (n.monitorValue * 100).toFixed(2)
							: n.monitorValue) + `${indicatorInfo?.unit}`,
					trend: n.changeRate >= 0 ? 'up' : 'down',
					percentage: (n.changeRate * 100).toFixed(2) + '%'
				};
			});
		}
	};
	// 分屏选择
	const splitScreenChangehandle = value => {
		console.log('屏幕分屏数量：', splitScreenCnt.value);
	};

	// 获取专题数据
	const getCatalogGetById = async id => {
		try {
			const res = await cityApi.catalogGetById({
				catalogId: id
			});
			if (res.resultCode === 'S' && res.data?.tree.length) {
				// 选择目标
				targetList.value = res.data.tree[0].children.map(m => {
					return Object.assign(m, {
						value: m.nodeId,
						label: m.nodeName,
						data: m
					});
				});
				handleTargetChange(targetList.value[0].value);
			}
		} catch (error) {
			console.error('查询城市推演项目记录信息失败:', error);
		}
	};

	// 行政区变化
	const selectedDistrictChangehandle = () => {
		getBarData();
	};
	// 项目变化
	const selectedSubProjectChangehandle = () => {
		getBarData();
	};

	const getBarData = () => {
		let datas = comparedResInfo.value?.indicatorStatisticData || [];
		if (selectedDistrict.value != 'all') {
			datas = datas.filter(m => m.xzqdm == selectedDistrict.value);
		}
		barChartData.value.districts = datas.map(m => m.xzqmc);
		let adf = datas.map(m => {
			let subProjInfos = m.resultDatas;
			let projectIds = [
				projectName1.value,
				projectName2.value,
				projectName3.value,
				projectName4.value,
				projectName5.value,
				projectName6.value
			].filter(Boolean);
			subProjInfos = subProjInfos.filter(n => projectIds.includes(n.projectId));
			if (selectedSubProject.value != 'all') {
				subProjInfos = m.resultDatas.filter(
					n => n.projectId == selectedSubProject.value
				);
			}

			if (subProjInfos?.length) {
				barChartData.value.projectNames = subProjInfos.map(n => {
					let nifo = comparedResInfo.value.childProjects.find(
						m => m.id == n.projectId
					);
					return nifo.name;
				});
			}
			return subProjInfos.map(m => m.predictValue);
		});

		// 获取列数（以第一行的长度为基准）
		const cols = adf[0]?.length || 0;
		const result = Array.from({ length: cols }, () => []);
		for (let i = 0; i < adf.length; i++) {
			const row = adf[i];
			if (Array.isArray(row)) {
				for (let j = 0; j < Math.min(cols, row.length); j++) {
					result[j].push((row[j] * 100).toFixed(2)); // 乘以 100
				}
			}
		}
		barChartData.value.datas = result;
		let indicatorInfo = zbList.value.find(n => n.value == activeZb.value);
		initBarChart(indicatorInfo?.data?.unit || '');
	};
	// 城市推演结果数据统计接口
	const getDeductionResultStatistics = async () => {
		if (!projectName.value || !activeZb.value) {
			return;
		}

		try {
			const res = await cityApi.comparedStatistic({
				current: 1,
				size: 1000,
				eq_indicatorId: activeZb.value, // 指标ID
				eq_projectId: projectName.value, // 项目ID
				eq_predictYear: 2035, // yearCurrent.value, // 目标年份
				eq_regionLevel: '', // dyCurrent.value || '', // 行政区级别，全市、区县、街道、网格
				eq_xzqdm: '', // 行政区代码
				like_indicatorName: '', // 指标名称
				projectType: 'MAIN'
			});
			if (res.resultCode === 'S') {
				comparedResInfo.value = res.data;
				projectName1.value = res.data?.childProjects[0]?.id || '';
				subProjectChangehandle('firstMapViewer', 'FourScrn-firstMapViewer');

				projectName2.value = res.data?.childProjects[1]?.id || '';
				subProjectChangehandle('secondMapViewer', 'FourScrn-secondMapViewer');

				projectName3.value = res.data?.childProjects[2]?.id || '';
				subProjectChangehandle('thirdMapViewer', 'FourScrn-thirdMapViewer');

				projectName4.value = res.data?.childProjects[3]?.id || '';
				subProjectChangehandle('fourthMapViewer', 'FourScrn-fourthMapViewer');
			}
		} catch (error) {
			console.error('城市推演结果数据统计接口失败:', error);
		}
	};

	const getStatisBySelectedSubProjects = () => {
		// 项目指标总体情况
		let indicatorInfo = zbList.value.find(n => n.value == activeZb.value);
		let vals1 =
			JSON.parse(JSON.stringify(comparedResInfo.value?.childProjects)).sort(
				(a, b) => b.totalPredictValue - a.totalPredictValue
			) || [];
		let projectIds = [
			projectName1.value,
			projectName2.value,
			projectName3.value,
			projectName4.value,
			projectName5.value,
			projectName6.value
		].filter(Boolean);
		vals1 = vals1.filter(n => projectIds.includes(n.id));
		projectRankingData.value = vals1.map(m => {
			return {
				name: m.name,
				percentage: m.totalPredictValue,
				value: m.totalPredictValue,
				unit: indicatorInfo?.unit
			};
		});
		// projectRankingDataAvg.value =
		// 	(
		// 		vals1.reduce((sum, item) => sum + item.totalPredictValue, 0) /
		// 			vals1.length || 0
		// 	).toFixed(2) + indicatorInfo?.unit;

		// // 项目指标排名
		// projectCompareTitle.value =
		// 	indicatorInfo.label + '总值对比（' + indicatorInfo?.unit + '）';
		// indicatorSortChangehandle();
		// selectedDistrictChangehandle();

		// // 项目指标分区对比
		// selectedDistricts.value = comparedResInfo.value.indicatorStatisticData?.map(
		// 	m => {
		// 		return { value: m.xzqdm, label: m.xzqmc };
		// 	}
		// );

		// // selectedDistricts.value.unshift({ value: 'all', label: '全部' });
		// // selectedDistrict.value = selectedDistricts.value[0].value;
		// selectedSubProjects.value = comparedResInfo.value?.childProjects?.map(m => {
		// 	return { value: m.id, label: m.name };
		// });
		// selectedSubProjects.value.unshift({ value: 'all', label: '所有项目' });
		// selectedSubProject.value = selectedSubProjects.value[0].value;
		districtSelectedChange();
		districtSelectedChange2();
	};

	const subProjectChangehandle = (splitScrn, mapName) => {
		let projectId = projectName1.value;
		switch (splitScrn) {
			case 'firstMapViewer':
				projectId = projectName1.value;
				break;
			case 'secondMapViewer':
				projectId = projectName2.value;
				break;
			case 'thirdMapViewer':
				projectId = projectName3.value;
				break;
			case 'fourthMapViewer':
				projectId = projectName4.value;
				break;
			case 'fiveMapViewer':
				projectId = projectName5.value;
				break;
			case 'sixMapViewer':
				projectId = projectName6.value;
				break;
		}

		let item = comparedResInfo.value?.childProjects?.find(
			n => n.id == projectId
		);
		let indiItem = zbList.value.find(n => n.value == activeZb.value);
		let datas = item.resultDatas
			.filter(m => m.regionLevel == dyCurrent.value)
			.map(m => {
				return {
					predictValue: m.predictValue,
					xzqdm: m.xzqdm,
					xzqmc: m.xzqmc,
					calculateResult: Object.assign(m, {
						module: 'ProjectComparison',
						unit: indiItem?.unit
					})
				};
			});
		if (dyCurrent.value.includes('网格') || dyCurrent.value.includes('工业用地')) {
			datas = [
				{
					size: dyCurrent.value.replace('网格', ''),
					region: dyCurrent.value,
					indicatorInfo: indiItem,
					predictYear: yearCurrent.value,
					calculateResult: {
						module: 'ProjectComparison',
						unit: indiItem?.unit || ' '
					}
				}
			];
		}
		getStatisBySelectedSubProjects();
		switch (splitScrn) {
			case 'firstMapViewer':
				groupBySevenIntervals(firstlegendList, datas);
				firstMapViewer.value.changeLyrRenderByVals(
					dyCurrent.value,
					datas,
					mapName
				);
				return;
			case 'secondMapViewer':
				groupBySevenIntervals(secondlegendList, datas);
				secondMapViewer.value.changeLyrRenderByVals(
					dyCurrent.value,
					datas,
					mapName
				);
				return;
			case 'thirdMapViewer':
				groupBySevenIntervals(thirdlegendList, datas);
				thirdMapViewer.value.changeLyrRenderByVals(
					dyCurrent.value,
					datas,
					mapName
				);
				return;
			case 'fourthMapViewer':
				groupBySevenIntervals(fourthlegendList, datas);
				fourthMapViewer.value.changeLyrRenderByVals(
					dyCurrent.value,
					datas,
					mapName
				);
				return;
			case 'fiveMapViewer':
				groupBySevenIntervals(fivelegendList, datas);
				fiveMapViewer.value.changeLyrRenderByVals(
					dyCurrent.value,
					datas,
					mapName
				);
				return;
			case 'sixMapViewer':
				groupBySevenIntervals(sixlegendList, datas);
				sixMapViewer.value.changeLyrRenderByVals(
					dyCurrent.value,
					datas,
					mapName
				);
				return;
		}
	};
	const getFactors = async () => {
		try {
			const res = await cityApi.coefficientGetFactors();
			if (res.resultCode === 'S') {
				landUseTypeList.value = res.data?.map(m => {
					return {
						...m,
						adjustValue: 0,
						indicatorId: m.FACTORID,
						name: m.FACTORNAME
					};
				});
			}
		} catch (error) {
			console.error('指标系数因子指标信息查询接口:', error);
		}
	};

	/**
	 * 将对象数组按照 predictValue 等分为7组
	 * @param {Array} data 对象数组
	 * @returns {Object} 包含分组结果和区间信息
	 */
	function groupBySevenIntervals(legList, data) {
		if (!data || data.length === 0) {
			return { groups: [], intervals: [] };
		}

		const levelClrs = [
			{
				level: '0级',
				name: '透明色',
				color: 'RGBA(255, 255, 255, 0.001)'
			},
			{
				level: '1级',
				name: '紫色',
				color: 'RGBA(92, 9, 252, 0.2)'
			},
			{
				level: '2级',
				name: '蓝色',
				color: 'RGBA(0, 144, 254, 0.2)'
			},
			{
				level: '3级',
				name: '青色',
				color: 'RGBA(69, 252, 219, 0.2)'
			},
			{
				level: '4级',
				name: '草黄色',
				color: 'RGBA(168, 255, 135, 0.2)'
			},
			{
				level: '5级',
				name: '黄色',
				color: 'RGBA(255, 203, 33, 0.2)'
			},
			{
				level: '6级',
				name: '橙色',
				color: 'RGBA(255, 161, 53, 0.2)'
			},
			{
				level: '7级',
				name: '红色',
				color: 'RGBA(254, 35, 10, 0.2)'
			}
		];

		// 提取 predictValue 值
		const values = data
			.map(item => item.predictValue)
			.filter(val => val != null);

		if (values.length === 0) {
			return { groups: [], intervals: [] };
		}

		// 计算最小最大值
		const min = Math.min(...values);
		const max = Math.max(...values);
		const range = max - min;
		const step = range / 7;

		// 生成区间边界
		const intervals = [];
		for (let i = 0; i <= 7; i++) {
			intervals.push(min + step * i);
		}

		// 输出图例
		legList.value = [Object.assign(levelClrs[0], { name: '无' })];
		for (let i = 1, len = intervals.length; i < len; i++) {
			let item = levelClrs[i];
			legList.value.push(
				Object.assign(item, {
					name: intervals[i - 1].toFixed(2) + '-' + intervals[i].toFixed(2)
				})
			);
		}
	}

	// 按变化率升序或降序
	const sortHande = () => {
		districtSelectedChange2();
		// sortDirection.value = !sortDirection.value;
		// if (mirrorData.value?.indicatorData?.length) {
		// 	let vals = mirrorData.value.indicatorData;
		// 	if (sortDirection.value) {
		// 		// 升序
		// 		vals = [...mirrorData.value.indicatorData].sort(
		// 			(a, b) => b.changeRate - a.changeRate
		// 		);
		// 	} else {
		// 		// 降序
		// 		vals = [...mirrorData.value.indicatorData].sort(
		// 			(a, b) => a.changeRate - b.changeRate
		// 		);
		// 	}
		// 	let indicatorInfo = zbList.value.find(m => m.value == activeZb.value);
		// 	trafficData.value = vals.slice(0, 5).map(n => {
		// 		return {
		// 			name: n.xzqmc,
		// 			time:
		// 				(n.predictValue * 100).toFixed(2) + `${indicatorInfo?.unit || ''}`,
		// 			trend: n.changeRate >= 0 ? 'up' : 'down',
		// 			percentage: (n.changeRate * 100).toFixed(2) + '%'
		// 		};
		// 	});
		// }
	};

	// 矢量范围显示切换
	const handleVectorToggle = (item, index) => {
		return;
		// 这里可以添加地图图层显示/隐藏的逻辑
		if (mapStore?.activeMap?.lyrManager?.getLayer(item.id)) {
			mapStore?.activeMap?.lyrManager.removeLayer(item.id);
		} else {
			item.visible = true;
			let baseLyr3 = buildLayer(LayerType.ArcGISRest, {
				name: item.id,
				url: item.url,
				layers: item.layers,
				zIndex: 100
			});
			mapStore?.activeMap?.lyrManager.addLayer(item.id, baseLyr3);
		}
	};

	const regionSelectedHandle = () => {
		dyCurrent.value;
		getDeductionResultStatistics();
	};
	onMounted(async () => {
		setJdChartOpt();
		// await getFactors();
		// await getCatalogGetById('ZBC083');
		handleScenarioChange('spatial')
		initBarChart(); // 添加柱状图初始化
		let t = setTimeout(() => {
			getDeductionResultStatistics();
		}, 1 * 200);
		requestAnimationFrame(() => {
			showMap.value = true;
		});
		setTimeout(() => {
			handleVectorToggle(vectorDataList.value[0]);
		}, 1 * 1000);
	});
	onBeforeUnmount(() => {
		if (barChart) {
			barChart.dispose();
			barChart = null;
		}
		window.removeEventListener('resize', () => barChart && barChart.resize());
	});
</script>

<style lang="scss" scoped>
	.slider-progress {
		position: absolute;
		left: 0;
		top: 15px;
		z-index: 1;
		width: 50%;
		height: 3px;
		border-radius: 2px;
		background: #16bbf2;
	}
	/* 滑块轨道样式（核心修改：调整高度） */
	.slider-track {
		-webkit-appearance: none;
		width: 100%;
		height: 3px;
		border-radius: 0.5rem;
		background: #a6d9f833;

		outline: none;
		position: relative;
		z-index: 1;
		margin: 0;
	}
	/* 滑块按钮样式（保持与轨道比例协调） */
	.slider-track::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #ffffff;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		z-index: 2;
	}
	.slider-track::-moz-range-thumb {
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #ffffff;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		border: none;
	}
	#basic-slider {
		width: 100%;
	}
	.right {
		box-sizing: border-box;
		.result {
			text-align: right;
			margin-bottom: 20px;
			img {
				width: 84%;
			}
		}

		& .legend-square {
			width: 6px;
			height: 6px;
			&.safe {
				background-color: #06a5ff;
			}

			&.warning {
				background-color: #f7b500;
			}

			&.danger {
				background-color: #ff0c10;
			}
		}
		& .legend-text {
			margin-left: 4px;
			font-family: 'AlibabaPuHuiTi-65';
			font-weight: 500;
			font-size: 10px;
			line-height: 20px;
			color: #809aab;
		}
		.yearChartItem {
			background: url('@/assets/img/decisionTheater/jygw.png') no-repeat center
				center;
			background-size: 100% 100%;
			width: 100%;
			height: 114px;
			padding: 10px 20px;
			box-sizing: border-box;
			.yearChartItemTitle {
				font-size: 14px;
				color: #fff;
				font-family: 'YouSheBiaoTiHei';
			}
			.yearChartItemContent {
				font-size: 14px;
				color: #fff;
				height: 66px;
				overflow-y: auto;
			}
		}
		.yearCompare {
			display: flex;
			align-items: center;
			margin-top: 10px;
			margin-bottom: 0px;
			img {
				width: 14px;
				height: 14px;
				margin-right: 10px;
			}
			span {
				font-size: 20px;
				color: #fff;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
			}
		}
		.populationNumber {
			background: url('@/assets/img/decisionTheater/rksl.png') no-repeat center
				center;
			background-size: 100% 100%;
			width: 100%;
			height: 260px;
		}
		.populationNumber {
			.list {
				display: flex;
				padding: 20px 10px 0 10px;
				gap: 10px;
				span {
					color: #dbfaff;
					font-size: 16px;
					&:last-child {
						margin-left: auto;
						color: #62dbed;
					}
				}
				&:last-child {
					padding-top: 6px;
				}
			}
			.populationNumberItem {
				width: 33.33%;
				text-align: center;
				p {
					font-size: 14px;
					color: #fff;
				}
				.populationNumberItemTitle {
					font-size: 16px;
					font-weight: 700;
				}
				.populationNumberItemValue {
					font-size: 16px;
					font-weight: 800;
					color: #62dbed;
				}
				.populationNumberItemRank {
					font-size: 64px;
					font-weight: 700;
					color: #dbfaff;
				}
			}
			.two {
				.populationNumberItemTitle {
					padding-top: 40px;
				}
				.populationNumberItemValue {
					padding-top: 4px;
				}
				.populationNumberItemRank {
					line-height: 1;
				}
			}
			.one {
				.populationNumberItemTitle {
					padding-top: 0px;
				}
				.populationNumberItemValue {
					padding-top: 4px;
				}
				.populationNumberItemRank {
					line-height: 1;
				}
			}
			.three {
				.populationNumberItemTitle {
					padding-top: 72px;
				}
				.populationNumberItemValue {
					padding-top: 0px;
				}
				.populationNumberItemRank {
					line-height: 1;
				}
			}
		}
		.yearChart1 {
			display: flex;
			margin-bottom: 20px;
			.yearChartItem1 {
				width: 50%;
				.yearChartItemTitle1 {
					font-size: 24px;
					color: rgba(102, 255, 255, 1);
					font-weight: 400;
					font-family: 'YouSheBiaoTiHei';
					text-align: center;
				}
			}
		}

		// 项目排名组件样式
		.projectRanking {
			.rankingHeader {
				display: flex;
				align-items: center;
				box-sizing: border-box;
				height: 1.625rem;
				width: calc(100% - 0.8125rem);
				padding-left: 1.5rem;
				background: linear-gradient(90deg, #112e46 0%, #0f3b52 100%);

				.rankingTitle {
					color: #fff;
					font-family: 'YouSheBiaoTiHei';
					font-weight: 400;
					font-size: 14px;
					letter-spacing: 0px;
				}
				.rankingIcon {
					color: #ffd700;
					font-size: 7px;
					cursor: pointer;
					margin-left: auto;
					&:hover {
						color: #ffed4e;
					}
				}
			}
			.rankingContent {
				display: flex;
				padding: 4px 10px;
				width: 100%;
				height: calc(100% - 1.625rem);
				box-sizing: border-box;
				padding: 0.5625rem 1.3125rem 0;
				.averageData {
					display: flex;
					flex-direction: column;
					width: 5.125rem;
					.circularProgress {
						position: relative;
						width: 3.75rem;
						height: 3.75rem;
						margin-bottom: 0.5625rem;
						.progressRing {
							width: 100%;
							height: 100%;
							img {
								width: 100%;
								height: 100%;
							}
						}
					}
					.averageLabel {
						color: #7e8585;
						font-family: 'AlibabaPuHuiTi-65';
						font-weight: 400;
						font-size: 12px;
						line-height: 16.46px;
						letter-spacing: 0px;
					}
					.averageValue {
						font-family: 'AlibabaPuHuiTi-95';
						font-weight: 800;
						font-size: 28px;
						line-height: 38.42px;
						letter-spacing: 0px;
						color: #dbeaea;
					}
				}

				.projectBars {
					width: 100%;
					height: 100%;
					padding-top: 0.3125rem;
					overflow: hidden;
					overflow-y: auto;
					.projectBarItem {
						display: flex;
						align-items: center;
						margin-bottom: 0.875rem;
						height: 1rem;

						.projectName {
							display: inline-block;
							width: 7.875rem;
							color: #08ffff;
							margin-right: 15px;
							font-family: 'AlibabaPuHuiTi-65';
							font-weight: 400;
							font-size: 11.2px;
							line-height: 15.37px;
							overflow: hidden;
							white-space: nowrap;
						}

						.progressBar {
							width: 8rem;
							height: 8px;
							background: #284258;
							border-radius: 4px;
							margin-right: 15px;
							overflow: hidden;

							.progressFill {
								max-width: 100%;
								height: 100%;
								background: linear-gradient(90deg, #00f6ff30, #33f9ff);
								border-radius: 4px;
								transition: width 0.5s ease-in-out;
							}
						}

						.projectPercentage {
							color: #00f6ff;
							font-size: 14px;
							font-weight: 400;
							min-width: 40px;
							text-align: right;
						}
					}
				}
			}
		}
	}
	.mi {
		padding: 0 8%;
		box-sizing: border-box;
	}
	.map-select {
		position: absolute;
		top: 16px;
		left: 54px;
		z-index: 99;
	}
	.left {
		.target-section {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 11px;
			border-radius: 4px;
		}

		.indicator-section {
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 12px 16px;

			.indicator-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;

				.indicator-label-wrapper {
					display: flex;
					align-items: center;
					gap: 8px;
					flex-shrink: 0;

					.indicator-diamond-icon {
						width: 14px;
						height: 14px;
						object-fit: contain;
						flex-shrink: 0;
					}

					.indicator-label {
						color: #fff;
						font-size: 20px;
						font-family: 'YouSheBiaoTiHei';
					}
				}

				:deep(.customSelect) {
					flex: 1;

					.el-select {
						width: 100%;
					}

					.el-select__placeholder,
					.el-select__selected-item {
						color: #fff !important;
					}

					.el-select__caret {
						color: #7edcfb !important;
					}
				}
			}
		}
		.indicator-label {
			color: #fff;
			font-size: 20px;
			font-family: 'YouSheBiaoTiHei';
			&.active {
				color: #f5e74f;
			}
		}
		.unit-year-section {
			margin-bottom: 12px;
			background: rgba(17, 46, 70, 0.8);
			padding: 12px 16px;

			.indicator-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;

				.indicator-label-wrapper {
					display: flex;
					align-items: center;
					gap: 8px;
					flex-shrink: 0;

					.indicator-diamond-icon {
						width: 14px;
						height: 14px;
						object-fit: contain;
						flex-shrink: 0;
					}
				}

				:deep(.customSelect) {
					flex: 1;

					.el-select {
						width: 100%;
					}

					.el-select__placeholder,
					.el-select__selected-item {
						color: #fff !important;
					}

					.el-select__caret {
						color: #7edcfb !important;
					}
				}
			}
		}

		.scene-info {
			& .scene-info-item {
				font-family: 'AlibabaPuHuiTi-55';
				font-weight: 400;
				font-size: 16px;
				line-height: 22px;
				word-wrap: break-word;
			}
			& .label {
				white-space: nowrap;
				font-family: 'AlibabaPuHuiTi-95';
				font-weight: 800;
				font-size: 16px;
				line-height: 22px;
			}
		}
		.vector-statistics-section {
			margin-bottom: 12px;

			.vector-table-container {
				.vector-table {
					width: 100%;
					border-collapse: collapse;
					border: 0.5px solid rgba(4, 171, 255, 0.2784);

					thead {
						tr {
							th {
								color: #7edcfb;
								text-align: left;
								padding: 8px 12px;
								border-bottom: 1px solid rgba(0, 246, 255, 0.3);
								font-family: 'AlibabaPuHuiTi-75';
								font-size: 16px;
								text-align: center;
							}
						}
					}

					tbody {
						tr {
							&:not(:last-child) {
								border-bottom: 1px solid rgba(0, 246, 255, 0.1);
							}

							td {
								color: #fff;
								padding: 10px 12px;
								font-family: 'SourceHanSansCN-Regular';
								background: rgba(1, 128, 254, 0.16);
								text-align: center;
								font-family: 'AlibabaPuHuiTi-55';
								font-weight: 400;
								font-size: 16px;
							}
						}
					}
				}

				.statistics-btn {
					padding: 4px 16px;
					background: rgba(79, 79, 79, 0.8);
					border: 1px solid rgba(200, 200, 200, 0.5);
					border-radius: 4px;
					color: #fff;
					font-size: 12px;
					cursor: pointer;
					transition: all 0.3s;
					font-family: 'SourceHanSansCN-Regular';

					&:hover {
						background: rgba(0, 246, 255, 0.2);
						border-color: #00f6ff;
						color: #00f6ff;
					}
				}
			}
		}
		.futureChoose {
			img {
				width: 84%;
			}
		}
		.importantChoose {
			margin-bottom: 10px;
		}
		.important {
			display: flex;
			align-items: center;
			margin: 4px 0;
			img {
				width: 14px;
				height: 14px;
				margin-right: 10px;
			}
			span {
				font-size: 20px;
				color: #fff;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
			}
		}
		.spaceData {
			margin-bottom: 20px;
			.hearder {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #002f5e;
				.div {
					width: 33%;
					height: 38px;
					line-height: 38px;
					border-left: 1px solid #013e65;
					text-align: center;
					color: #04abff;
				}
			}
			.body {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10px;
				background: #001429;
				.div {
					width: 33%;
					height: 38px;
					line-height: 38px;
					border-left: 1px solid #013e65;
					text-align: center;
				}
			}
		}
		.futuredanyaun {
			display: flex;
			flex-wrap: wrap;
			.futuredanyaunItem {
				width: 86px;
				height: 32px;
				line-height: 32px;
				text-align: center;
				color: #fff;
				font-size: 14px;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
				background-image: url('@/assets/img/futureMirror/bg.png');
				background-size: 100% 100%;
				margin-right: 10px;
				margin-bottom: 10px;
			}
			.futurespecialItem {
				width: 88px;
				height: 34px;
				line-height: 32px;
				text-align: center;
				color: #fff;
				font-size: 20px;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
				background-size: 100% 100%;
				margin-right: 10px;
				margin-bottom: 10px;
			}
		}
		.chooseZbList {
			background: rgba(17, 46, 70, 1);

			.chooseZbItem {
				min-width: 86px;
				height: 32px;
				line-height: 32px;
				margin-right: 10px;
				text-align: center;
				background-image: url('@/assets/img/futureMirror/zbBg.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				margin-bottom: 10px;
			}
			.chooseZbItemText {
				font-size: 14px;
				color: #fff;
				padding: 0 12px 0 16px;
				font-weight: 400;
				font-family: 'YouSheBiaoTiHei';
			}
			// 项目标签页样式
			.projectTabs {
				display: flex;
				flex-wrap: nowrap;
				overflow: hidden;
				overflow-x: auto;

				.projectTab {
					font-family: 'AlibabaPuHuiTi-65';
					font-weight: 500;
					font-size: 16px;
					width: 5rem;
					height: 36px;
					line-height: 36px;
					text-align: center;
					color: #fff;
					cursor: pointer;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					background-image: url('@/assets/img/tableHeader.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position: center center;
				}
			}

			// 参数调整列表样式
			.parameterList {
				height: 161px;
				overflow-y: auto;
				.parameterItem {
					padding: 6px 12px 0 20px;
					.parameterLabel {
						width: 100%;
						color: #a6d9f8;
						font-size: 16px;
					}
					.parameterSlider {
						:deep(.el-slider) {
							height: 12px;
							.el-slider__runway {
								background-color: #2a2a2a;
								height: 4px;
							}

							.el-slider__bar {
								background: linear-gradient(90deg, #00f6ff, #0099ff);
								height: 4px;
							}

							.el-slider__button {
								width: 12px;
								height: 12px;
								background: #fff;
								border: 0;

								&:hover {
									transform: scale(1.1);
								}
							}
						}
					}
					.parameterValue {
						font-family: 'AlibabaPuHuiTi-55';
						font-weight: 400;
						font-size: 14px;
						line-height: 20px;
						letter-spacing: 0px;
						vertical-align: middle;
						overflow: hidden;
						white-space: nowrap;
						color: #c4c4c4;
					}
				}
			}
		}

		.zb {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;

			.zbList {
				width: 48%;
				height: 32px;
				line-height: 32px;
				position: relative;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center center;
				margin-bottom: 14px;

				.zbContent {
					padding: 0 10px 0 24px;
					height: 32px;
					line-height: 32px;
					color: #fff;
					font-family: 'YouSheBiaoTiHei';
					font-size: 16px;
					font-weight: 400;
					white-space: nowrap;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
	.legendWrapper {
		bottom: 0;
		right: 0;
		z-index: 1;
		padding: 9px 0 10px 7px;
		& .legendTitle {
			color: white;
			font-family: 'AlibabaPuHuiTi-85';
			font-weight: 700;
			font-size: 10px;
			line-height: 100%;
			letter-spacing: 5%;
			padding-bottom: 8px;
		}
	}
</style>
