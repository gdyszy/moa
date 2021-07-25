import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
//统一提示
global.show_nativeUI_toast = function(msg, icontype = 'success'){
	const iconTypeUrl = {
	    error: '/static/toast-image/warn.png',
	    success: '/static/toast-image/success.png',
	    warn: '/static/toast-image/warn.png'
	}
	uni.showToast({
	    title: msg,
		image: iconTypeUrl[icontype]
	})
}
//判断token 是否有效
Vue.prototype.checkToken = function(callback) {
	let uniIdToken = uni.getStorageSync('uni_id_token')
	if (uniIdToken) {
		uniCloud.callFunction({
			name: 'user-center',
			data: {
				action: 'checkToken',
			},
			success: (e) => {
				if (e.result.code == 0) {
					callback(true)
				}else{
					callback(false)
					uni.showToast({
						title:"登录信息过期，请重新登录！",
						icon:'none'
					})
					const value = uni.getStorageSync('launchFlag');
					// #ifdef APP-PLUS
					if (value) {
						// launchFlag=true直接跳转到首页
						uni.reLaunch({
							url: '/pages/login/login'
						});
					} else {
						uni.reLaunch({
							url: '/pages/index/loading'
						});
					}
					// #endif
					// #ifdef  MP||H5
					uni.reLaunch({
						url: '/pages/login/login'
					});
					// #endif
				}
			},
			fail(e) {
				uni.showModal({
					content: JSON.stringify(e),
					showCancel: false
				})
			}
		})
	}else{
		callback(false)
		const value = uni.getStorageSync('launchFlag');
		// #ifdef APP-PLUS
		if (value) {
			// launchFlag=true直接跳转到首页
			uni.reLaunch({
				url: '/pages/login/login'
			});
		} else {
			uni.reLaunch({
				url: '/pages/index/loading'
			});
		}
		// #endif
		// #ifdef  MP||H5
		uni.reLaunch({
			url: '/pages/login/login'
		});
		// #endif
	}
	
};

//判断昵称是否存在
Vue.prototype.checkNickname = function(callback) {
	let nickname = uni.getStorageSync('userInfo').nickname
	let uid = uni.getStorageSync('userInfo')._id
	if (nickname) {
		callback(true)
	}else{
		callback(false)
		uni.showToast({
			title:"请维护个人信息！",
			icon:'none'
		})
		
		setTimeout(function() {
		    uni.redirectTo({
		    	url: '/pages/contacts/edit?id=' + uid
		    });
		}, 1000);
	}
	
};