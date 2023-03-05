<template>
	<view>
		<view class="margin border-bottom">
			<u--textarea v-model="title" placeholder="请输入标题:" height="40rpx" ></u--textarea>
		</view>
		<view>
			<u--textarea class="border margin"v-model="descb" placeholder="请输入通知内容:" count style="height: 300rpx;" ></u--textarea>
			</view>
		<view class="margin border">
			<text class="font margin flex flexHc" v-model="institutions">通知机构：{{ institutions }}</text>
		</view>
		<!-- 上传图片 -->
	<view class="margin" @click="selectImage" style=" width: 100px; height: 100px; border: #dadbde 1px solid;padding: 5px;">
		<image src="../../static/images/upload.png" mode="" style="width: 90px; height: 90px;"></image>
	</view>
		<!-- 图片展示 -->
		<view class="margin" v-if="this.img" style="width: 365px;position: relative;">
			<img :src="this.img" alt="" style="height: 100%;width: 100%;">
			<u-icon class="close" name="close" color="#ffffff" @click="close"></u-icon>
		</view>
		<view class="margin"><u-button type="primary" @click="postAddNotice" style="margin-top: 10px;">确认发布</u-button></view>
		<view class="tips margin" v-if="this.user_info.role == '乡长'">
			<text>(您的权限为乡长，发布通知仅乡下各村村长可接收)</text>
		</view>
		<view class="tips margin" v-if="this.user_info.role == '村长'">
			<text>(您的权限为村长，发布通知村下所有村民可接收)</text>
		</view>
	</view>
</template>

<script>
import { post_addNotice } from '../../api/index.js';
import { uploadNoticeImg } from '../../utils/config.js'
import { mapState } from 'vuex';

const token = uni.getStorageSync('token')

export default {
	data() {
		return {
			title: '',
			descb: '',
			img:'',
			institutions:'',
		};
	},
	mounted () {
		this.checkRole()
	},
	computed: {
		...mapState(['user_info']),
		
	},
	methods: {
		// 发送通知
		async postAddNotice () {
			try{
				const notice = {
					"descb": this.descb,
					"img": this.img,
					"institutions": this.institutions,
					"views": 0,
					"title":this.title
				}
				if (notice.descb.length == 0 || notice.title.length == 0) {
					uni.showToast({
						icon: 'error',
						title: '请填写内容！'
					});
					return
				}
				console.log(notice)
				const res = await post_addNotice(notice)
				console.log(res)
				if (res.data.code == 200) {
					uni.showToast({
						icon: 'success',
						title: '发布成功'
					});
					this.$Router.push('/pages/tabbar/information');
				} else {
					this.$u.toast(res.data.message)
				}
			}
			catch(e){
				//TODO handle the exception
				uni.showToast({
					icon: 'error',
					title: '请求失败'
				});
			}
		},
		close() {
			this.img = ''
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
					  url: uploadNoticeImg,
					  filePath: tempFilePaths[0],
					  name: 'file',
					  header: {
						  'Authorization': token
					  },
					  success: (uploadFileRes) => {
						  const result = JSON.parse(uploadFileRes.data)
							that.img = result.object
							uni.showToast({
								icon:'success',
								title:"上传成功！"
							})
					  }
				  });
		      }
		  });
		},
		// 身份验证
		checkRole () {
			if (this.user_info.role == '乡长') {
				this.institutions = this.user_info.townshipName
			} else if (this.user_info.role == '村长') {
				this.institutions = this.user_info.villageName
			} else {
				return
			}
		},
	}
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
.tips {
	margin-top: 10px;
	font-size: 14px;
	color: #909399;
}
.close {
	position: absolute;
	top: 5px;
	right: 5px;
}
</style>
