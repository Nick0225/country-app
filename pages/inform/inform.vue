<template>
	<view>
		<view class="margin border-bottom">
			<u--textarea v-model="title" placeholder="请输入标题:" height="40rpx" ></u--textarea>
		</view>
		<view>
			<u--textarea class="border margin" v-model="descb" placeholder="请输入公告内容:" count style="height: 300rpx;" ></u--textarea>
			</view>
		<view class="margin border">
			<text class="font margin flex flexHc">发布机构：{{ this.user_info.townshipName }}</text>
		</view>
		<!-- 上传图片 -->
		<view class="margin" @click="selectImage" style=" width: 100px; height: 100px; border: #dadbde 1px solid;padding: 5px;">
			<image src="../../static/images/upload.png" mode="" style="width: 90px; height: 90px;"></image>
		</view>
		<view class="margin flex border flexHc">
			<text class="font margin">是否全部接收</text>
			<u-switch class="margin" v-model="value" @change="change" size="22"></u-switch>
		</view>
		<view class="margin" v-show="value == false">
			<u-checkbox-group placement="column" @change="checkboxChange">
				<u-checkbox :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in checkboxList" :key="index" :label="item.name" :name="item.id"></u-checkbox>
			</u-checkbox-group>
		</view>
		<!-- 图片展示 -->
		<view class="margin" v-if="this.ico" style="width: 365px;position: relative;">
			<img :src="this.ico" alt="" style="height: 100%;width: 100%;">
			<u-icon class="close" name="close" color="#ffffff" @click="close"></u-icon>
		</view>
		<view class="margin" v-show="value"><u-button type="primary" @click="confirm" style="margin-top: 10px;">确认发布</u-button></view>
		<view class="margin" v-show="value == false"><u-button type="primary" @click="ChoseVilliageConfirm" style="margin-top: 10px;">确认发布</u-button></view>
	</view>
</template>

<script>
import { get_choseVillages, post_addNews, get_groupDec } from '../../api/index.js';
import { uploadNewsImg } from '../../utils/config.js'
import { mapState } from 'vuex';

const token = uni.getStorageSync('token')

export default {
	data() {
		return {
			title: '',
			descb: '',
			value: true,
			isAll: '1',
			ico:'',
				
			ids:'',
			newsId: '',
			
			checkboxList: [],
		};
	},
	computed: {
		...mapState(['user_info'])
	},
	methods: {
		async getGroupDec () {
			try{
				const groupName = this.user_info.townshipName
				const res = await get_groupDec(groupName)
				this.checkboxList  = res.data.object
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					icon: 'error',
					title: '请求失败'
				});
			}
		},
		change(e) {
			// 获取子村
			this.getGroupDec()
			// Allr
			this.isAll = this.value ? 1 : 0
		},
		checkboxChange(ids) {
			this.ids = ids
		},
		// 确定发送信息
		confirm () {	
			this.postAddNews()
		},
		ChoseVilliageConfirm () {
			if (this.ids.length == 0) {
				uni.showToast({
					icon: 'error',
					title: '请选择公告接收村'
				});
			} else {
				this.postAddNews()
			}
		},
		// 发送信息
		async postAddNews () {
			try{
				const info = {
					"descb": this.descb,
					"ico": this.ico,
					"institutions": this.user_info.townshipName,
					"isAllr": this.isAll,
					"title":this.title
				}
				if (info.descb.length == 0 || info.title.length == 0) {
					uni.showToast({
						icon: 'error',
						title: '请填写内容！'
					});
					return
				}
				console.log(info)
				const res = await post_addNews(info)
				console.log(res)
				if (res.data.object) {
					this.newsId = res.data.object.id
					console.log('NewsId',this.newsId)
					this.getchoseVillages()
				}
				if (res.data.code == 200) {
					uni.showToast({
						icon: 'success',
						title: '发布成功'
					});
					this.$Router.push('/pages/tabbar/index');
				} else {
					this.$u.toast(res.data.message)
				}
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					icon: 'error',
					title: '请求失败'
				});
			}
		},
		async getchoseVillages () {
			try{
				const params = {
					newsId: this.newsId,
					ids: this.ids
				}
				console.log('数据对象',params)
				const res = await get_choseVillages(params)
				console.log(res)
			}catch(e){
				//TODO handle the exception
				uni.showToast({
					icon: 'error',
					title: '请求失败'
				});
			}
		},		
		close() {
			this.ico = ''
		},
		// 选择图片
		selectImage () {
		  let that = this
		  uni.chooseImage({
		      count: 6, //默认9
		      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		      sourceType: ['album', 'camera'], //从相册选择
		      success: function (res) {
				  const tempFilePaths = res.tempFilePaths
				   uni.uploadFile({
					  url: uploadNewsImg,
					  filePath: tempFilePaths[0],
					  name: 'file',
					  header: {
						  'Authorization': token
					  },
					  success: (uploadFileRes) => {
						  const result = JSON.parse(uploadFileRes.data)
							that.ico = result.object
							console.log(that.ico)
							uni.showToast({
								icon:'success',
								title:"上传成功！"
							})
					  }
				  });
		      }
		  });
		}
	},
};
</script>

<style lang="scss">
.border {
	border-radius: 8rpx;
	height: 36px;
	background-color: white;
	border: 1px solid #dadbde;
}
.border-bottom {
	border-bottom: 1px solid #dadbde;
}
.margin {
	margin: 5px;
}
.font {
	font-size: 16px;
	font-family: 'Microsoft YaHei', arial, tahoma, \5b8b\4f53, sans-serif;
	font-weight: 500;
}
.close {
	position: absolute;
	top: 5px;
	right: 5px;
}
</style>
