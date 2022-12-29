<template>
	<view class="page">
		<view class="uni-header uhead" >
			<view class="uni-group" >
				<uni-easyinput class="left" prefixIcon="search" v-model="query" placeholder="搜索联系人" @confirm="search"
					@iconClick="search"></uni-easyinput>
				<view class="right" @click="fabClick" v-if="ContactsAdd">
					<image class="add-image" src="/static/txl/btn_add_@3x.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<uni-list class="uhead" :border="false">
			<uni-list-item :title="department" :ellipsis="0" :ltextclass="0" />
		</uni-list>
		<view class="container" v-show="userData!=''||departmentData!=''">
			<uni-list :border="true" v-if="userData">
				<uni-list-item v-for="(item, index) in userData" :key="index" showArrow
					:thumb="item.avatar?item.avatar:'/static/txl/ico_logo_@3x.png'" thumb-size="base"
					:title="item.nickname" :ellipsis="0" :note="item.post" :ntextclass="1" :clickable="true"
					@click="handleItemClick(item._id)" />
			</uni-list>
			<uni-list :border="false" v-if="departmentData">
				<uni-list-item v-for="(item, index) in departmentData" :key="index" :leftText="item.percount"
					:ltextclass="0" :rtextclass="0" showArrow :title="item.name" :ellipsis="0" :clickable="true"
					@click="depClick(item._id,item.name,item.percount)" />
			</uni-list>
		</view>
		<uni-load-more class="load-more" :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
	</view>
</template>

<script>
	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = 'create_date desc'
	const dbSearchFields = ['username'] // 支持模糊搜索的字段列表
	const dbCollectionName = 'uni-id-users';
	export default {
		data() {
			return {
				ContactsAdd: '',
				loading: '',
				hasMore: '',
				department: '查询结果',
				percount: '',
				departmentData: [],
				userData: [],
				department_id: '',
				pic: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png',
				query: '',
				where: '',
				qwhere: '',
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onLoad(e) {
			  let departmentInfo =  this.$store.state.departmentInfo
			  if(departmentInfo){
				if (departmentInfo.name) {
				  this.department = departmentInfo.name;
				}
				if (departmentInfo.percount) {
				  this.percount = departmentInfo.percount;
				}
				this.department_id = departmentInfo.department_id
				this.getDepartment(departmentInfo.department_id);
				this.getUser(departmentInfo.department_id);
			  }
			  if (e.search == "true") {
				this.query = e.query
				this.getSearch(e.query)
			} 
			if (uni.getStorageSync('userInfo').role == 'admin') {
				this.ContactsAdd = true;
			}
		},
		onPullDownRefresh() {
		},
		onReachBottom() {
		},
		methods: {
			getDepartment(id) {
				const parent_id = id
				db.collection("opendb-department").where({
						'parent_id': id
					}).orderBy("sort asc").get()
					.then((res) => {
						this.departmentData = res.result.data;
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {

					})
			},
			getUser(id) {
				var _this = this;
				const parent_id = id
				db.collection("uni-id-users").where({
						'department_id': id
					}).field("username,nickname,name,department_id,post,mobile,email,avatar").get()
					.then((res) => {
						let userList = res.result.data;
						let listArr = [];
						userList.forEach(ele => {
							let obj = {};
							obj._id = ele._id;
							obj.avatar = ele.avatar;
							obj.post = ele.post;
							if (ele.nickname != undefined) {
								obj.nickname = ele.nickname;
							} else {
								obj.nickname = '用户 (' + ele.username + ')';
							}
						
							listArr.push(obj);
						});
						this.userData = listArr;
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {})
			},
			back() {
				uni.navigateBack({})
			},
			search() {
				this.$store.state.departmentInfo={}
				const query = this.query.trim()
				if (!query) {
					query = ''
				}
				uni.redirectTo({
					url: './list2?search=true&query=' + query
				})
			},
			getSearch(query) {
				var _this = this;
				db.collection("uni-id-users").where({
						'nickname': new RegExp(query)
					}).field("username,nickname,name,department_id,post,mobile,email,avatar").get()
					.then((res) => {
						let userList = res.result.data;
						let listArr = [];
						userList.forEach(ele => {
							let obj = {};
							obj._id = ele._id;
							obj.avatar = ele.avatar;
							obj.post = ele.post;
							if (ele.nickname != undefined) {
								obj.nickname = ele.nickname;
							} else {
								obj.nickname = '用户 (' + ele.username + ')';
							}

							listArr.push(obj);
						});
						this.userData = listArr;
					}).catch((err) => {
						uni.showModal({
							content: err.message || '请求服务失败',
							showCancel: false
						})
					}).finally(() => {})
			},
			loadData(clear = true) {
			},
			depClick(department_id, name, percount) {
				this.$store.state.departmentInfo ={
					department_id:department_id,
					name:name,
					percount:percount
				}
				let url = './list2';
				uni.navigateTo({
					url: url
				})
			},
			handleItemClick(id) {
				uni.navigateTo({
					url: './detail?id=' + id
				})
			},
			fabClick() {
				// 打开新增页面
				uni.navigateTo({
					url: './add',
					events: {
						// 监听新增数据成功后, 刷新当前页面数据
						refreshData: () => {
						}
					}
				})
			}
		}
	}
</script>

<style>
.load-more{
	background-color: #F7F8FA;
}


</style>
