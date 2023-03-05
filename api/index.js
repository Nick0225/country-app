import request from '../utils/request.js'

// token 是否过期
export const IstokenOut = (params) => {
	return request.get('/user/getTokenIsExprie')
}

// 登录
export const user_login = (params) => {
	return request.post(`/login?username=${params.username}&password=${params.password}`)
}

// 获取手机验证码
export const get_phone_code = (params) => {
	return request.get(`/user/getViliCode/${params}`)
}

// 注册
export const user_register = (params) => {
	return request.post('/user/addUserInfo', params)
}

// 忘记密码
export const reset_password = (params) => {
	return request.put(`/user/updatePasswordAPP/${params.tel}`,params.info)
}

// 获取轮播图数据
export const get_home_banner = (params) => {
	return request.get(`/picture/getPictures/${params.currentPage}/${params.pageSize}`)
}

// 获取外链图标
export const get_home_link = (params) => {
	return request.get(`/href/findHref/${params.currentPage}/${params.pageSize}`)
}

// 获取公益列表
export const get_puliicw_list = (params) => {
	return request.get(`/welfare/getWelfare/${params.currentPage}/${params.pageSize}`)
}

// 获取公益详情
export const get_pulicw_details = (id) => {
	return request.get(`/welfare/getOneWelfare/${id}`)
}

// 获取通讯录列表
export const get_phonebook_list = (params) => {
	return request.get('/contact/getContact', { params })
}

// 获取指定商家核销记录
export const get_business_record = (tel) => {
	return request.get(`/integral/getOpration/${tel}`)
}

// 获取当前村的核销店铺
export const get_cancell_stroe = (params) => {
	return request.get('/user/getShop')
}

// 获取用户积分记录
export const get_code_record = (info) => {
	return request.get(`/integral/getIntegralOfOptions/${info.params.currentPage}/${info.params.pageSize}?tel=${info.tel}`)
}

// 获取当前用户信息
export const get_currentuser_info = (params) => {
	return request.get('/user/getUserInfo')
}

// 获取单个用户信息
export const get_one_user = (tel) => {
	return request.get(`/user/getUserBytel/${tel}`)
}

// 获取通讯录信息
export const get_book_user = (id) => {
	return request.get(`/contact/getUserInfo/${id}`)
}

// 用户核销
export const user_cancelltion = ({userId, integralOptionVo}) => {
	return request.put(`/integral/optionsIntegral/${userId}`, { ...integralOptionVo })
}

// 修改用户信息
export const edit_user_info = ({tel, updateUserinfoVo}) => {
	return request.put(`/user/updateUserInfo/${tel}`, { ...updateUserinfoVo })
}

// 获取版本信息
export const get_now_version = (params) => {
	return request.get('version/getVersion/1/1')
}

// 退出登录
export const login_out = (params) => {
	return request.get()
}



// 选择公告接收村
export const get_choseVillages = (obj) => {
	//									 /news/choseVillages/1？ids=1,2,3,..
	return request.get(`/news/choseVillages/${obj.newsId}?ids=${obj.ids}`)
}

// 发布全村公告
export const post_addNews = (obj) => {
	return request.post('/news/addNews',obj)
}

// 获取公告
export const get_news_list = (params) => {
	return request.get('/news/getNews')
}

// 获取公告详情
export const get_news_details = (newsId) => {
	return request.get(`/news/getOneNews/${newsId}`)
}

// 获取地图节点
export const get_groupDec = (groupName) => {
	return request.get(`/groupDec/getNode/${groupName}`)
}


// 添加通知
export const post_addNotice = (params) => {
	return request.post('/notice/addNotice',params)
}

// 获取本村通知页的消息
export const get_notice_list = () => {
	return request.get('/notice/findNotice')
}

// 获取通知的详情
export const get_notice_details = (noticeId) => {
	return request.get(`/notice/getOneNotice/${noticeId}`)
}

// 获取通讯录指定用户信息
export const get_userInfo_Byname = (params) => {
	return request.get(`/user/getUserByName?param=${params}`)
}

// 新用户注册
export const post_addNewUser = (params) => {
	return request.post('/noCon/addUser',params)
}

// 获取商家核销总积分
export const get_integral = (tel) => {
	return request.get(`/integral/getShopNum/${tel}`)
}

// 获取客服列表
export const get_server = (params) => {
	return request.get(`/server/getServers/${params.currentPage}/${params.pageSize}`)
}

// 村民上报
export const post_verport = (params) => {
	return request.post('/vreport/uploadNews',params)
}

// 获取村民上报
export const get_verport = (params) => {
	return request.get(`/vreport/getUploadNews?villageName=${params}`)
}

// 获取指定用户上报
export const get_verportByName = (name) => {
	return request.get(`/vreport/getUploadByname/${name}`)
}

// 查看指定上报详情
export const get_reportNewById = (id) => {
	return request.get(`/vreport/getReportNewById/${id}`)
}
