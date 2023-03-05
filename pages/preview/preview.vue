<template>
	<view >
		<web-view :src="href" ></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			   href: 'https://www.gmu.cn/'
			};
		},
		mounted() {
			const url  = this.$Route.query.url
			console.log(url)
			this.href = url
		}
	}
</script>

<style lang="scss">

</style>
