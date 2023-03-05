<template>
	<view class="list">
		<view class="empty" v-if="recordList.length == 0">
			<u-empty mode="list" text="列表数据为空" ></u-empty>
		</view>
		<NewItem :options="item" v-for="(item, index) in recordList" :key="'publicW-' + index"></NewItem>
	</view>
</template>

<script>
	import { get_news_list } from '../../api/index.js'
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
			  recordList: [],
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
		  this.getRecordList()
		},
		methods: {
		   // 获取数据
		   async getRecordList () {
			 const res = await get_news_list(this.params)
			 if (res.data.code == 200 ) {
				this.recordList = res.data.object.reverse() || []
				this.total = res.data.object.length
			 } else {
				 this.$u.toast(res.data.message)
			 }
		   },
		   // 加载下一页
		   getMore () {
			   this.params.currentPage++
			   this.$nextTick(async ()=>{
			   	  const res = await get_news_list(this.params)
			   	  if (res.data.code == 200 ) {
			   	  	this.recordList = [...this.recordList, ...res.data.object.reverse()] || []
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
