<script>
	import { IstokenOut } from 'api/index.js'
	export default {
		onLaunch: function() {
		    this.isOut()
		},
		methods: {
		  // 判断 token 是否过期
		  async isOut () {
			const res = await  IstokenOut() 
			if (res.data.code != 200) {
				uni.clearStorageSync()
				this.$u.toast('会话已过期，重新登录中')
				this.$Router.replaceAll('/pages/login/login')
				return 
			} 
			 this.$store.dispatch('getUserinfo')
		  }
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* uview组件样式库  */
	@import '@/uni_modules/uview-ui/theme.scss';
	/*每个页面公共css */
	@import "./static/css/global.scss";

	@import "./static/css/iconfont.scss";
	
</style>
