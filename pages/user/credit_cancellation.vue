<template>
	<view>
		<!-- 展示核销记录 -->
			<view class="record flex" @click="navtoBusinessRecord">
				<view class="name">
					核销记录
				</view>
				<iconfont type="gengduo"></iconfont>
			</view>
		<!-- 表单 -->
		<view class="form">	
		   <view class="formItem flex flexHc">
		   	  <view class="label">
		   	  	用户核销码
		   	  </view>
			  <view class="scan flex flexCen" @click="scanCode">
			  	   扫描用户核销码
			  </view>
		   </view>
		  <view class="box" v-if="isScan">
			<view class="formItem flex flexHc">
				  <view class="label">
				  	用户姓名
				  </view>
				  <view class="content flex ">
					  {{consumer_info.name ? consumer_info.name : ''}}
				  </view>
			</view>
			<view class="formItem flex flexHc">
				  <view class="label">
				  	手机号
				  </view>
				  <view class="content flex ">
					  {{ consumer_info.tel ? consumer_info.tel : ''}}
				  </view>
			</view>
			<view class="formItem flex flexHc">
				  <view class="label">
				  	地址
				  </view>
				  <view class="content flex ">
					  {{consumer_info.address ? consumer_info.address : ''}}
				  </view>
			</view>
			<view class="formItem flex flexHc">
				  <view class="label">
				  	可用积分
				  </view>
				  <view class="content flex ">
					  {{consumer_info.integralSize ? consumer_info.integralSize : ''}}
				  </view>
			</view>
			<view class="formItem flex flexHc">
				  <view class="label">
				  	核销商家
				  </view>
				  <view class="content flex">
					  {{user_info.name ? user_info.name : ''}}
				  </view>
			</view>
			<view class="formItem flex flexHc">
				  <view class="label">
				  	核销内容
				  </view>
				  <view class="content flex">
					 <input type="text" v-model="desc" placeholder="输入核销内容"/>
				  </view>
			</view>
			<view class="formItem flex flexHc">
				  <view class="label">
				  	核销积分
				  </view>
				  <view class="content flex">
					 <input type="number" v-model="num" placeholder="输入核销积分"/>
				  </view>
			</view>
		  	<!-- 提交 -->
		  	<view class="btn">
		  		<view class="btnItem" @click="startCancell()">
		  			确认核销
		  		</view>
		  	</view>
		  </view>
		</view>
		<!-- 模拟框 -->
		<u-modal :show="ModelShow" showCancelButton @cancel="ModelShow = false" @confirm="confirmCancell" :title="title" :content='content'></u-modal>
	</view>
</template>

<script>
    import iconfont from '@/components/iconfont/iconfont.vue';
	import { get_one_user, user_cancelltion } from '@/api/index.js'
	import { mapState } from 'vuex'
	export default {
		components: {
		  iconfont
		},
		data() {
			return {
			  isScan: false,
			  ModelShow: false,
			  title: '核销操作',
			  content: '',
			  desc: '', // 描述
			  num: '', // 核销积分
			  consumer_info: {} // 消费者
			  
			}
		},
	    computed: {
		   ...mapState(['user_info'])
		},
		methods: {
			// 扫描商品码
			scanCode () {
				let that = this
				// 调起条码扫描
				uni.scanCode({
				    scanType: ['barCode', 'qrCode'],
				    success:  async function (res) {
				        const tel =  res.result
								uni.showLoading({
									title: '获取数据中'
						})
				    const result = await get_one_user(tel)
						 if (result.data.code == 200 ) {
							 that.consumer_info = result.data.object || {}
							  that.isScan = true
						 } else {
							  this.$u.toast(res.data.message)
						 }
						 uni.hideLoading()
						 
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: '扫码失败'
						})
					}
				});
				
			},
		   // 开始核销
		   startCancell () {
			  const { name } = this.consumer_info
			  this.ModelShow =true
			  this.content = `你将对${name}用户核销${this.num}积分` 
		   },
		   // 确认核销
		   async confirmCancell () {
			   if (!this.desc) {
				   uni.showToast({
				   	icon: 'none',
					title: '核销内容不能为空'
				   })
				   return 
			   }
			   if (!this.num) {
				   uni.showToast({
					icon: 'none',
					title: '核销积分不能为空'
				   })
				   return 
			   }
			   const params = {
				   userId: this.consumer_info.id,
				   integralOptionVo: {
					   descb: this.desc,
					   name: this.user_info.shopName,
					   num: this.num,
					   options: 0
				   }
				   
			   }
			  const res = await user_cancelltion(params)
			  if (res.data.code == 200) {
						this.$u.toast('核销成功')
						this.consumer_info = {}
						this.isScan = false
						this.ModelShow = false
			  } else {
					this.$u.toast(res.data.message)
					this.ModelShow = false
					return
				}
		   },
		   // 跳转到核销记录
		   navtoBusinessRecord () {
			    this.$Router.push('/pages/user/business_record')
		   }
		}
	}
</script>

<style lang="scss">
page {
	background-color: #f8f8f8;
}
.record {
	padding: 24rpx 18rpx;
	background-color: #FFFFFF;
	justify-content: space-between;
}
.form {
	margin-top: 18rpx;
	.formItem {
		background-color: #FFFFFF;
		justify-content: space-between;
		padding: 24rpx 28rpx;
		border-bottom: 1rpx solid #efefef;
		.label {
			width: 220rpx;
			align-content: center;
			align-items: center;
		}
		
		.scan {
			font-size: 22rpx;
			background-color: #1890ff;
			color: #FFFFFF;
			padding: 12rpx;
			border-radius: 12rpx;
		}
		
		.content {
			flex: 1;
			text-align: left;
			color: #999;
			.u-input {
				height: 100%;
				margin: 0;
			}
		}
	}
	.btn {
		width: 320rpx;
		height: 72rpx;
		background-color: #1890ff;
		color: #FFFFFF;
		line-height: 72rpx;
		text-align: center;
		border-radius: 18rpx;
		margin: 0 auto;
		margin-top: 36rpx;
	}
}

</style>
