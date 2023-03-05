<template>
	<view class="forget">
		
		<view class="content">
			<!-- 主体 -->
			<view class="main">
				<view class="tips">若你忘记了密码，可在此重置密码。</view>
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="请输入手机号码"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					maxlength="11"
					placeholder="请输入新密码"
					isShowPass
				></wInput>
				<wInput
					v-model="verCode"
					type="number"
					maxlength="6"
					placeholder="验证码"
					isShowCode
					:codeText="codeText"
					setTime="30"
					ref="runCode"
					@setCode="getVerCode()"
					:disabled="true"
				></wInput>
			</view>
			
			<wButton 
				class="wbutton"
				text="重置密码"
				@click.native="startRePass()"
			></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' 
	import wButton from '../../components/watch-login/watch-button.vue' 
	import { reset_password } from '../../api/index.js'
	import {  get_phone_code } from '../../api/index.js'
	export default {
		data() {
			return {
				phoneData: "", //电话
				passData: "", //密码
				verCode:"", //验证码
				codeText:'获取验证码'
			}
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
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
				const res = await get_phone_code(this.phoneData)
				if (res.statusCode != 200) {
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: '获取验证码失败'
					});
					return
				} else {
					uni.showToast({
					    icon: 'none',
					    title: '验证码发送成功'
					});
					this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
					_this.$refs.runCode.$emit('runCode',90); //假装模拟下需要 终止倒计时
					return
				}
				
			},
			async startRePass() {
				// 重置密码
				if (this.phoneData.length != 11) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不正确'
				    });
				    return false;
				};
				if (this.passData.length < 6) {
				      uni.showToast({
				          icon: 'none',
						position: 'bottom',
				          title: '密码不正确'
				      });
				      return false;
				  };
			  
				const params = {
					tel: this.phoneData,
					info:{
						password:this.passData,
						msg:this.verCode
					}
				}
				const res = await reset_password(params)
				console.log(res)
				 if (res.data.code != 200) {
					 uni.showToast({
					     icon: 'none',
					     title: '重置密码失败'
					 });
					 return 
				} else {
					uni.showToast({
					    icon: 'none',
					    title: '重置密码成功'
					});
					this.$Router.push('/pages/login/login');
					return
				}
			}
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>

