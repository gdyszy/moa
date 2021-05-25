const {
	Controller
} = require('uni-cloud-router')
const uniID = require('uni-id')
module.exports = class newSortController extends Controller {
	async remove() {
		
		const {
			id
		} = this.ctx.data
		return uniID.deletenewSort({
			newSortID: id
		})
	}
}
