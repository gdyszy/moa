'use strict';
const db = uniCloud.database();
const dbCmd = db.command
const collectionDB = db.collection('opendb-department')
exports.main = async (event, context) => {
	try {
		var data = event.data
		var name = event.name

		// 部门查询
		if (name == "getList") {
			if (data != undefined) {
				let obj = {}
				if ('id' in data && data.id != "") {
					obj['id'] = new RegExp(data.id)
				}
				if ('name' in data && data.name != "") {
					obj['name'] = new RegExp(data.name)
				}
				let res = await collectionDB.where(obj).get()
				return res
			} else {
				let res = await collectionDB.orderBy('_id', 'asc').get({getTree: true})
				return res
			}
		} else {
			uniCloud.logger.log("false")
		}
	} catch (e) {

	}
};
