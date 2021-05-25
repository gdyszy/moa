const {
	Controller
} = require('uni-cloud-router')
const uniID = require('uni-id')
module.exports = class UserController extends Controller {
	async login() {
		const {
			username,
			password,
			captchaText,
			captchaOptions
		} = this.ctx.data
		// uniCloud-aliyun/cloudfunctions/uni-admin/service/user.js
		return this.service.user.login({
			username,
			password,
			captchaText,
			captchaOptions
		})
	}

	async register() {
		const {
			username,
			password
		} = this.ctx.data
		const admin = await this.service.user.hasAdmin()  //uni-admin/service/user.js/hasAdmin() 检查数据库是否存在超级管理员
		if (admin) {
			return {
				code: 10001,
				message: '超级管理员已存在，请登录...'
			}
		}
		return uniID.register({ //uni id 注册API
			username,
			password,
			role: ["admin"]
		})
	}

	async logout() {
		return this.service.user.logout(this.ctx.event.uniIdToken)
	}

	async createCaptcha() {
		return await this.service.user.createCaptcha(this.ctx.data)
	}

	async getNeedCaptcha() {
		//uni-admin/service/user.js/getNeedCaptcha() 
		// 查询是否在 {2小时} 内 {前2条} 有 {登录失败} 数据，来确定是否需要验证码
		return await this.service.user.getNeedCaptcha(this.ctx.data) 
	}
}
