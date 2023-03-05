<template>
	<view>
		<!-- 头部 -->
		<view class="header flex">
		   <view class="tabItem flex flexCen">
					<view class="tabbar flex" @click="Back()">
						<u-icon name="arrow-left" color="#ffffff"></u-icon>返回
					</view>
					<view class="tabbar flex" v-for="(item, index) in tabList" :key="'tab' + index" @click="tabBack(index)">
						{{item.name}}
					</view>
		   </view>
		</view>
		<!-- search -->
		<view class="flex flexCen" style="padding: 2px;background-color: #ffffff;">
			<u-search placeholder="输入信息搜索" v-model="searchKey" :showAction="false" style="margin: 0px 5px 0px 5px;" @clear="backList" bgColor="#e9ebee"></u-search>
			<view class="tabbar" style="font-size: 14px;" @click="searchUser()">搜索</view>
		</view>
		<view class="list">
			<view v-if="(!isSon)">
				<view class="listItem flex flexVc" @click="handleChange(index)" v-for="(item, index) in dataList" :key="'user' + index">
					<view class="left flex flexVc">
						<view class="box-list-item-department-pic" ><image src="../../static/images/department-icon.png"></image></view>
						<text>{{item.name}}</text>
					</view>
					<iconfont type="gengduo"></iconfont>
				</view>
			</view>
			<view v-else>
				<view class="empty" v-if="currentList.length == 0">
					<u-empty mode="list" text="暂无联系人" ></u-empty>
				</view>
				<view class="listItem flex flexVc" @click="navtoUser_info(item.id)" v-for="(item, index) in currentList" :key="'user' + index">
					<view class="left flex flexVc">
						<view class="box-list-item-department-pic" ><image src="@/static/images/department-icon.png"></image></view>
						<text>{{item.name}}</text>
					</view>
					<iconfont type="gengduo"></iconfont>
				</view>
			</view>
		</view>
		<view class="wrap">
				<u-back-top :scroll-top="scrollTop" icon="arrow-up" top="300"></u-back-top>
		</view>
		
	</view>
	
</template>

<script>
import { get_phonebook_list,get_userInfo_Byname } from '../../api/index.js'
import iconfont from '@/components/iconfont/iconfont.vue'

export default {
	components: {
		iconfont
	},
	data() {
		return {
			isSon: false,
			tabList: [],
			dataList: [],
			currentList: [],
			
			searchKey: '',		
			scrollTop: 0
		}
	},
	onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
	mounted() {
	  this.getPhoneBook()
	},
	methods: {
		// 获取通讯录
		async getPhoneBook () {
		  const res = await get_phonebook_list()
		  if (res.data.code == 200) {
			this.tabList[0] = { name: res.data.object.contectname ? res.data.object.contectname : res.data.object.contectName}
			this.dataList = res.data.object.records
		  	return
		  } else {
				uni.showToast({
					title:res.data.message
				})
			}
		},
		// 根据关键字搜索指定信息
		async searchUser () {
			if (this.searchKey == '') {
				this.$u.toast('搜索内容不能为空')
				return
			}
			const res = await get_userInfo_Byname(this.searchKey)
			if (res.data.object.length != 0) {
				this.isSon = true
				this.currentList = res.data.object
			} else {
				this.$u.toast(res.data.message)
				}
			},
		// 返回
		backList () {
			this.isSon = false
			this.getPhoneBook()
		},
		// 点击事件
		handleChange(index) {
			this.currentList = this.dataList[index].contacts || []
			this.tabList[1] = { name: this.dataList[index].name}
			this.$nextTick(() =>{
				this.isSon = true
			})
		},
		// 跳转到用户详情
		navtoUser_info (id) {
			this.$Router.push({ path: '/pages/user/info_details', query: { isMine: 0, id} });
		},
		tabBack (index) {
			if (index != 0) {
				this.isSon = false
				this.currentList = []
				this.tabList.pop()
				}
			},
		Back () {
				this.isSon = false
				this.currentList = []
				if (this.tabList.length != 1){
					this.tabList.pop()
				}
		},
	}
};
</script>

<style lang="scss" scoped>
	.wrap {
			height: 10vh;
		}
	.header {
		font-size: 24rpx;
		background-color: #fff;
		box-sizing: border-box;
		color: #666;
		font-size: 14px;
		height: 48px;
		line-height: 48px;
		padding: 0 28rpx;
		}
	.list {
		margin-top: 10rpx;
		.listItem {
			background-color: #FFFFFF;
			border-bottom: #e9ebee 1px solid;
			padding: 18rpx 28rpx ;
			justify-content: space-between;
			.box-list-item-department-pic {
				width: 40px;
				height: 40px;
				background: rgba(55, 127, 255, 0.1);
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 14px;
				overflow: hidden;
				image {
					width: 20px;
					height: 20px;
				}
			}
		}
	}
	.tabbar {
		background-color: #3c9cff;
		color: white;
		border-radius: 20px;
		padding-left: 10px;
		padding-right: 10px;
		height: 30px;
		line-height: 30px;
		margin-right: 10px;
	}
	.tabbarItem {
			color: #b6b9bf;
			font-size: 14px;
			font-weight: 600;
			padding: 4px 15px 4px 15px;
			margin-right: 10px;
			margin-bottom: 5px;
	}
	.active {
			background-color: #def1f7;
			color: #3c9cff;
			border-radius: 15px;
	}
</style>
