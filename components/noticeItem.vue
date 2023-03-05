<template>
	<view class="media-item view" hover-class="media-item-hover"  @click="navtoDetails">
		<view class="view flex" :style="{flexDirection: 'row'}">
			<!-- title -->
			<text class="media-title media-title2">{{options.title ? options.title : '上报信息来自：' + options.name}}</text>
		</view>
		<view class="media-foot flex-row" style="flex-direction: row;">
			<!-- time -->
			<view class="media-info flex-row" style="flex-direction: row;">
				<text class="info-text" style="color: red;" v-if="options.institutions == '永隆乡'">来源：乡长</text>
				<text class="info-text" v-else>来源：{{options.institutions ? options.institutions : options.villageName }}</text>
				<text class="info-text" style="text-align: right;">发布时间：{{options.createTime? options.createTime.slice(0,16) : ''}}</text>
			</view>
		</view>
		<view class="media-item-line" style="position: absolute;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		props: {
			options: {
				type: Object,
				default: function(e) {
					return {}
				}
				},
				typeOptions: {
					type: Number,
					default: function(e) {
						return {}
					}
			}
		},
		methods: {
		  navtoDetails () {
			  uni.navigateTo({
			  	 url: `/pages/passage_details/passage_details?type=${this.typeOptions}&id=${this.options.id}`,
				 fail(error) {
				 	console.log(error)
				 }
			  })
		  },
		}
	}
</script>

<style>
	.view {
		flex-direction: column;
	}

	.flex-row {
		flex-direction: row;
	}

	.flex-col {
		flex-direction: column;
	}

	.list-cell {
		width: 750rpx;
		padding: 0 30rpx;
	}

	.uni-list-cell-hover {
		background-color: #eeeeee;
	}

	.media-item {
		position: relative;
		flex: 1;
		flex-direction: column;
		/* border-bottom-width: 1rpx;
		border-bottom-style: solid;
		border-bottom-color: #ebebeb; */
		padding: 20rpx 30rpx 21rpx 30rpx;
	}

    .media-item-hover{
        background-color: #eee;
    }

	.media-item-line {
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		bottom: 0;
		height: 1rpx;
		background-color: #ebebeb;
	}

	.media-image-right {
		flex-direction: row;
	}

	.media-image-left {
		flex-direction: row-reverse;
	}

	.media-title {
		flex: 1;
	}

	.media-title {
		lines: 3;
		text-overflow: ellipsis;
		font-size: 30rpx;
		color: #555555;
	}

	.media-title2 {
		flex: 1;
		margin-top: 6rpx;
		line-height: 40rpx;
	}

	.image-section {
		margin-top: 20rpx;
		flex-direction: row;
		justify-content: space-between;
	}

	.image-section-right {
		margin-top: 0rpx;
		margin-left: 10rpx;
		width: 225rpx;
		height: 146rpx;
	}

	.image-section-left {
		margin-top: 0rpx;
		margin-right: 10rpx;
		width: 225rpx;
		height: 146rpx;
	}

	.image-list1 {
		width: 690rpx;
		height: 481rpx;
	}

	.image-list2 {
		width: 225rpx;
		height: 146rpx;
	}

	.image-list3 {
		width: 225rpx;
		height: 146rpx;
	}

	.media-info {
		flex-direction: row;
		align-items: center;
	}

	.info-text {
		margin-right: 40rpx;
		color: #999999;
		font-size: 24rpx;
	}

	.media-foot {
		margin-top: 25rpx;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.max-close-view {
		position: relative;
		align-items: center;
		flex-direction: row;
		width: 40rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-width: 1rpx;
		border-style: solid;
		border-color: #aaaaaa;
		border-radius: 4px;
		justify-content: center;
		text-align: center;
	}

	.close-l {
		position: absolute;
		width: 18rpx;
		height: 1rpx;
		background-color: #aaaaaa;
	}

	.close-h {
		transform: rotate(45deg);
	}

	.close-v {
		transform: rotate(-45deg);
	}
</style>
