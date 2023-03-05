<template>
	<view>
	<!-- 头部用户信息 -->
		<view class="user-info">
			<view class="user-info-pic" v-if="this.info.image">
				<image :src="this.info.image" mode="" style="width: 100%;height: 100%;"></image>
			</view>
			<view v-else class="name">{{ name }}</view>
			<view class="user-info-text">
				<view class="flex">
					<view class="user-info-text-top">{{info.name}}</view>
					<view class="user-info-text-side">{{info.sex}}</view>
				</view>
				<view class="user-info-text-bottom">
					<text>{{info.address}}</text>
				</view>
			</view>
		</view>
		<view class="list">
			<view class="list-item">
				<view class="list-item-left">家庭地址</view>
				<view class="list-item-right">{{info.address}}</view>
			</view>
			<view class="list-item">
				<view class="list-item-left">职位</view>
				<view class="list-item-right">{{ info.role }}</view>
			</view>
			<view class="list-item">
				<view class="list-item-left">积分</view>
				<view class="list-item-right">{{info.integralSize}}</view>
			</view>
			<view class="list-item">
				<view class="list-item-left">手机号码</view>
				<view class="list-item-right">{{info.tel}}</view>
			</view>
			<view class="list-item">
				<view class="list-item-left">短号</view>
				<view class="list-item-right">{{info.tail}}</view>
			</view>
		</view>
		<view class="list-btn" v-if="(isMine * 1 == 0)"><button type="button" @click="handleClick">电话联系</button></view>
		<view class="list-btn" v-if="(isMine * 1 == 0)"><button type="button" @click="handleClickMessage">发送短信</button></view>
		<view class="list-btn" v-else><button type="button" @click="editInfo">修改资料</button></view>
	</view>
</template>

<script>
	import { get_currentuser_info, get_book_user } from '../../api/index.js'
export default {
	data() {
		return {
		  isMine: false,
		  info: {},
			name:''
		};
	},
	onLoad(e) {
		const  isMine = e.isMine * 1
		const id = e.id || ''
		this.isMine = new Boolean(isMine)
		this.id = id

		if (!id) {
			this.getUserInfo()
		} else {
			this.getUserBookInfo()
		}
	},
	methods: {
		// 获取用户详情
		async getUserInfo () {
			const res = await get_currentuser_info()
			if (res.data.code == 200) {
				const user_info = res.data.object.currentUserInfo || {}
				this.info = user_info
			} else {
				this.$u.toast(res.data.message)
			}
		},
		// 获取通讯录用户详情
		async getUserBookInfo () {
			console.log(this.id)
			const res = await get_book_user(this.id)
			console.log(res)
		    if (res.data.code == 200) {
					const user_info = res.data.object || {}
					this.info = user_info
			} else {
				this.$u.toast(res.data.message)
			}
			this.computedName()
		},
		// 马上联系
		handleClick() {
			let tel
			if (this.info.tail) {
				tel = this.info.tail
			} else {
				tel = this.info.tel
			}
			uni.makePhoneCall({
				phoneNumber: tel, //仅为示例
				fail(error) {
						uni.showToast({
							title:error
						})
				}
			});
		},
		// 短信联系
		handleClickMessage() {
			//#ifdef APP
			var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
				msg.to = [this.info.tel];
				msg.body = '';
				plus.messaging.sendMessage( msg );
			//#endif
		},
		// 编辑用户信息
		editInfo () {
		  this.$Router.replace('/pages/user/editor_info')
		},
		// 计算字符串长度
		calculatebyte( sTargetStr ) {
		     var sTmpStr, sTmpChar;
		     var nOriginLen = 0;
		     var nStrLength = 0;
		     
		     sTmpStr = new String(sTargetStr);
		     nOriginLen = sTmpStr.length;
		
		     for ( var i=0 ; i < nOriginLen ; i++ ) {
		       sTmpChar = sTmpStr.charAt(i);
		
		       if (escape(sTmpChar).length > 4) {
		               nStrLength += 2;
		       } else if (sTmpChar!='/r') {
		               nStrLength ++;
		       }
		     }
		     return nStrLength;
		   },
		// 计算名字
		computedName () {
			let length = this.calculatebyte(this.info.name)
			console.log(length)
			if (length == 6) {
				this.name = this.info.name.substr(1,2)
			} else if (length == 4) {
				this.name = this.info.name.substr(0,2)
			}
		},
	}
};
</script>

<style scoped lang="scss">
.name {
	width: 60px;
	height: 60px;
	color: #ffffff;
	font-size: 18px;
	font-weight: 900;
	background: #3c9cff;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20px;
}
.user-info {
	background: #ffffff;
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	padding: 14px 18px;
	box-sizing: border-box;
	.user-info-pic {
		width: 60px;
		height: 60px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20px;
		border-radius: 10px;
	}
	.user-info-text {
		.user-info-text-top {
			font-weight: 500;
			font-size: 20px;
			line-height: 23px;
			color: #333333;
			margin-bottom: 10px;
		}
		.user-info-text-side {
			font-weight: 500;
			font-size: 20px;
			line-height: 23px;
			color: #333333;
			margin-bottom: 10px;
			margin-left: 10px;
		}
		.user-info-text-bottom {
			text {
				font-size: 14px;
				line-height: 18px;
				color: #666666;
				margin-right: 10px;
			}
		}
	}
}
.list {
	.list-item {
		background: #ffffff;
		height: 48px;
		display: flex;
		align-items: center;
		margin-bottom: 1px;
		padding: 0 15px;
		box-sizing: border-box;
		position: relative;
		&:last-child {
			margin-bottom: 0px;
		}
		&:active {
			background: #f2f3f4;
		}
		&.show-icon {
			&::after {
				content: '';
				position: absolute;
				width: 5px;
				height: 10px;
				top: 20px;
				right: 15px;
				// background: url(../../static/more.png) no-repeat;
			}
		}
		.list-item-left {
			font-size: 16px;
			color: #666666;
			width: 100px;
		}
		.list-item-right {
			font-size: 14px;
			color: #000000;
			flex: 1;
		}
	}
}
.list-btn {
	padding: 0 20px;
	box-sizing: border-box;
	margin-top: 15px;
	button {
		height: 48px;
		background: linear-gradient(270deg, #55bafe -0.03%, #3072ff 100%);
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
		border-radius: 24px;
		color: #ffffff;
		font-weight: bold;
		font-size: 18px;
		outline: none;
		border: none;
		&:active {
			opacity: 0.9;
		}
	}
}
</style>
