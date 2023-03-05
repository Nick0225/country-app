import {
	RouterMount,
	createRouter,
	runtimeQuit
} from 'uni-simple-router';

//初始化
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routerErrorEach:({type,level,...args})=>{
		// #ifdef APP-PLUS
			if(type===3){
				router.$lockStatus=false;
				runtimeQuit();
			}
		// #endif
	},
	APP: {  
		  holdTabbar:false
	},
	routes: [
		...ROUTES,
	]
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	const token = uni.getStorageSync('token') || ''
	if (to.auth) {
		if (token) {
			return next()
		}
		return next('/pages/login/login')
	}
	
	if (token) {
		next('/pages/tabbar/index')
		return
	}
	next()
	
});
// 全局路由后置守卫
router.afterEach((to, from) => {})

export {
	router,
	RouterMount
}
