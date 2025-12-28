<template>
	<div class="login w-full h-full select-none">
		<video id="background-video" playsinline autoplay muted loop>
			<source src="@/assets/img/login.mp4" type="video/mp4" />
		</video>
		<div class="con-box flex items-center flex-col justify-center">
			<div class="names w-full">
				<p class="name-cn w-full">广州市国土空间规划监测评估与推演预警平台</p>
				<p class="name-en w-full">
					Guangzhou Municipality Territorial Spatial Planning Evaluation and
					Monitoring Platform
				</p>
			</div>
			<div class="loginStep-1 mt-35" v-if="step === 1">
				<el-button
					class="login-sub w-[380px] mt-4"
					type="primary"
					color="#626aef"
					size="large"
					round
					@click="setStep">
					<span>登 录 | Sign Up</span>
				</el-button>
				<p class="flex items-center justify-center mt-4">
					<el-checkbox v-model="form.checked" label="" size="large" />
					<span></span>
					<span
						style="
							font-family: 'SourceHanSerifCN-Medium';
							font-weight: 300;
							font-style: Normal;
							font-size: 16px;
							line-height: 31.2px;
							letter-spacing: 0px;
						"
						>下次自动登录 | Auto Log-In</span
					>
				</p>
			</div>
			<div class="loginForm_box mt-12" v-if="step === 2">
				<div class="loginForm flex items-center flex-col">
					<el-form
						ref="formRef"
						style="width: 100%"
						size="large"
						:model="form"
						label-width="auto"
						class="demo-ruleForm">
						<el-form-item
							label="账号 | NAME"
							prop="username"
							:rules="[
								{ required: true, message: '请输入账号', trigger: 'blur' }
							]">
							<el-input
								class="!w-[300px]"
								v-model.number="form.username"
								clearable
								placeholder="请输入账号"
								type="text"
								autocomplete="off" />
						</el-form-item>
						<el-form-item
							label="密码 | KEY"
							prop="password"
							:rules="[
								{
									required: true,
									message: '请输入密码8~16位',
									trigger: 'blur',
									min: 8,
									max: 16
								}
							]">
							<el-input
								class="!w-[300px]"
								v-model.number="form.password"
								clearable
								placeholder="请输入密码8~16位"
								type="password"
								autocomplete="off" />
						</el-form-item>
						<el-form-item
							label="验证码 | CODE"
							prop="yzm"
							class="yzm-wrap flex"
							:rules="[
								{ required: true, message: '请输入验证码', trigger: 'blur' }
							]">
							<el-input
								class="!w-[178px]"
								v-model="form.yzm"
								placeholder="请输入验证码"
								@keyup.enter.native="onSubmit(formRef)"
								style="width: 224px" />
							<div
								class="yzm-box flex items-center justify-center !w-[100px]"
								@click="getCode">
								<img v-if="imgCode" :src="imgCode" alt="img" />
							</div>
						</el-form-item>
					</el-form>
					<el-button
						class="login-sub w-[403px] mt-4"
						type="primary"
						color="#626aef"
						size="large"
						round
						@click="onSubmit(formRef)">
						<span>登 录 | Sign Up</span>
					</el-button>
					<p class="flex items-center justify-center select-none mt-4">
						<el-checkbox v-model="form.checked" label="" size="large" />
						<span></span>
						<span
							style="
								font-family: 'SourceHanSerifCN-Medium';
								font-weight: 300;
								font-style: Normal;
								font-size: 16px;
								line-height: 31.2px;
								letter-spacing: 0px;
							"
							>下次自动登录 | Auto Log-In</span
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { JSEncrypt } from 'jsencrypt';
	import { userApi } from '@/api/index.js';

	import { useAppStore } from '@/stores/modules/app.js';
	const store = useAppStore();
	const router = useRouter();
	const api = userApi();

	const step = ref(1);
	const formRef = ref(null);
	const imgCode = ref('');
	const form = reactive({
		username: '',
		password: '',
		requestCode: '',
		yzm: '',
		checked: true
	});

	onMounted(() => {
		// localStorage.clear();
		getCode();
		// 开发环境
		if (import.meta.env.MODE === 'development') {
			form.username = 'sysadmin';
			form.password = 'abcd_1234';
			form.yzm = '';
		}
	});

	const setStep = () => {
		step.value = 2;
		console.log('step:', step.value);
	};

	// 获取验证码
	const getCode = async () => {
		const requestCode = Date.now();
		form.requestCode = requestCode;
		api
			.checkCode({ requestCode })
			.then(async res => {
				const imgBlob = new Blob([res], { type: 'image/jpeg' });
				await getImageBase64(imgBlob).then(res2 => {
					imgCode.value = res2;
				});
			})
			.catch(err => {
				console.log('获取验证码失败:', err);
			});
	};

	const getImageBase64 = blob => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onload = () => {
				const base64 = reader.result;
				resolve(base64);
			};
			reader.onerror = error => reject(error);
		});
	};

	// 登录
	const onSubmit = async formEl => {
		if (!formEl) return;
		await formEl.validate((valid, fields) => {
			if (valid) {
				const encryptor = new JSEncrypt();
				encryptor.setPublicKey(
					'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEC0vA9smJGtwB8mY5meFEnmkqfqkhBn1PKHV2FcA8GCnajkV/R7Lj6lnrVwgiyKiFT/JBVUagAy9shYB04fUTA+oHlgOj96KXf/ztkw4A9xgTb+4FWo0M2+znYEN8J/5/cJqMPtlB6fjJaNJ1XnLIYCJPwru03LVN4Z7Ijlpv4wIDAQAB'
				);
				const loginForm = { ...form };
				const loading = ElLoading.service({
					lock: true,
					text: 'Loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				loginForm.password = encryptor.encrypt(form.password);
				api
					.login(loginForm)
					.then(res => {
						store.setUserInfo(res.data.userInfo);
						store.setToken(res.data.token);
						loading.close();
						router.push('/');
					})
					.catch(err => {
						getCode();
						loading.close();
						form.yzm = '';
					});
			}
		});
	};
</script>

<style lang="scss" scoped>
	.login {
		position: relative;
		z-index: 1;
		& #background-video {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			width: 100%;
			height: 100%;
			object-fit: fill;
		}
		& .loginStep-1 {
			height: 400px;
		}
		& .loginForm_box {
			width: 508px;
			height: 400px;
			padding: 36px 0 0 26px;
			border-radius: 30px;
			border: 3px solid #ffffff;
			overflow: hidden;
			background-color: rgba(36, 32, 32, 0.5);
			box-shadow: 0px 4px 4px 0px #00000040;
		}
		.yzm-box {
			width: 100px;
			height: 40px;
			border: 2px solid #dcdfe6;
			background-color: #f6f6f6;
			border-radius: 4px;
			margin-left: 22px;
			cursor: pointer;
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
	.con-box {
		position: absolute;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 99;
		text-align: center;
		.name-cn {
			font-family: 'SourceHanSerifCN-Bold';
			font-weight: 700;
			font-size: 64px;
			color: white;
			white-space: nowrap;
		}
		.name-en {
			font-family: 'SourceHanSerifCN-Bold';
			font-weight: 700;
			font-size: 24px;
			color: white;
			white-space: nowrap;
		}
	}

	:deep() {
		.el-form-item.is-error .el-form-item__content .el-input__wrapper {
			box-shadow: none;
		}
		.el-form-item__error {
			font-size: 16px;
		}
		.el-input__inner:-webkit-autofill {
			-webkit-background-clip: text;
			background-color: #ffffff !important;
			-webkit-text-fill-color: #ffffff !important;
			transition: background-color 5000s ease-in-out 0s !important;
		}
		.el-input__wrapper {
			border: 2px solid #ffffff;
			border-radius: 10px;
			box-shadow: 0px 4px 4px 0px #00000040;
			background: rgba(255, 255, 255, 0.4);
			color: #ffffff;
		}
		.el-input__inner {
			color: white !important;
		}
		.el-input {
			font-family: 'SourceHanSerifCN-Medium';
			height: 40px;
			font-weight: 300;
			font-size: 16px;
			color: #ffffff !important;
		}
		.el-input__inner::placeholder {
			font-family: 'SourceHanSerifCN-ExtraLight';
			font-weight: 300;
			font-style: Normal;
			font-size: 16px;
			line-height: 31.2px;
			letter-spacing: 0px;
			color: #ffffff;
		}

		.el-form-item--large {
			margin-bottom: 32px;
		}
		.el-form-item__label {
			padding-right: 20px !important;
		}
		.el-form-item__label-wrap .el-form-item__label {
			font-family: 'SourceHanSerifCN-Medium';
			font-weight: 500;
			font-size: 20px;
			line-height: 31.2px;
			letter-spacing: 0px;
			color: #ffffff;
			&:before {
				content: '';
				display: none;
			}
		}
		.login-sub {
			background: rgba(255, 255, 255, 0.4);
			border: 2px solid #ffffff;
			border-radius: 50px;
			box-shadow: 0px 4px 4px 0px #00000040;
			font-family: 'SourceHanSerifCN-Medium';
			font-weight: 500;
			font-size: 20px;
			height: 50px;
			line-height: 31.2px;
			letter-spacing: 0px;
			color: #ffffff;
		}
	}
</style>
