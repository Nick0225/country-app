<template>
	<view class="title_header flex flexHc">
		<view class="left flex">
			<view class="beauty"></view>
			<view class="title">{{ title }}</view>
		</view>
		<view class="right flex flexHc" v-if="IsMore" @click="navoto()">
			<view>{{MoreTitle}}</view>
			<iconfont :size="32" type="gengduo"></iconfont>
		</view>
	</view>
</template>

<script>
import iconfont from '@/components/iconfont/iconfont.vue';
export default {
	components: {
		iconfont
	},
	name: 'titleglobal',
	props: {
		title: {
			type: String,
			required: true,
			default: ''
		},
		IsMore: {
			type: Boolean,
			default: false
		},
		MoreTitle: {
			type: String,
			default: ''
		},
		MorePath: {
			type: String,
			default: ''
		}
	},
	methods: {
		navoto () {
			if (!this.MorePath) {
				return
			}
		   this.$Router.push(this.MorePath)
		}
	}
};
</script>

<style lang="scss">
/* 主题标题栏 */
.title_header {
	width: 100%;
	line-height: 72rpx;
	background-color: #ffffff;
	justify-content: space-between;
	// border-bottom: 1rpx solid #fafafa;
	.left {
		font-size: 32rpx;
		color: #1890ff;
		font-weight: bolder;
		align-items: center;
		align-content: center;
		.beauty {
			// display: inline-block;
			width: 8rpx;
			height: 30rpx;
			border-radius: 10rpx;
			background-color: #1890ff;
			margin-right: 8rpx;
		}
	}
}


</style>
