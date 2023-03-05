<template>
	<view class="list">
		<view class="money flex flexSp">
			<view class="integralSize" @click="navtoCode">
				<u-icon name="coupon" color="#ffffff" size="50" style="margin-left: 5px;"></u-icon>
				<view style="margin-top: 5px;">
					积分兑换
				</view>
			</view>
			<view class="integralSize">
				<u-icon name="rmb-circle" color="#ffffff" size="50" style="margin-left: 25px;"></u-icon>
				<view style="margin-top: 5px;">
					积分余额：{{user_info.integralSize}}
				</view>
			</view>
		</view>
		<view class="empty" v-if="list.length == 0"><u-empty text="暂无积分记录"></u-empty></view>
		<view class="listItem" v-for="(item, index) in list" :key="index">
			<view class="content flex">
				<view class="count_name">{{ item.descb }}</view>
				<view class="count_time">{{ item.name }}</view>
			</view>
			<view class="content flex">
				<view class="count_name">{{ item.createTime }}</view>
				<view class="count">{{item.options == 1 ? '+' : '-'}}{{ item.num }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { get_code_record } from '@/api/index.js';
import { mapState } from 'vuex'
export default {
	data() {
		return {
			list: [],
			params: {
				currentPage: 1,
				pageSize: 10
			}
		};
	},
	computed: {
		...mapState(['user_info'])
	},
	onReachBottom() {
		if (this.params.currentPage * this.params.pageSize < this.total) {
			this.getMore();
			return;
		}
		this.$u.toast('没有更多数据了');
	},
	mounted () {
		this.getCodeRecord();
	},
	onPullDownRefresh () {
		this.getCodeRecord();
		setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
	},
	methods: {
		// 获取积分记录
		async getCodeRecord() {
			const info = {
				params:this.params,
				tel: this.user_info.tel
			}
			const res = await get_code_record(info);
			if (res.data.code == 200) {
				this.list = res.data.object.records ? res.data.object.records : [],
				this.total = res.data.object.total
				console.log(this.list)
			} else {
				this.$u.toast(res.data.message)
			}
		},
		// 跳转到积分兑换
		navtoCode() {
			this.$Router.push('/pages/user/exchange_code');
		},
		// 加载下一页
		getMore() {
			this.params.currentPage++;
			this.$nextTick(async () => {
				const info = {
					params:this.params,
					tel: this.user_info.tel
				}
				const res = await get_code_record(info);
				if (res.data.code == 200) {
					this.list = [...this.list, ...res.data.object.records] || [];
				} else {
					this.$u.toast(res.data.message)
			}
			});
		}
	}
};
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
		background-color: #ffffff;
		border-bottom: 1rpx solid #e5e5e5;
		&:last-child {
			border-bottom: none;
		}
		.content {
			justify-content: space-between;
			line-height: 46rpx;
			.count {
				color: red;
				font-size: 38rpx;
			}
		}
	}
}
</style>
