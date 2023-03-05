import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { get_currentuser_info } from '@/api/index.js'

const store = new Vuex.Store({
	state: {
		user_info: {}
	},
	mutations: {
	   // 设置用户登录
	   setInfo (state, info) {
	      state.user_info = info
	   },
	},
	actions: {
	  async getUserinfo ({commit, state}) {
		const res = await get_currentuser_info()  
		const user_info = res.data.object.currentUserInfo || {}
		try{
			uni.setStorageSync('user_info', JSON.stringify(user_info))
			commit('setInfo', user_info)
		}catch(e){
			uni.showToast({
				icon: 'none',
				title: '存取本地数据失败'
			})
		}
					
	  }
	}
})

export default store
