<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput
					v-model="username"
					type="text"
					placeholder="输入手机号码"
				></wInput>
				<wInput
					v-model="password"
					type="password"
					placeholder="账号密码"
					isShowPass
				></wInput>
			</view>
			<wButton 
				class="wbutton"
				text="登 录"
				:rotate="isRotate" 
				@click="startLogin"
			></wButton>
			
			<!-- 底部信息 -->
			<view class="footer">
				<text @click="navoToForget()">找回密码</text>
				<text>|</text>
				<text @click="navToRegister()">注册账号</text>
			</view>
		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
    import { user_login } from '../../api/index.js'
	export default {
		data() {
			return {
				//logo图片 base64
				username: '',
				password:'', //密码
				isRotate: false, //是否加载旋转
			};
		},
		components:{
			wInput,
			wButton,
		},
		methods: {
			// 跳转到忘记密码
			navoToForget() {
				this.$Router.push('/pages/login/forget');
			},
			// 跳转到注册页面
			navToRegister () {
				this.$Router.push('/pages/login/register');
			},
			navoToNewUserRegister () {
				this.$Router.push('/pages/login/NewUserRegister');
			},
			// 登录
		    async startLogin(){
				if (!this.username) {
					uni.showToast({
						icon: 'none',
						title: '请输入用户名'
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						icon: 'none',
						title: '请输入密码'
					})
					return
				}
				const params = {username: this.username, password: this.password}
				const res = await user_login(params)
				if (res.data.code == 200) {
          const token = res.data.object.token ? res.data.object.token: ''
				try{
					uni.setStorageSync('token', token)
					this.$store.dispatch('getUserinfo')	
					this.$Router.pushTab('/pages/tabbar/index')
				}catch(e){
					uni.showToast({
						icon: 'none',
						title: '存取本地数据失败'
					})
				}
				} else {
					this.$u.toast(res.data.message)
				}
				
			}
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>
