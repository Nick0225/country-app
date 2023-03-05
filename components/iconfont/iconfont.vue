<template>
	<view :style="{ 'font-size': size + 'rpx'}" :class="'icon iconfont icon-'+type"></view>
</template>
<script>
	export default {
		name: 'iconfont',
		props: {
			type: String,
			size: Number,
			default: 32
		}
	}
</script>
