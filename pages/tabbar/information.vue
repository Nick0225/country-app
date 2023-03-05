<template>
		<view class="ui-news-box">
		  <view class="tabbar flex">
		  	  <view class="tabbarItem" @click="changeCurrent(0)" :class="{ 'active': current == 0}">
		  	  	通知
		  	  </view>
			  <view class="tabbarItem" @click="changeCurrent(1)" :class="{ 'active': current == 1}">
			  	  上报
			  </view>
		  </view>
			
			<view class="list">
				<view class="notice" v-show="(current == 0)">
					<view class="empty" v-if="noticeList.length == 0">
						<u-empty mode="list" text="暂无通知" ></u-empty>
					</view>
					<NoticeItem :options="item" :typeOptions="3" v-for="(item, index) in noticeList" :key="'publicW-' + index"></NoticeItem>
				</view>
				
				<view class="info" v-show="(current == 1)">
					<view class="empty" v-if="VerportList.length == 0">
						<u-empty mode="list" text="暂无上报" ></u-empty>
					</view>
					<NoticeItem :options="item" :typeOptions="4" v-for="(item, index) in VerportList" :key="'publicW-' + index"></NoticeItem>
				</view>
			</view>
		</view>
</template>

<script>
import NoticeItem from '@/components/noticeItem.vue'
import { mapState } from 'vuex';
import {  get_notice_list, get_verport,get_verportByName } from '../../api/index.js'

	export default {
		components: {
			NoticeItem,
		},
		mounted() {
			this.getNoticeList()
		},
		onPullDownRefresh() {
			this.getNoticeList();
			this.getVerpostList()
			uni.stopPullDownRefresh();					
		},
		data() {
			return {
			   current: 0,
			   noticeList: [],
				 VerportList:[],
				 role:'',
			}
		},
		computed: {
			...mapState(['user_info'])
		},
		methods: {
			// 获取通知
			async getNoticeList () {
				const res = await get_notice_list()
				console.log(res)
				if (res.data.code == 200) {
				 this.noticeList = res.data.object
				 this.noticeList = this.Overturn(this.noticeList)
				} else {
					this.$u.toast(res.data.message)
			}
			},
			// 获取上报
			async getVerpostList () {
					if (this.user_info.role == '村长') {
						this.role = this.user_info.villageName
					} else {
						this.getVerportByname()
						return
					}
					const res = await get_verport(this.role)
					console.log(res)
					if (res.data.code == 200) {
						 this.VerportList = res.data.object
						 this.VerportList = this.Overturn(this.VerportList)
						} else {
							this.$u.toast(res.data.message)
						}
			},
			// 查看指定用户上报
			async getVerportByname () {
				const res = await get_verportByName(this.user_info.name)
				console.log(res)
				if (res.data.code == 200) {
					 this.VerportList = res.data.object
					 this.VerportList = this.Overturn(this.VerportList)
					} else {
						this.$u.toast(res.data.message)
				}
			},
      // 改变current
		  changeCurrent (index) {
			  this.current = index
				if (index == 1) {
					this.getVerpostList()
				}
		  },
			// 翻转数组
			Overturn(array) {
			  var newArray = [];
			  for (var i = 0; i < array.length; i++) {
			    newArray[i] = array[array.length - i - 1];
			  }
			  return newArray;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tabbar {
		background-color: #FFFFFF;
		padding: 28rpx;
		.active {
			font-size: 42rpx;
			&::after {
				content: '';
				position: absolute;
				bottom: -12rpx;
				left: 50%;
				width: 45rpx;
				transform: translateX(-50%);
				height: 8rpx;
				border-radius: 18rpx;
				background-color: #1890ff;
			}
		}
		.tabbarItem {
			padding: 0 18rpx;
			position: relative;
		}
	}
	
	.list {
		background-color: #FFFFFF;
	}
</style>
