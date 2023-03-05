<template>
	<view>
		<!-- 二维码 -->
		<view class="code_box flex flexCen"><UQcode v-if="isShow" :text="user_info.tel + ''" :size="148"></UQcode></view>
		
		<view class="store_info">
			<view class="name">核销店铺: {{store_info.shopName ? store_info.shopName : '暂无核销商铺'}}</view>
			<view class="adress">联系电话: {{ store_info.tel ? store_info.tel : '暂无联系电话'}} </view>
			<view class="adress">{{store_info.shopAddress ? store_info.shopAddress : ''}}</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import { get_cancell_stroe } from '@/api/index.js';
import UQcode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue';
export default {
	components: {
		UQcode
	},
	data() {
		return {
			isShow: false,
			store_info: {}
		};
	},
	computed: {
		...mapState(['user_info'])
	},
	mounted() {
		this.isShow = true
		this.getCancellStore()
	},
	methods: {
		// 获取本村的核销地点
		async getCancellStore() {
			const res = await get_cancell_stroe()
			console.log(res)
			if (res.data.code == 200) {
				this.store_info = res.data.object
			}  else {
				this.$u.toast(res.data.message)
				}
		}
	}
};
</script>

<style lang="scss" scoped>
.code_box {
	padding-top: 120rpx;
}

.store_info {
	text-align: center;
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 280rpx;
	left: 0;
	&> view {
		line-height: 56rpx;
	}
	.name {
		font-size: 38rpx;
	}
}
</style>
