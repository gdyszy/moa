'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	try {
		var data = event.data
		var name = event.name
		if (name == "bannerGet") {
			const res = db.collection('opendb-banner').where({"status":true}).get()
			return res
		}
		else if (name == "noticeGet") {
			const res = db.collection('opendb-news-articles').where({"article_status":1}).get()
			return res
		}
		else if (name == "noticeInfoGet") {
			const res = db.collection('opendb-news-articles').where({_id:data }).get()
			return res
		}
		else {
			uniCloud.logger.log("false")
		}
	} catch (e) {
	
	}
};
