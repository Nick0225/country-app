<template>
	<view class="me-tabs">
		<scroll-view :id="viewId" :scroll-left="scrollLeft" scroll-x scroll-with-animation :scroll-animation-duration="300">
			<view class="tabs-item tabs-flex tabs-scroll">
				<view class="tab-item" v-for="(tab, i) in tabs" :key="i" @click="tabClick(i)" :ref="'refTabItem' + i">{{ tab.name }}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabs: [],
			viewId:
				'id_' +
				Math.random()
					.toString(36)
					.substr(2, 16),
			scrollLeft: 0,
			warpWidth: 0
		};
	},
	computed: {
		isScroll() {
			return this.tabWidth && this.tabs.length; // 指定了tabWidth的宽度,则支持水平滑动
		},
		tabHeightPx() {
			return uni.upx2px(this.height);
		},
		tabHeightVal() {
			return 48 + 'px';
		},
		tabWidthPx() {
			return uni.upx2px(this.tabWidth);
		},
		tabWidthVal() {
			return this.isScroll ? this.tabWidthPx + 'px' : '';
		},
		lineLeft() {
			if (this.isScroll) {
				return this.tabWidthPx * this.value + this.tabWidthPx / 2 + 'px'; // 需转为px (用rpx的话iOS真机显示有误差)
			} else {
				return (100 / this.tabs.length) * (this.value + 1) - 100 / (this.tabs.length * 2) + '%';
			}
		}
	},
	watch: {
		value() {
			this.scrollCenter(); // 水平滚动到中间
		}
	},
	methods: {
		tabClick(i) {
			this.tabs.splice(i + 1, this.tabs.length);
			this.$emit('change', this.tabs[i]);
		},
		async addTab(item) {
			this.tabs.push(item);
			setTimeout(() => {
				let query = uni.createSelectorQuery();
				query = query.in(this); // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
				query
					.select('.tab-item')
					.boundingClientRect(data => {
						this.warpWidth += data.width;
						this.scrollLeft = this.warpWidth;
					})
					.exec();
			}, 100);
		},
		async scrollCenter() {
			if (!this.isScroll) return;
			if (!this.warpWidth) {
				// tabs容器的宽度
				let rect = await this.initWarpRect();
				this.warpWidth = rect ? rect.width : uni.getSystemInfoSync().windowWidth; // 某些情况下取不到宽度,暂时取屏幕宽度
			}
			let tabLeft = this.tabWidthPx * this.value + this.tabWidthPx / 2; // 当前tab中心点到左边的距离
			let diff = tabLeft - this.warpWidth / 2; // 如果超过tabs容器的一半,则滚动差值
			this.scrollLeft = diff;
			// #ifdef MP-TOUTIAO
			this.scrollTimer && clearTimeout(this.scrollTimer);
			this.scrollTimer = setTimeout(() => {
				// 字节跳动小程序,需延时再次设置scrollLeft,否则tab切换跨度较大时不生效
				this.scrollLeft = Math.ceil(diff);
			}, 400);
			// #endif
		},
		initWarpRect() {
			return new Promise(resolve => {
				setTimeout(() => {
					// 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this); // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
					// #endif
					query
						.select('#' + this.viewId)
						.boundingClientRect(data => {
							resolve(data);
						})
						.exec();
				}, 20);
			});
		}
	},
	mounted() {
		this.scrollCenter(); // 滚动到当前下标
	}
};
</script>

<style lang="scss">
.me-tabs {
	position: relative;
	font-size: 24rpx;
	background-color: #fff;
	box-sizing: border-box;
	overflow-y: hidden;
	height: 48px;
	&.tabs-fixed {
		z-index: 990;
		position: fixed;
		top: var(--window-top);
		left: 0;
		width: 100%;
	}

	.tabs-item {
		position: relative;
		white-space: nowrap;
		box-sizing: border-box;
	}

	// 平分的方式显示item
	.tabs-flex {
		display: flex;
		.tab-item {
			color: #666;
			font-size: 14px;
			margin-right: 10px;
			position: relative;
			padding-right: 22px;
			color: #3173ff;
			position: relative;
			text-align: center;
			box-sizing: border-box;
			height: 48px;
			line-height: 48px;
			&::after {
				content: '';
				background: url(../../static/tab-link.png);
				position: absolute;
				height: 48px;
				width: 18px;
				right: 0px;
				top: 0px;
			}
			&:last-child {
				margin-right: 0px;
				color: #999;
				&::after {
					content: none;
				}
			}
		}
	}
	.tabs-scroll {
		.tab-item {
			display: inline-block;
		}
	}
}
</style>
