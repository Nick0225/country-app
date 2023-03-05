<template>
	<view class="register">
	
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="手机号码"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="11"
					placeholder="登录密码"
					isShowPass
				></wInput>
				<wInput
					v-model="verCode"
					type="number"
					maxlength="6"
					placeholder="验证码"
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>	
			</view>
			<!-- 错误提示 -->
			<view v-if="this.showAlert">
				<u-alert :title="title"  type = "warning" :closable="closable"></u-alert>
			</view>
			<wButton 
				class="wbutton"
				text="注 册"
				@click.native="startReg()"
			></wButton>
			
			<!-- 底部信息 -->
			<view class="footer">
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import { get_phone_code, user_register} from '../../api/index.js'
	export default {
		data() {
			return {
				//logo图片 base64
				phoneData:'', // 用户/电话
				passData:'', //密码
				verCode:"", //验证码
				
				showAlert: false,
				title:'',
				closable:true,
				
				click: false,
			}
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this = this;
		},
		methods: {
			// 获取验证码
			async getVerCode(){
				// 获取验证码
				if (_this.phoneData.length != 11) {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不正确'
				    });
				    return false;
				}
				const params = this.phoneData
				const res = await get_phone_code(params)
				console.log(res)
				if (res.statusCode = 200) {
					uni.showToast({
					    icon: 'success',
					    title: '验证码发送成功'
					});
					} else {
						uni.showToast({
						    icon: 'error',
								position: 'bottom',  
						    title: '获取验证码失败'
						});
					}
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
				_this.$refs.runCode.$emit('runCode',90); //假装模拟下需要 终止倒计时
			},
			// 注册
			async startReg() {
				// 注册
				if (this.click == true) {
					console.log('已点击！')
					return
				}
				this.click = true
				const params = {
					"username": this.phoneData,
					"password": this.passData,
					"msg": this.verCode
				}
				if (this.phoneData.length != 11 || this.passData.length < 6 || this.verCode == '') {
					uni.showToast({
						icon:'error',
						title:'内容格式不正确！'
					})
					return
				}
				const res = await user_register(params)
				if (res.data.code == 200) {
					uni.showToast({
					    icon: 'success',
					    title: '注册成功'
					});
					this.$Router.push('/pages/login/login');
				} else if (res.data.message == "注册失败,不属于信息库中数据,请联系管理员添加" || res.data.message == '请填写具体信息'){
					this.$Router.push('/pages/login/NewUserRegister');
				} else {
					this.$u.toast(res.data.message)
				}
			},
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>