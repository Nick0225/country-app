<template>
	<view>
		<view class="empty" v-if="list.length == 0"><u-empty text="暂无客服信息"></u-empty></view>
		
		<view class="item" v-for="(item, index) in list" :key="index">
			<view class="flex flexBei"  @click="call(item.tel)">
				<view class="">
					<view class="">姓名：{{ item.name }}</view>
					<view style="margin-top: 5px;">联系方式：{{ item.tel }}</view>
				</view>
				<u-icon name="phone" color="#2979ff" size="36"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
import { get_server } from '@/api/index.js';
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
	onShow() {
		this.getDataList();
	},
	methods: {
		// 
		async getDataList() {
			const res = await get_server(this.params);
			if (res.data.code == 200) {
				this.list = res.data.object.records ? res.data.object.records : [],
				this.total = res.data.object.total
			} else {
				this.$u.toast(res.data.message)
			}
		},
		call (e) {
		uni.makePhoneCall({
			phoneNumber: e, //仅为示例
			fail(error) {
			this.$u.toast(error)
			}
		});
		},
	}
};
</script>

<style lang="scss" scoped>
.item {
	padding: 10px;
	background-color: #ffffff;
	border-bottom: 1px solid #e9ebee;
	
}
</style>
