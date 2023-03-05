<template>
	<view class="list">
		<view class="empty" v-if="publicList.length == 0">
			<u-empty mode="list" text="列表数据为空" ></u-empty>
		</view>
		<NewItem :options="item"  :typeOptions="2" v-for="(item, index) in publicList" :key="'publicW-' + index"></NewItem>
	</view>
</template>

<script>
	import { get_puliicw_list } from '../../api/index.js'
	import NewItem from '@/components/newsItem.nvue'
	export default {
		components: {
			NewItem
		},
		data() {
			return {
			  params: {
				currentPage: 1,
				pageSize: 10
			  },
			  publicList: [],
			  total: 0
			};
		},
		onReachBottom() {
		  if (this.params.currentPage * this.params.pageSize < this.total) {
			  this.getMore()
			  return
		  }
		  this.$u.toast('没有更多数据了')
		},
		mounted() {
		  this.getPublicList()
		},
		methods: {
		   // 获取数据
		   async getPublicList () {
			 const res = await  get_puliicw_list(this.params)
			 if (res.data.code == 200 ) {
				this.publicList = res.data.object.records || []
				this.total = res.data.object.total
			 } else {
				 this.$u.toast(res.data.message)
			 }
		   },
		   // 加载下一页
		   getMore () {
			   this.params.currentPage++
			   this.$nextTick(async ()=>{
			   	  const res = await get_puliicw_list(this.params)
			   	  if (res.data.code == 200 ) {
			   	  	this.publicList = [...this.publicList, ...res.data.object.records] || []
			   	  } else {
							this.$u.toast(res.data.message)
						}
			   })
			 
		   }
		}
	}
</script>

<style lang="scss">

</style>
