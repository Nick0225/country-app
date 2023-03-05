<template>
	<view class="update_Container">
		<!-- 图像 -->
		<view class="logoBox flex flexCen"><image src="../../static/images/logo.png" mode=""></image></view>
		<view class="info">
			<view class="title">智慧乡村</view>
			<view class="version">Version {{this.version}}</view>
		</view>
		<view class="list">
			<view class="listItem flex">
				<view class="name">功能介绍</view>
				<IconFont type="gengduo" :size="42"></IconFont>
			</view>
			<view class="listItem flex">
				<view class="name">产品投诉</view>
				<IconFont type="gengduo" :size="42"></IconFont>
			</view>
			<view class="listItem flex" @click="handleGet">
				<view class="name flex flexVc">
					检查新版本
					<view class="tag" v-if="(isShow)">New</view>
				</view>
				<IconFont type="gengduo" :size="42"></IconFont>
			</view>
		</view>
	</view>
</template>

<script>
import IconFont from '@/components/iconfont/iconfont.vue'
import { get_now_version } from '@/api/index.js'
export default {
	components: {
		IconFont
	},
	data() {
		return {
		   version: '',
		   isShow: false,
		   href: ''
		};
	},
	onLoad() {
		//#ifdef APP
			this.getVersion()
		//#endif
	},
	methods: {
		// 获取当前版本号
		getVersion () {
			 plus.runtime.getProperty( plus.runtime.appid,  ( wgtinfo )=> {
			  //  获取 app的version
			  let appversion = wgtinfo.version;
			  this.version = appversion
			    this.$nextTick(() =>{
			  	  this.getVersionList()
			   })
			  // 存缓存 版本号
			  })
		},
		// 获取服务器版本
		async getVersionList () {
		  const res = await get_now_version()
		  if (res.data.code == 200) {
			  this.currentVersion = res.data.object.records ? res.data.object.records[0].appVersion : ''
			  if (this.version != this.currentVersion) {
				  this.isShow = true
				  this.href = res.data.object.records ? res.data.object.records[0].href : ''
			  }
		  }
		},
		// 点击获取新版本
		handleGet () {
			if (!this.isShow) {
				this.$u.toast('已经是最新版本了')
			} else {
				if (!this.href) {
					this.$u.toast('获取下载地址失败')
					return
				}
				this.updateApp()
			}
		},
	  // 更新APP
	  updateApp () {
			uni.showLoading({
		  		title: '更新中'
		  	});
		  	uni.downloadFile({
		  		//执行下载
		  		url: this.href, //下载地址
		  		success: downloadResult => {
		  			console.log(downloadResult)
		  			//下载成功
		  			uni.hideLoading();
		  			if (downloadResult.statusCode == 200) {
		  				uni.showModal({
		  					title: '',
		  					content: '更新成功，确定现在重启吗？',
		  					confirmText: '重启',
		  					confirmColor: '#EE8F57',
		  					success: function(res) {
		  						if (res.confirm == true) {
		  							plus.runtime.install(
		  								//安装
		  								downloadResult.tempFilePath,
		  								{
		  									force: true
		  								},
		  								function(res) {
		  									utils.showToast('更新成功，重启中');
		  									plus.runtime.restart();
		  								}
		  							);
		  						}
		  					}
		  				});

		  				return
		  			}

		  			uni.showToast({
		  				icon: 'none',
		  				title: '下载失败'
		  			})
		  		},
		  		fail(error) {
		  			uni.showToast({
		  				icon: 'none',
		  				title: '更新失败'
		  			});
		  		}
		  	});
	   }
	}
}
</script>

<style lang="scss" scoped>
.update_Container {
	padding: 0 56rpx;
	background-color: #ffffff;
	min-height: 100vh;
}
.logoBox {
	padding: 48rpx 0;
	image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
	}
}

.info {
	text-align: center;
	.title {
		font-weight: 600;
	}
}

.list {
	margin-top: 76rpx;
	border-top: 1rpx solid #e9ebee;
	border-bottom: 1rpx solid #e9ebee;
	.listItem {
		padding: 24rpx 16rpx;
		justify-content: space-between;
		border-bottom: 1rpx solid #e9ebee;
		&:last-child {
			border: none;
		}
		.tag {
			display: inline-block;
			padding: 8rpx 12rpx;
			border-radius: 28rpx;
			font-size: 24rpx;
			color: #fff;
			background-color: #f5222d;
			margin-left: 18rpx;
		}
	}
}
</style>
