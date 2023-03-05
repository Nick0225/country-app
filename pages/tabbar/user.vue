<template>
	<view class="wrap">
		<view class="status-bar"></view>
		<view class="content">
			<view class="user">
				<view class="base-info">
					<view class="user-info">
						<view class="avatar default-avatar">
							<view v-if="user_info.image ? true : false" ><image :src="user_info.image"></image></view>
							<image v-else src="../../static/images/logo.png" ></image>
						</view>
						<view v-if="user_info.name" class="info" >
							<view class="nickname">{{ user_info.name }}</view>
								<view class="mobile" v-if="user_info.tel">账号：{{ user_info.tel }}</view>
								<view class="mobile" v-if="user_info.integralSize">积分：{{user_info.integralSize}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="nav">
				<view class="list">
					<view class="item" @click="navToDetails('/pages/user/exchange_record')">
						<view class="info">
							<view class="name">
								<iconfont type="mingxi" :size="42"></iconfont>
								<text>积分明细</text>
							</view>
							<iconfont type="gengduo"></iconfont>
						</view>
					</view>
					<view class="item" @click="navToDetails('/pages/user/exchange_code')">
						<view class="info">
							<view class="name">
								<iconfont type="duihuanlipin" :size="42"></iconfont>
								<text>兑换礼品</text>
							</view>
							<iconfont type="gengduo"></iconfont>
						</view>
					</view>
					<view class="item">
						<view class="info" @click="navToInfo">
							<view class="name">
								<iconfont type="wode" :size="42"></iconfont>
								<text>我的资料</text>
							</view>
							<iconfont type="gengduo"></iconfont>
						</view>
					</view>
				</view>
				<view class="list">
					<view class="item">
						<view class="info" @click="contact()">
							<view class="name">
								<iconfont type="kehufuwukefu" :size="42"></iconfont>
								<text>联系客服</text>
							</view>
							<iconfont type="gengduo"></iconfont>
						</view>
					</view>
					<view class="item">
						<view class="info" @click="aboutApp()">
							<view class="name">
								<iconfont type="banbengengxin1" :size="48"></iconfont>
								<text>关于App</text>
							</view>
							<iconfont type="gengduo"></iconfont>
						</view>
					</view>
					<view class="item">
						<view class="info" @click="loginOut()">
							<view class="name">
								<iconfont type="yiping" :size="40"></iconfont>
								<text>退出登录</text>
							</view>
							<iconfont type="gengduo"></iconfont>
						</view>
					</view>
				</view>
			</view>
			<view class="tab-bar"></view>
		</view>
	</view>
</template>

<script>
import iconfont from '@/components/iconfont/iconfont.vue';

import { mapState } from 'vuex'
export default {
	components: {
		iconfont
	},
	data() {
		return {
		};
	},
	computed: {
		...mapState(['user_info'])
	},
	methods: {
		// 跳转到兑换礼品
		navToDetails(path) {
			this.$Router.push(path);
		},
		// 跳转到用户详情
		navToInfo() {
			this.$Router.push({ path: '/pages/user/info_details', query: { isMine: 1 } });
		},
		// 退出登录
		loginOut() {
			uni.clearStorageSync()
			this.$Router.replaceAll('/pages/login/login');
		},
		// 联系客服
		contact() {
			 this.$Router.push('/pages/service/service')
		},
		// 版本更新
		aboutApp() {
		   this.$Router.push('/pages/appUpdate/appUpdate')
		}
	}
};
</script>

<style lang="scss" scoped>
.top {
	/*页面标题*/
	.page-title {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90rpx;
		text-align: center;
		z-index: 9999;
		font-size: 38rpx;
		font-weight: bold;
	}
}
.user {
	.base-info {
		background: #ffffff;
	}
	.user-info {
		padding: 32rpx;
		display: flex;
		align-item: center;
		justify-content: space-between;
		.avatar {
			flex-grow: 0;
			flex-shrink: 0;
			line-height: 0;
			border-radius: 50%;
			image {
				width: 144rpx;
				height: 144rpx;
				border-radius: 14rpx;
				border: 1rpx solid #fff;
			}
		}
		.default-avatar {
			margin-top: -12rpx;
		}
		.info {
			flex-grow: 1;
			flex-shrink: 1;
			padding-left: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.nickname {
				font-size: 44rpx;
				margin-top: -14rpx;
				margin-bottom: 5rpx;
			}
			.mobile {
				font-size: 34rpx;
				display: flex;
				line-height: 56rpx;
				align-items: center;
				line-height: normal;
				/deep/ .icon {
					margin-left: 30rpx;
					font-size: 28rpx;
					display: block;
				}
			}
			.user-type {
				display: flex;
				margin-top: 6rpx;
				text {
					font-size: 24rpx;
					color: #fff;
					background-color: #cd8202;
					padding: 0 24rpx;
					border-radius: 55px;
				}
			}
			.btn-login {
				font-size: 42rpx;
				background: transparent;
				color: #fff;
				text-align: left;
				width: 200rpx;
			}
		}
		.setting {
			flex-grow: 0;
			flex-shrink: 0;
			.btn-setting {
				margin-top: 10rpx;
				/deep/ .icon {
					color: #fff;
					font-size: 48rpx;
				}
			}
		}
	}
}
.nav {
	margin-top: 15rpx;
	margin-bottom: calc(var(--window-bottom) + 20rpx);
	.list {
		margin-top: 15rpx;
		margin-bottom: 20rpx;
		.item {
			padding-left: 24rpx;
			background: #ffffff;
			.info {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #e9ebee;
				padding: 4rpx 24rpx 4rpx 0;
				height: 100rpx;
				.name {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;
					font-size: 34rpx;
					line-height: normal;
					image {
						width: 45rpx;
						height: 45rpx;
						margin-right: 16rpx;
					}
					/deep/ .icon {
						// color: #1890ff;
						margin-right: 16rpx;
						line-height: normal;
					}
				}

				/deep/ .icon {
					font-size: 36rpx;
				}
			}
			&:last-child {
				.info {
					border-bottom: 0;
				}
			}
		}
	}
}
.status-bar {
	background: #8cc7b5;
}
</style>
