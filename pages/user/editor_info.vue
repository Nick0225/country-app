<template>
	<view>
       <view class="infoItem flex flexVc" @click="selectImage">
       	   <view class="name">
       	   	  头像 <text style="color: #999;">(点击更换)</text>
       	   </view>
		   <view class="image_box flex flexHc">
		   	   <image v-if="(user_info.image)" :src="user_info.image" mode=""></image>
			   <image v-else src="../../logo.png" mode=""></image>
		   </view>
       </view>
	</view>
</template>

<script>
  import { mapState } from 'vuex'
  import { edit_user_info } from '@/api/index.js'
  import { uploadImage } from '@/utils/config.js'
  
  const token = uni.getStorageSync('token')
export default {
	data() {
		return {
			fileList: [],
			show: false,
			info: {
				name: '',
				address: ''
			}
		};
	},
	computed: {
		...mapState(['user_info'])
	},
	methods: {
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
					  url: uploadImage, //仅为示例，非真实的接口地址
					  filePath: tempFilePaths[0],
					  name: 'file',
					  header: {
						  'Authorization': token
					  },
					  success: (uploadFileRes) => {
						  const result = JSON.parse(uploadFileRes.data)
						  const image = result.object
						  const params = {
							  tel: that.user_info.tel,
							  updateUserinfoVo: {image}
						  }
						  const res = edit_user_info(params).then((res) => {
								console.log(res)
							  if (res.data.code == 200) {
								  that.$store.dispatch('getUserinfo')
							  } else {
									this.$u.toast(res.data.message)
								}
						  })												  
					  }
				  });
		      }
		  });
	  }
	}
};
</script>

<style lang="scss" scoped>
 .infoItem {
	 background-color: #FFFFFF;
	 padding: 0 28rpx;
	 height: 148rpx;
	 justify-content: space-between;
	 .image_box {
		 width: 100rpx;
		 height: 100rpx;
		 border-radius: 24rpx;
		 background-color: #1890ff;
		 border-radius: 24rpx;
		 image {
			 width: 100%;
			 height: 100%;
			 border-radius: 24rpx;
		 }
	 }
 }
</style>
