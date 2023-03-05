<template>
	<view>
		<view class="info border" >
			<text class="font margin flex flexHc" style="margin-bottom: 10px;">上报人信息</text>
			<view class="margin border-bottom">
				<text class="font margin flex ">姓名：{{ user_info.name }}</text>
			</view>
			<view class="margin border-bottom">
				<text class="font margin flex ">联系方式：{{ user_info.tel }}</text>
			</view>
			<view class="margin border-bottom">
				<text class="font margin flex">所在村：{{ user_info.villageName }}</text>
			</view>
			<view>
		</view>
			</view>
			<u--textarea class="border margin "v-model="descb" placeholder="请输入上报内容:" count style="height: 300rpx;" ></u--textarea>
		<!-- 上传图片 -->
		<view class="margin" @click="selectImage" style=" width: 100px; height: 100px; border: #dadbde 1px solid;padding: 5px;">
			<image src="../../static/images/upload.png" mode="" style="width: 90px; height: 90px;"></image>
		</view>
		<!-- 图片展示 -->
		<view class="margin" v-if="this.ico" style="width: 365px;position: relative;">
			<img :src="this.ico" alt="" style="height: 100%;width: 100%;">
			<u-icon class="close" name="close" color="#ffffff" @click="close"></u-icon>
		</view>
		<view class="margin"><u-button type="primary" @click="postAddNotice" style="margin-top: 10px;">确认上报</u-button></view>
	</view>
</template>

<script>
import { post_verport } from '../../api/index.js';
import { uploadNoticeImg } from '../../utils/config.js'
import { mapState } from 'vuex';

const token = uni.getStorageSync('token')

export default {
	data() {
		return {
			descb: '',
			ico:'',
		};
	},
	computed: {
		...mapState(['user_info']),
		
	},
	methods: {
		// 上报信息
		async postAddNotice () {
				const params = {
					"descb": this.descb,
					"ico": this.ico,
					
					"villageName": this.user_info.villageName,
					"tel": this.user_info.tel,
					"name":this.user_info.name
				}
				if (params.descb == '') {
					uni.showToast({
						icon: 'error',
						title: '请填写内容！'
					});
					return
				}
				console.log(params)
				const res = await post_verport(params)
				console.log(res)
				if (res.data.code == 200) {
					uni.showToast({
						icon: 'success',
						title: '上报成功'
					});
					this.$Router.push('/pages/tabbar/information');
				} else {
					this.$u.toast(res.data.message)
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
					  url: uploadNoticeImg,
					  filePath: tempFilePaths[0],
					  name: 'file',
					  header: {
						  'Authorization': token
					  },
					  success: (uploadFileRes) => {
						  const result = JSON.parse(uploadFileRes.data)
							that.ico = result.object
							uni.showToast({
								icon:'success',
								title:"上传成功！"
							})
					  }
				  });
		      }
		  });
		},
	}
};
</script>

<style lang="scss">
.border {
	border-radius: 8rpx;
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
.info {
	margin: 5px;
	padding: 5px;
}
.close {
	position: absolute;
	top: 5px;
	right: 5px;
}
</style>
