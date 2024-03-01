<template>
	<view class="content">
		<view class="flap">
			<view class="flap-sw">
				<swiper class="mswiper menuList" :indicator-dots="idots">

					<swiper-item>
						<uni-grid :column="uColumn" :show-border="false" :highlight="true" @change="change">
							<uni-grid-item v-show="index < dindex" v-for="(item, index) in menuList" :index="index"
								class="grid-item-sw" :key="index">
								<view class="grid-item-box" :style="{'backgroundColor':item.color}">
									<view class="image_box">
										<image :src="item.imgUrl" class="image image-sw" mode="aspectFill" />
										<view class="remind" v-if="item.name == '工作通知' && recordCount!=''">
											{{recordCount}}
										</view>
									</view>
									<text class="text">{{ item.name }}</text>
								</view>
							</uni-grid-item>
						</uni-grid>
					</swiper-item>

					<swiper-item v-if="sitem">
						<uni-grid :column="uColumn" :show-border="false" :highlight="true" @change="change">
							<uni-grid-item v-show="index > dindex-1" v-for="(item, index) in menuList" :index="index"
								class="grid-item-sw" :key="index">
								<view class="grid-item-box" :style="{'backgroundColor':item.color}">
									<view class="image_box">
										<image :src="item.imgUrl" class="image image-sw" mode="aspectFill" />
										<view class="remind" v-if="item.name == '工作通知' && recordCount">
											{{recordCount}}
										</view>
									</view>
									<text class="text">{{ item.name }}</text>

								</view>
							</uni-grid-item>
						</uni-grid>
					</swiper-item>

				</swiper>
			</view>
		</view>
		<view style="padding: 0 14px;">
			<swiper class="swiper-sw" :indicator-dots="false" :autoplay="true" :interval="5000" :duration="500">
				<swiper-item v-for="(i,index) in bannerList" :key="index" @click="openLink(i.open_url)">
					<image class="banner" :src="i.bannerfile.url">
				</swiper-item>
			</swiper>
		</view>

		<view class="notice">
			<view class="notice_head">
				<span class="notice_head_title">通知消息</span>
				<image src="@/static/workOverTime/btn_message.png" style="width: 24px;height: 24px;"
					@click="routeUrl('../notice/notice')">
			</view>
		</view>
		<view class="notice_body" v-for="(item, i) in noticeList" :key="i">
			<view v-show="i<10">
			<view  class="notice_body_text" @click="routeUrl('../notice/notice_info?id='+item._id)">
				<view class="notice_body_text_title">{{item.title}}</view>
				<view class="notice_body_text_content">{{item.content}}</view>
			</view>
			<hr v-show="i!=noticeList.length-1" />
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [
					{
						name: "工作通知",
						imgUrl: require("@/static/ico_daiban.png"),
						route: "/pages/daiban/index",
					},
					{
						name: "公文管理",
						imgUrl: require("@/static/ico_gongwen.png"),
						route: "/pages/gongwen/index1",
					},
					{
						name: "加班",
						imgUrl: require("@/static/ico_workOvertime.png"),
						route: "/pagesOA/workOvertime/index",
					},
					{
						name: "请假",
						imgUrl: require("@/static/ico_leave.png"),
						route: "/pagesOA/leave/index",
					},
					{
						name: "出差",
						imgUrl: require("@/static/ico_travel.png"),
						route: "/pagesOA/travel/index",
					},
					{
						name: "外出",
						imgUrl: require("@/static/ico_goOut.png"),
						route: "/pagesOA/goOut/index",
					},
					{
						name: "考勤打卡",
						imgUrl: require("../../static/ico_sign.png"),
						route: "/pagesOA/sign/index",
					},
					{
						name: "补卡申请",
						imgUrl: require("@/static/ico_patchCard.png"),
						route: "/pagesOA/patchCard/index",
					},
					{
						name: "日志",
						imgUrl: require("@/static/ico_daily.png"),
						route: "/pagesOA/daily/index",
					},
					{
						name: "日志统计",
						imgUrl: require("@/static/ico_dailyRecord.png"),
						route: "/pagesOA/dailyRecord/index",
					},
					{
						name: "资产管理",
						imgUrl: require("@/static/ico_daily.png"),
						route: "/pagesOA/property/index1",
					},	{
						name: "用车申请",
						imgUrl: require("@/static/ico_daiban.png"),
						route: "/pagesOA/car/index",
					},
					// 	{
					// 	name: "用车审批",
					// 	imgUrl: require("@/static/ico_daiban.png"),
					// 	route: "/pagesOA/carExamine/index",
					// },
				],
				bannerList: [],
				noticeList: [],
				uColumn: 4,
				dindex: 8,
				sitem: true,
				idots: true,
				recordCount: "",
				recordList: "",
				formData: {
					user_id: uni.getStorageSync("username"),
				},
			};
		},
		onLoad() {
			this.checkToken((res) => {
				//判断token 是否有效
				if (res == true) {
					this.getInit();
					this.getRemind();
				} else {}
			});
		},
		onShow() {
			this.getRemind();
			this.getSystemInfo();
		},

		mounted() {
			// 注意，这里要用个变量存this，不然进到getSystemInfo后this指向会变化，找不到data变量
		},
		methods: {
			openLink(link){
				if(link==''){
					return false
				}
			let p = encodeURIComponent(link)
			uni.navigateTo({
				url: `/pages/webview/index?path=${p}`
			})	
			},
			onPullDownRefresh(){
				this.getRemind();
				this.getSystemInfo();
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			getSystemInfo() {
				var _this = this;
				let Height = uni.getSystemInfoSync().screenHeight;
				let Width = uni.getSystemInfoSync().screenWidth;
				if (Width >= 500) {
					_this.uColumn = 6
					_this.dindex = 12
					_this.sitem = false
					_this.idots = false
				}
				if (Width >= 1000) {
					_this.uColumn = 8
					_this.dindex = 8
					_this.sitem = true
					_this.idots = true
				}
				if (Width >= 1200) {
					_this.uColumn = 11
					_this.dindex = 10
					_this.sitem = true
					_this.idots = true
				}
			},
			//获取代办数量
			getRemind() {
				uniCloud
					.callFunction({
						name: "gongwen",
						data: {
							name: "gwGetDBNum",
							data: this.formData,
						},
					})
					.then((res) => {
						if (res.result.affectedDocs >= 0 && res.result.affectedDocs <= 99) {
							this.recordCount = res.result.affectedDocs
						} else if (res.result.affectedDocs > 99) {
							this.recordCount = '99+'
						}
					});
			},

			change(e) {
				this.routeUrl(this.menuList[e.detail.index].route);
			},
			getInit() {
				this.getBanner();
				this.getNoticeList();
			},
			routeUrl(url) {
				uni.navigateTo({
					url: url,
				});
			},
			getBanner() {
				uniCloud
					.callFunction({
						name: "get",
						data: {
							name: "bannerGet",
						},
					})
					.then((res) => {
						this.bannerList = res.result.data;
					});
			},
			getNoticeList() {
				uniCloud
					.callFunction({
						name: "get",
						data: {
							name: "noticeGet",
						},
					})
					.then((res) => {
						this.noticeList = res.result.data;
					});
			},
		},
	};
</script>


<style lang="scss" scoped>
	.content {
		width: 100%;
		background-color: #fff;
		padding: 0;
	}

	.flap {
		/* border: 1px solid #2A6DF2; */
		border-bottom-right-radius: 350px 50px;
		border-bottom-left-radius: 350px 50px;
		background: url(https://mp-ee288b07-dd0c-4a04-b7c0-3b41a5aa55eb.cdn.bspapp.com/cloudstorage/662d9194-d87a-4267-be80-efbbb1e135df.png);
		background-size: contain;
		height: 564rpx;
		margin-bottom: 55px;
	}

	.flap-sw {
		margin: 224rpx 28rpx 20rpx;
	}

	.swiper-sw {
		height: 172rpx;
	}

	.image {
		width: 100rpx;
		height: 100rpx;
	}

	.swiper-item {
		width: 100%;
		height: 200px;
	}

	.mswiper {
		height: 400rpx;
	}



	.text {
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.swiper {
		height: 200px;
		margin-top: 60px;
	}


	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		// justify-content: center;
		padding: 30rpx 30rpx;
	}

	.remind {
		position: absolute;
		z-index: 9999;
		right: -24rpx;
		top: -24rpx;
		width: 50rpx;
		line-height: 50rpx;
		color: #fff;
		text-align: center;
		background-color: #ee0000;
		font-size: 28rpx;
		border-radius: 50%;
		padding: 5rpx;
	}
	@media screen and (min-width: 500px) {
		.grid-item-sw {
			height: 140px;
			width: 140px;
		}

		.swiper-item {
			width: 100%;
			height: 260px;
			/* #ifdef MP */
			height: 280px;
			/* #endif */
		}

		.text {
			font-size: 16px;
			margin-top: 10rpx;
		}

		.mswiper {
			height: 260px;
			/* #ifdef MP */
			height: 280px;
			/* #endif */
		}

		.image-sw {
			width: 60px;
			height: 60px;
		}

		.swiper-sw {
			height: 172px;
		}

		.flap-sw {
			margin: 115rpx 28rpx 20rpx;
		}

		.flap {
			height: 300px;
			margin-bottom: 100px;
			/* #ifdef MP */
			margin-bottom: 120px;
			/* #endif */
		}

		.grid-item-box {
			padding: 25px 25px;
			/* #ifdef APP-PLUS */
			padding: 40px 15px;
			/* #endif */
		}

		.remind {
			right: -20rpx;
			top: -20rpx;
			width: 26px;
			line-height: 26px;
			font-size: 16px;
			padding: 5rpx;
		}
	}

	@media screen and (min-width: 1000px) {
		.swiper-sw {
			height: 180px;
		}

		.flap {
			height: 300px;
			margin-bottom: 30px;
		}

		.mswiper {
			height: 180px;
		}

		.grid-item {
			height: 180px;
		}

		.image-sw {
			width: 80px;
			height: 80px;
		}

		.flap-sw {
			margin: 120px 28rpx 20rpx;
		}

		.remind {
			right: -30rpx;
			top: -30rpx;
			width: 60rpx;
			line-height: 60rpx;
			font-size: 32rpx;
			padding: 10rpx;
			/* #ifdef MP */
			right: -10px;
			top: -10px;
			width: 25px;
			line-height: 25px;
			font-size: 16px;
			padding: 5px;
			/* #endif */
		}

	}
@media screen and (min-width: 1200px) {

		.flap {
			margin-bottom: 20px;
		}


		.image-sw {
			width: 60px;
			height: 60px;
		}
		.remind {
			right: -35rpx;
			top: -35rpx;
		}

	}

	.menuList {
		list-style: none;
		padding: 0;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		background-color: #fff;
		flex-wrap: wrap;
		border: 1px solid #fff;
		border-radius: 6px;
		// padding-top: 20rpx;
		box-shadow: 0 1px 10px 1px #e8e8e8;
	}

	.uni-grid {
		justify-content: center;
	}

	.menuList-item {
		width: 18%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 10px 0px 10px;
		padding: 3px 9px 2px;
	}

	.menuList-item-img {
		width: 42px;
		height: 42px;
	}

	.menuList-item-name {
		font-size: 12px;
		color: #333;
		margin-top: 6px;
	}

	.banner {
		width: 100%;
		height: 100%;
		border: 1px solid #fff;
		border-radius: 6px;
	}

	.notice_head {
		display: flex;
		justify-content: space-between;
	}

	.notice_head_title {
		color: #999;
		font-size: 16px;
		font-weight: bold;
		position: relative;
	}

	.notice_head_title::after {
		position: absolute;
		left: 50%;
		bottom: 0;
		margin-left: -7px;
		margin-bottom: -5px;
		content: "";
		width: 14px;
		height: 4px;
		background-color: #3b7af5;
		border-radius: 30%;
	}

	.notice,
	.notice_body {
		padding: 0 14px;
		margin-top: 18px;
	}

	.notice_body_text {
		width: 100%;
	}

	.notice_body_text_title {
		padding: 6px 20px 6px 0;
		color: #333;
		font-weight: bold;
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.notice_body_text_content {
		margin: 6px 0 18px;
		color: #999;
		font-size: 12px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.image_box {
		position: relative;
	}
</style>
