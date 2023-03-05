<template>
	<view>
		<view class="box-head">
			<uni-mall-head ref="refUniMallHead" @change="tabChange"></uni-mall-head>
		</view>
		<view class="box-list">
			<template v-for="(item, index) in currentData">
				<view
					class="box-list-item"
					:class="[
						item.contacts && item.contacts.length ? 'box-list-item-department-icon' : '',
						item.type === 'user' ? 'box-list-item-user' : 'box-list-item-department'
					]"
					:key="'user' + index"
					@click="handelClickItem(item)"
				>
					<view class="box-list-item-department-pic" v-if="item.type === 'department'"><image src="../../static/department-icon.png"></image></view>
					<view class="box-list-item-user-pic" v-else>
						<!-- <image v-if="item.pic" :src="item.pic"></image> -->
						<text >{{ getUserName(item.name) }}</text>
					</view>
					<view class="box-list-item-right">
						<view class="box-list-item-text">{{ item.name }} {{ item.contacts && item.contacts.length > 0 ? `（${item.contacts.length}）` : '' }}</view>
						<!-- <view class="box-list-item-user-tag" v-if="item.type === 'user' && item.tag && item.type.length > 0">
							<text v-for="(tag, tagIndex) in item.tag">{{ tag }}</text>
						</view> -->
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import uniMallHead from '@/components/uni-mall-head/uni-mall-head.vue';
export default {
	props: {
		dataList: {
			type: Array,
			default: () => []
		},
		defaultHeadList: {
			type: Object,
			default: () => {}
		}
	},
	components: {
		uniMallHead
	},
	data() {
		return {
			currentData: []
		};
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			if (Object.keys(this.defaultHeadList).length > 0) {
				this.$refs.refUniMallHead.addTab(this.defaultHeadList);
			}
			this.currentData = this.dataList;
		},
		tabChange(obj) {
			this.getCurrentData(obj.id, this.dataList);
		},
		handelClickItem(item) {
			// if (item.type === 'department') {
				if (item.contacts && item.contacts.length > 0) {
					this.$refs.refUniMallHead.addTab({ name: item.name, id: item.id });
					this.currentData = item.contacts;
				}
			// }
			this.$emit('change', item);
		},
		getUserName(name) {
			if (name.length === 0) {
				return '';
			} else if (name.length <= 2) {
				return name;
			} else if (name.length >= 3) {
				return name.substring(name.length - 2);
			}
		},
		getCurrentData(id, data) {
			if (id === this.defaultHeadList.id) {
				this.currentData = this.dataList;
			} else {
				if (data.length > 0) {
					data.map(item => {
						if (item.id === id) {
							this.currentData = item.contacts;
						}
						if (item.contacts && item.contacts.length > 0) {
							this.getCurrentData(id, item.contacts);
						}
					});
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.box-head {
	position: fixed;
	left: 0px;
	width: 100%;
	height: 48px;
	background: #ffffff;
	padding-left: 17px;
	box-sizing: border-box;
	overflow-y: hidden;
	z-index: 999;
}
.box-list {
	padding-top: 52px;
	.box-list-item {
		position: relative;
		height: 60px;
		display: flex;
		align-items: center;
		padding: 0 14px;
		box-sizing: border-box;
		background: #ffffff;
		margin-bottom: 1px;
		&:active {
			background: #f2f3f4;
		}
		&:last-child {
			margin-bottom: 0px;
		}
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
		.box-list-item-user-pic {
			width: 40px;
			height: 40px;
			background: #377fff;
			border-radius: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 14px;
			overflow: hidden;
			image {
				width: 40px;
				height: 40px;
			}
			text {
				color: #ffffff;
				font-size: 12px;
			}
		}
		.box-list-item-right {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex: 1;
		}
		.box-list-item-text {
			color: #333333;
			font-size: 16px;
		}
		.box-list-item-user-tag {
			text {
				box-sizing: border-box;
				border-radius: 8px;
				padding: 4px 8px;
				font-size: 10px;
				margin-left: 5px;
				&:first-child {
					margin-left: 0px;
				}
				&:nth-child(1) {
					background: rgba(49, 210, 144, 0.05);
					border: 1px solid #31d290;
					color: #31d290;
				}
				&:nth-child(2) {
					background: rgba(55, 127, 255, 0.05);
					border: 1px solid #377fff;
					color: #377fff;
				}
			}
		}
		&.box-list-item-department-icon {
			&::after {
				content: '';
				position: absolute;
				width: 5px;
				height: 10px;
				top: 26px;
				right: 15px;
				background: url(../../static/more.png) no-repeat;
			}
		}
	}
	.box-list-item-department + .box-list-item-user {
		margin-top: 10px;
	}
}
</style>
