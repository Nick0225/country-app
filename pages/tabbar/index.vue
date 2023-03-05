<template>
	<view class="container">
		<!-- 轮播 -->
		<view class="index_banner">
			<u-swiper class="swiper" indicator imgMode="widthFix" indicatorMode="line" circular :list="barner" height="180" :keyName="'img'"></u-swiper>
		</view>
		<!-- tabbar -->
		<!-- isMerchant -->
		<view class="index_tabbar flex">
			<view class="tabbarItem" @click="navtoCode">
				<view class="flex flexCen"><image src="../../static/images/duihuan.png" mode="aspectFit"></image></view>
				<view class="title">积分兑换</view>
			</view>
			<view class="tabbarItem" v-if="(user_info.isMerchant == 1)" @click="navtoCancell">
			<!-- <view class="tabbarItem" @click="navtoCancell"> -->
		 	<view class="flex flexCen"><image src="../../static/images/hexiao.png" mode="aspectFit"></image></view>
				<view class="title">积分核销</view>
			</view>
			<view class="tabbarItem" v-if="(user_info.role == '乡长')" @click="navtoInform">
				<view class="flex flexCen"><image src="../../static/images/xiaoxi.png" mode="aspectFit"></image></view>
				<view class="title">发布公告</view>
			</view>
			<view class="tabbarItem" v-if="showNotice" @click="navtoNotice">
				<view class="flex flexCen"><image src="../../static/images/news.png" mode="aspectFit"></image></view>
				<view class="title">发布通知</view>
			</view>
			<view class="tabbarItem" @click="navtoVerport" v-if="(user_info.role == '村民')">
				<view class="flex flexCen"><image src="../../static/images/shangbao.png" mode="aspectFit"></image></view>
				<view class="title">信息上报</view>
			</view>
			<view class="tabbarItem" v-for="(item, index) in linkList" :key="'link-' + index" >
				<view class="flex flexCen"><image :src="item.ico ? item.ico : ''" mode="aspectFit"></image></view>
				<view class="title">{{ item.name }}</view>
			</view>
		</view>
		<!-- 最新公告 -->
		<view class="index_record">
			<view class="record_header flex"><Title :title="'最新公告'" :IsMore="true" :MoreTitle="'全部公告'" :MorePath="'/pages/recordList/recordList'"></Title></view>
			<view class="list">
				<view class="empty" v-if="recordList.length == 0"><u-empty mode="list" text="列表数据为空"></u-empty></view>
				<NewItem :options="item" :typeOptions="1" v-for="(item, index) in recordList" :key="'record-' + index"></NewItem>
			</view>
		</view>
		<!-- 公益宣传 -->
		<view class="index_publicW">
			<view class="publicW_header flex"><Title :title="'公益宣传'" :IsMore="true" :MoreTitle="'全部公益'" :MorePath="'/pages/publicList/publicList'"></Title></view>
			<view class="list">
				<view class="empty" v-if="publicWList.length == 0"><u-empty mode="list" text="列表数据为空"></u-empty></view>
				<NewItem :options="item" :typeOptions="2" v-for="(item, index) in publicWList" :key="'publicW-' + index"></NewItem>
			</view>
		</view>
		<!-- 模态框 更新提示 -->
		<view >
				<u-modal :show="show" :title="title" :content='content'  @confirm="updateApp()"></u-modal>
			</view>
	</view>
</template>

<script>
import Title from '@/components/title.vue';
import NewItem from '@/components/newsItem.nvue';
import { get_home_banner, get_news_list, get_puliicw_list, get_home_link} from '../../api/index.js';
import { get_now_version } from '@/api/index.js'
import { mapState } from 'vuex';

export default {
	components: {
		Title,
		NewItem
	},
	data() {
		return {
			show: false,
			title: "更新提示",
			content: "当前版本并非最新版本,请点击确定并等待更新...",
			
			version: '',
			href: '',
			
			barner: [],
			loading: true,
			linkList: [],
			recordList: [],
			publicWList: [],
			
			showNotice: false
		};
	},
	computed: {
		...mapState(['user_info'])
	},
	mounted() {
		this.getHomeData();
		//#ifdef APP
		this.getVersion()
		//#endif
	},
	methods: {
		// 获取首页数据
		async getHomeData() {
			try {
				let that = this;
				const params = { currentPage: 1, pageSize: 4 };
				await Promise.all([get_home_banner(params), get_home_link(params), get_news_list(params), get_puliicw_list(params)]).then(res => {
					const [banner, link, recordList, publicW] = res;
					that.barner = banner.data.object.records || [];
					that.linkList = link.data.object.records || [];
					that.recordList = recordList.data.object || [];
					that.publicWList = publicW.data.object.records || []
				});
				this.$nextTick(function() {
					that.loading = false;
				});
				// 查看用户信息
				console.log('user_info',this.user_info)
				if (this.user_info.role == '村长') {
					this.showNotice = true
				} else if ( this.user_info.role == '乡长' ) {
					this.showNotice = true
				}
				
			} catch (e) {
				uni.showToast({
					icon: 'none',
					title: '请求失败'
				});
			}
			this.recordList = this.Overturn(this.recordList)
		},
		// 翻转数组
		Overturn(array) {
		  var newArray = [];
		  for (var i = 0; i < array.length; i++) {
		    newArray[i] = array[array.length - i - 1];
		  }
		  return newArray;
		},
		// 跳转核销
		navtoCancell() {
			if (this.user_info.isMerchant != 1) {
				return
			}
			this.$Router.push('/pages/user/credit_cancellation');
		},
		// 跳转到积分兑换
		navtoCode() {
			this.$Router.push('/pages/user/exchange_code');
		},
		// 跳转到发布公告
		navtoInform() {
			if (this.user_info.role != "乡长") {
				return
			}
			this.$Router.push('/pages/inform/inform');
		},
		// 跳转到发布通知
		navtoNotice() {
			if (this.user_info.role == "村长" || "乡长") {
					this.$Router.push('/pages/notice/notice');
				} else {
					return
				}
		},
		// 跳转到信息上报
		navtoVerport () {
			if (this.user_info.role == "村民") {
				this.$Router.push('/pages/verport/verport');
				} else {
					return
				}
		}, 
		// 轮播图的预览
		bannerPreview(index) {
			const href = this.barner[index].href
			if (href) {
			  const url = encodeURI(href);
			  this.$Router.push({ path: '/pages/preview/preview', query: { url } });
			}
		},
		// 跳转到预览
		navtoPreview(href) {
			if (href) {
				const url = encodeURI(href);
				this.$Router.push({ path: '/pages/preview/preview', query: { url } });
			}
		},
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
		// 获取最新版本号
		async getVersionList () {
		  const res = await get_now_version()
		  if (res.data.code == 200) {
			  this.currentVersion = res.data.object.records ? res.data.object.records[0].appVersion : ''
			  if (this.version != this.currentVersion) {
					this.show = true
				  this.href = res.data.object.records ? res.data.object.records[0].href : ''
					if (!this.href) {
						this.$u.toast('获取下载地址失败')
						return
					}
			  }
		  }
		},
	  // 更新APP
	  updateApp () {
			this.show = false
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
		  					confirmColor: '#1890ff',
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
	},
	
};
</script>

<style lang="scss" scoped>
/* 轮播图 */
.barner {
	width: 100%;
	background-color: #fff;
	height: 300rpx;
	margin: -160rpx auto 0 auto;
	box-shadow: 0 12rpx 12rpx #f0f0f0;
	.swiper {
		width: 100%;
	}
}

/* tabbar */
.index_tabbar {
	flex-wrap: wrap;
	background-color: #ffffff;
	padding: 28rpx 0;
	.tabbarItem {
		width: 25%;
		margin-bottom: 18rpx;
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 24rpx;
		}
		.title {
			width: 100%;
			text-align: center;
			line-height: 64rpx;
			font-size: 30rpx;
		}
	}
}

/* 最新公告 */

.index_record {
	margin-top: 18rpx;
	width: 100%;
	background-color: #ffffff;
	.record_header {
		padding: 12rpx 18rpx;
		border-bottom: 1rpx solid #e9ebee;
	}
}

/* 公益宣传 */
.index_publicW {
	margin-top: 18rpx;
	width: 100%;
	background-color: #ffffff;
	.publicW_header {
		padding: 12rpx 18rpx;
		border-bottom: 1rpx solid #e9ebee;
	}
}
</style>
