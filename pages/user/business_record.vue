<template>
	<view class="list">
		<view class="money">
			<view class="integralSize">
				<u-icon name="rmb-circle" color="#ffffff" size="50" style="margin-left: 25px;margin-top: 5px;"></u-icon>
				<view style="margin-top: 5px;">
					核销总额：{{ this.Integral }}
				</view>
			</view>
		</view>
		<view class="empty" v-if="list.length == 0"><u-empty text="暂无核销记录"></u-empty></view>
		<view class="listItem flex" v-for="(item, index) in list" :key="index">
			<view class="content_left">
				<view class="">
					姓名：{{ item.userInfo.name }}
				</view>
				<view>用途：{{ item.integralOption.descb }}</view>
				<view class="count_time">时间：{{ item.integralOption.createTime }}</view>
			</view>
			<view class="content_right">+{{ item.integralOption.num }}</view>
		</view>
	</view>
</template>

<script>
import { get_business_record,get_integral } from '@/api/index.js';

import { mapState } from 'vuex'
export default {
	data() {
		return {
			list: [],
			Integral: ''
		};
	},
	computed: {
	  ...mapState(['user_info'])
	},
	onShow() {
		this.getCodeRecord()
		this.getIntegral()
	},
	onPullDownRefresh() {
		this.getCodeRecord()
		this.getIntegral()
			setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
	},
	methods: {
		// 获取积分记录
		async getCodeRecord() {
			const res = await get_business_record(this.user_info.tel);
			console.log(res)
			if (res.data.code == 200) {
				this.list = res.data.object ? res.data.object : [],
				this.total = res.data.object.length
			} else {
				this.$u.toast(res.data.message)
			}
		},
		// 获取核销总额
		async getIntegral () {
			const res = await get_integral(this.user_info.tel)
			if (res.data.code == 200) {
				this.Integral = res.data.object
			} else {
				this.$u.toast(res.data.message)
			}
			},
		}
	}
</script>

<style lang="scss" scoped>
.integralSize {
	margin: 5px;
	padding: 5px;
	padding-left: 10px;
	color: white;
	font-weight: 600;
	font-size: 16px;
}
.money {
	width: 95%;
	height: 100px;
	background-color: #29ad67;
	border-radius: 10px;
	margin: 10px auto;
}
.list {
	font-size: 30rpx;
	background-color: #ffffff;
	.listItem {
		width: 100%;
		padding: 18rpx;
		border-bottom: 1rpx solid #e5e5e5;
		justify-content: space-between;
		&:last-child {
			border-bottom: none;
		}
		.content_left {
			line-height: 46rpx;
		}
		.content_right {
			font-size: 42rpx;
			color: red;
		}
	}
}
</style>
