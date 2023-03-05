<template>
	<view class="content">
		<view class="detail">
			<view class="title">{{ info.title ? info.title : '上报信息来自：' + info.name }}</view>
			<view class="flex flexBei">
				<view>
					<view class="info">
						<view class="source-date">
							<text class="source" v-if="info.source_url" @tap="copyText(info.source_url)">{{ info.source }}</text>
							<text class="source" v-else>来自：{{ info.institutions ? info.institutions : info.villageName}}</text>
						</view>
							<view class="read" v-show="this.type != 1 && this.type != 4">阅读{{ info.views }}</view>
					</view>
					<view style="color: #666666;font-size: 14px;" v-if="info.tel">
						<text class="source" >联系方式：{{ info.tel ? info.tel : ''}}</text>
					</view>
					<view  class="" style="margin-top: 2px;font-size: 14px;">
						<text class="date hidden" style="color: #666666;">发布时间：{{info.createTime? info.createTime.slice(0,16) : ''}}</text>
					</view>
				</view>
				<view style="margin-top: 20px;">
					<u-icon name="volume" color="#2979ff" size="28" v-if="isVolume" @click="speak"></u-icon>
					<u-icon name="volume-off" color="#2979ff" size="28" v-else @click="speak"></u-icon>
				</view>
			</view>
			
			<view class="desc">
				<u-parse :content="info.descb"></u-parse>
			</view>
			<view v-if="info.img || info.ico" class="flex flexCen" style="margin-top: 15px">
				<image :src="info.img || info.ico" mode=""></image>
			</view>
			<view class="declaration" v-if="info.source_url">
				本文转载至{{ info.institutions }}，
				<text @tap="copyText(info.source_url)">点此可查看原文链接。</text>
				如有侵权，请联系我们，我们将在最短的时间内处理。
			</view>
		</view>
	</view>
</template>

<script>
	import { get_pulicw_details,get_news_details,get_notice_details,get_reportNewById } from '../../api/index.js'
	
	var innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.autoplay = false;	
		innerAudioContext.src = '';
		innerAudioContext.loop = true
	
	export default {
		data() {
			return {
				type: null,
				id: null,
				info: {},
				isVolume: true,
				way:1,
				src:'',
				per:0,
				spd:4,
			}
		},
		onLoad(e) {
			console.log(e)
			this.id = e.id
			this.type = e.type
		},
		mounted() {
			this.getDetails()
		
		},
		// 离开页面销毁语音
		destroyed() {
		  innerAudioContext.destroy()
		},
		methods: {
		  // 获取详情
		 async getDetails () {
			 if (!this.type) {
				 this.$u.toast('数据有误')
				 return
			 }
			 let res
			 if (this.type == 1) {
				// 公告
			 	res = await get_news_details(this.id)
			 }
			 if (this.type == 2) {
				// 公益列表
			 	res = await get_pulicw_details(this.id)
				console.log(res)
			 }
			 if (this.type == 3) {
			 	// 通知
			 	res = await get_notice_details(this.id)
			 }
			 if (this.type == 4) {
			 	// 上报
			 	res = await get_reportNewById(this.id)
			 }
			 if (res.data.code == 200) {
				 if (this.type ==1) { 
						this.info = res.data.object
						 this.transform()
						return
				 }
				 if (this.type ==2) {
						this.info = res.data.object.welfare
						 this.transform()
						return
				 }
				 if (this.type ==3) {
						this.info = res.data.object.notice
						 this.transform()
						return
				 }
				 if (this.type ==4) {
				 		this.info = res.data.object
						 this.transform()
				 		return
				 }
			 } else {
				 this.$u.toast(res.data.message)
			 }
		 },
		transform () {
			const contents = this.info.descb.replace(' ', '').replace(/<.+?>/g, '').replace(/&nbsp;/ig, '');	
			console.log(contents)
			this.tex = contents;
			this.src = 'https://tts.baidu.com/text2audio.mp3?tex=' + this.tex +'&cuid=baike&amp&lan=ZH&amp&ctp=1&amp&pdt=301&amp&vol=100&amp&rate=32&amp&per=' + this.per + '&spd=' + this.spd;   //this.per为音色：设置为1,2，3，有不同的音色,this.spd为朗读的速度
			innerAudioContext.src = this.src;	
		},
		speak () {
			console.log(this.way)
			if (this.way == 1) {
				this.isVolume = true
				this.way = 2
				innerAudioContext.play();	
				innerAudioContext.onPlay()	//继续播放
			} else if (this.way == 2) {
				this.isVolume = false
				this.way = 1
				innerAudioContext.pause()
			} else {
				return
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.detail {
	padding: 40rpx 32rpx;
	background: #fff;
	.title {
		text-align: center;
		font-size: 44rpx;
		color: #262626;
		line-height: 70rpx;
		font-weight: bold;
	}
	.info {
		font-size: 14px;
		margin-top: 32rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.source-date {
			.source {
				color: #666;
			}
			.date {
				color: #999;
				margin-left: 24rpx;
			}
		}
		.read {
			color: #666;
		}
	}
	.desc {
		margin-top: 56rpx;
		overflow: hidden;
		color: #262626;
		.wxParse {
			color: #262626;
		}
	}
}
</style>
