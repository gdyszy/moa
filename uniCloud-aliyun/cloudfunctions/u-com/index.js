'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', JSON.stringify(event))//从当前目录的配置运行参数传入
	
	//增
	// function add(){
	// 	const collection = db.collection('unicloud-test') // 获取表'unicloud-test'的集合对象
	// 	let res = await collection.add({ //往表里新增一条数据
	// 		'username':"blue"
	// 	})
	// }
	
	//删
	// const docList = await collection.limit(1).get() //获取第一条记录
	// if (!docList.data || docList.data.length === 0) {
	// 	return {
	// 		status: -1,
	// 		msg: '集合unicloud-test内没有数据'
	// 	}
	// }
	// const res = await collection.doc(docList.data[0]._id).remove()
	// if (res.deleted === 1) {
	// 	return {
	// 		status: 0,
	// 		msg: '成功删除unicloud-test内第一条数据'
	// 	}
	// } else {
	// 	return {
	// 		status: -2,
	// 		msg: '删除数据失败'
	// 	}
	// }
	
	//改
	// const docList = await collection.limit(1).get();
	// if (!docList.data || docList.data.length === 0) {
	// 	return {
	// 		status: -1,
	// 		msg: '集合unicloud-test内没有数据'
	// 	}
	// }
	// const res = await collection.doc(docList.data[0]._id).update(event);
	// if (res.updated === 1) {
	// 	let result = Object.assign({}, { //Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）
	// 		_id: docList.data[0]._id
	// 	}, event)
	// 	return {
	// 		status: 0,
	// 		msg: `集合第一条数据由${JSON.stringify(docList.data[0])}修改为${JSON.stringify(result)}`
	// 	}
	// } else {
	// 	return {
	// 		status: -1,
	// 		msg: `集合unicloud-test内没有数据`
	// 	}
	// }
	
	//查 获取分页
	// let res1 = await db.collection('book').where({
	//   status: "onsale",
	//   })
	//   .skip(1) // 跳过前1条
	//   .limit(20) // 获取20条
	//   .get()
	
	//获取时间
	//获取偏移后的Date对象，例如utc+x时offset就传x
	// function getOffsetDate (offset) {
	//   return new Date(
	//     Date.now() + (new Date().getTimezoneOffset() + (offset || 0) * 60) * 60000
	//   )
	// }
	// const res1 = getOffsetDate(8).getHours() //获取utc+8的小时数
	// console.log("------getOffsetDate--------"+res1)
	// 推荐使用<uni-dateformat>组件格式化显示日期
	
	//select * from book where title="西游记"
	//nosql > gt、< lt、== eq、或 or、并 and
	// let res1 = await db.collection('book').where({
	//   title: '西游记'
	// }).get()
	// console.log("----------:"+res1.data[0].author)
	
	//返回数据给客户端
	return res1 // 返回json给客户端
};
