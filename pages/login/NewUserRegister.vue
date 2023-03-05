<template>
	<view>
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
			</view>
			<!-- 主体 -->
			<view style="margin: 10px;">
			 <view class="margin border-bottom">
				<u--input
			 	   placeholder="请输入姓名:"
			 	   v-model="name"
			 	 ></u--input>
			  </view>
				<view class="margin border-bottom">
					<u--input
					   placeholder="请输入手机号:"
						 type="number"
					   v-model="tel"
					 ></u--input>
				</view>
				<view class="margin flex" style="padding: 5px;">
					<view>性别：</view>
						<radio-group name="radio" @change="sexChange">
							<label>
								<radio value="男" /><text>男</text>
							</label>
							<label style="margin-left: 10px;">
								<radio value="女" /><text>女</text>
							</label>
						</radio-group>
				</view>
				<view class="margin border-bottom">
						<u--input
					   placeholder="请输入民族(汉):"
					   v-model="nation"
					 ></u--input>
				</view>
				<view class="margin border-bottom">
						<u--input
					   placeholder="请输入身份证号:"
						 type="number"
					   v-model="personId"
					 ></u--input>
				</view>
				
				
				<view class="margin">
					<text>选择地址：</text>
						<view style="margin-top: 5px;" class="flex">
							<view>
								<u-picker :show="show1" :columns="columns1" @confirm="confirm1" @cancel="cancel"></u-picker>
								<u-button @click="show1 = true" style="width: 85px;">{{this.countyName ? this.countyName : '请选择县'}}</u-button>
							</view>
							<view>
								<u-picker :show="show2" :columns="columns2" @confirm="confirm2" @cancel="cancel"></u-picker>
								<u-button @click="show2 = true" style="width: 85px;">{{this.townshipName ? this.townshipName : '请选择乡'}}</u-button>
							</view>
							<view>
								<u-picker :show="show3" :columns="columns3" @confirm="confirm3" @cancel="cancel"></u-picker>
								<u-button @click="show3 = true" style="width: 85px;">{{this.villageName ? this.villageName : '请选择村'}}</u-button>
							</view>
							<view class="border-bottom">
								<u--input
								  placeholder="请输入组:"
								  v-model="groupName"
								></u--input>
							</view>
						</view>
				</view>
				
			</view>
			<!-- 错误提示 -->
			<view v-if="this.showAlert">
				<u-alert :title="title"  type = "warning" :closable="closable"></u-alert>
			</view>
			
			<wButton 
				class="wbutton"
				text="注 册"
				@click.native="startReg()"
				style="margin-top: 20px;"
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
	import { post_addNewUser,get_groupDec } from '../../api/index.js'
	export default {
		data() {
			return {			
				showAlert: false,
				title:'',
				closable:true,
							
				show1: false,
				show2: false,
				show3: false,
				show4: false,
				columns1: [['会昌县']],
				columns2: [],
				columns3: [],
								
				name:'',
				tel:'',
				sex:'',
				nation:'',
				personId:'',
				
				countyName:'', // 县
				townshipName:'', // 乡
				villageName:'', // 村
				groupName:'',	// 组
				
				click: false,
			}
		},
		components:{
			wInput,
			wButton,
		},
		methods: {
			async startReg() {
				if (this.click == true) {
					console.log('已点击！')
					return
				}
				this.click = true
				const params = {
						"countyName":this.countyName,	// 县
						"townshipName": this.townshipName,	//乡
						"villageName": this.villageName,	// 村
						"groupName": this.groupName,	// 组
					
						"name": this.name,
						"nation": this.nation,
						"personId": this.personId,
						"sex": this.sex,
						"tel": this.tel,
						
					}
				if ( this.tel.length != 11 ) {
					uni.showToast({
						icon: 'none',
						title: '手机号码格式错误！'
					})
					return
				}
				if (this.countyName == '' || this.townshipName == '' || this.villageName == '' || this.name == '' || this.nation == '' || this.personId == '' || this.sex == '' || this.tel == ''){
					uni.showToast({
						icon: 'error',
						title: '请填写相关信息'
					})
					return
				}
				const res = await post_addNewUser(params)
				 if (res.data.code = 200) {
					uni.showToast({
						icon:'none',
						title:'添加信息成功，请联系管理员审核'
					})
					this.$Router.push('/pages/login/login');
					return
					} else if (res.data.code = 500) {
						this.showAlert = true
						this.title = res.data.message
					} else {
						
					}
		    },
				async confirm1(e) {
						this.countyName = e.value.join(',')
				    this.show1 = false
						const res = await get_groupDec(e.value.join(','))
						this.columns2 = [this.Arr(res.data.object)]
										
				},
				async confirm2(e) {
						this.townshipName = e.value.join(',')
				    this.show2 = false
						const res = await get_groupDec(e.value.join(','))
						this.columns3 = [this.Arr(res.data.object)]
				},
				async confirm3(e) {
						this.villageName = e.value.join(',')
				    this.show3 = false
				},
				cancel() {
					this.show1 = false
					this.show2 = false
					this.show3 = false
				},
				Arr (object) {
					var newArr = ''
					object.forEach(function(e){
						newArr += e.name + ','
					})
					newArr = newArr.substring(0,newArr.length - 1)
					newArr = newArr.split(',')
					return newArr
				},
				sexChange (e) {
					this.sex = e.detail.value
				}
			
		}
	}
</script>

<style>
	.border {
		border-radius: 8rpx;
		height: 36px;
		background-color: white;
		border: 1px solid #dadbde;
	}
	.border-bottom {
		border-bottom: 1px solid #dadbde;
	}
	.margin {
		margin: 10px;
	}
	.font {
		font-size: 16px;
		font-family: 'Microsoft YaHei', arial, tahoma, \5b8b\4f53, sans-serif;
		font-weight: 500;
	}
</style>