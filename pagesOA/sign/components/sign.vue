<template>
	<view class="bg">
		<view style="height: 1px"></view>
		<view class="signInfo">
			<view class="signInfo_time_up">
				<image class="img_sign" src="@/static/ico_signed.png" v-if="signtoWorkTime!=''">
				<image class="img_unsign" src="@/static/ico_unsign.png" v-else>
				<view class="time">
					<view class="signTime">{{signtoWorkTime!=''?signtoWorkTime+'打卡':'未打卡'}}</view>
					<view class="workTime">{{startWorkTime}}上班<view class="cardtip" v-if="startClockStatus!=0">{{startClockStatus==1?'迟到':startClockStatus==3?'缺卡':'迟到'}}</view>
					</view>
				</view>
			</view>
			<view style="height: 34px;width: 1px; background-color:#ccc ;"></view>
			<view class="signInfo_time_down">
				<image class="img_sign" src="@/static/ico_signed.png" v-if="signoffWorkTime!=''">
				<image class="img_unsign" src="@/static/ico_unsign.png" v-else>
				<view class="time">
					<view class="unSignTime">{{signoffWorkTime!=''?signoffWorkTime+'打卡':'未打卡'}}</view>
					<view class="workTime">{{endWorkTime}}下班<view class="cardtip" v-if="endClockStatus!=0">{{endClockStatus==2?'早退':endClockStatus==3?'缺卡':'早退'}}</view></view>
				</view>
			</view>
		</view>

		<view class="location">
			<image :src="inLocation?require('@/static/ico_signed.png'):require('@/static/ico_outScope.png')">

				<view class="location_content" v-if="inLocation">
					<span class="location_content_tip">已进入考勤范围</span>
					<span class="location_content_address"></span>
					<image src="@/static/icon_arrow_right.png" />
				</view>
				<view class="location_content" v-else>
					<span class="location_content_tip">考勤范围外：</span>
					<span class="location_content_address">{{address}}</span>
					<image src="@/static/icon_arrow_right.png" />
				</view>
		</view>
		<view class="signInfo_btn" @click="sign()">
			<image src="@/static/bg_sign.png" style="width:160px;height: 160px;position: absolute;z-index: 1;">
				<span v-if="clockInCount==0">上班打卡</span>
				<span v-else>下班打卡</span>
				<span>{{nowTime}}</span>
		</view>

		<view class="tip">
			忘记打卡？
			<span @click="routePatchCard">马上补卡</span>
		</view>
		<Sign-picker ref="leaveEarly" @confirm="onConfirm" :statusType="signStatus"></Sign-picker>

	</view>
</template>

<script>
	import SignPicker from '@/components/SignPicke/SignPicke'
	import {
		timeFormat
	} from '@/utils/dateUtils.js';
	export default {
		components: {
			SignPicker
		},
		data() {
			return {
				formData: {
					"user_uid": uni.getStorageSync('username')
				},
				pid: '',
				signStatus: 0, //签到状态
				clockInCount: 0, //今日打卡次数
				inLocation: false,
				address: '',
				nowTime: timeFormat(new Date(), "hh:mm:ss"),
				signtoWorkTime: '',
				signoffWorkTime: '',
				startWorkTime: '00:00',
				endWorkTime: '00:00',
				startClockStatus:0,
				endClockStatus:0,

				// 签到公司坐标
				userLat: 0,
				userLng: 0,
				compLat: 0,
				compLng: 0,
				distance: 0,
				isSclockList: true
			}
		},
		mounted() {
			this.initClockIn();
			this.getClockMonthDate();

			//this.getLoaction('showLoad');

			var that = this;
			this.timer = setInterval(() => {
				that.nowTime = timeFormat(new Date(), "hh:mm:ss");
				if (that.clockInCount == 0) {
					if (Date.parse('01/01/1970 ' + that.nowTime) < Date.parse('01/01/1970 ' + that.startWorkTime +
							':59')) {
						that.signStatus = 0 // 正常上班状态
					} else {
						that.signStatus = 1 // 迟到状态
					}
				} else if (that.clockInCount >= 1) {
					if (Date.parse('01/01/1970 ' + that.nowTime) < Date.parse('01/01/1970 ' + that.endWorkTime +
							':00')) {
						that.signStatus = 2 // 早退状态
					} else {
						that.signStatus = 0 // 正常下班状态
					}
				} else {}
			}, 1000)
			this.getAddress = setInterval(() => {
				that.getLoaction()
			}, 5000)

		},
		beforeDestroy() {
			if (this.timer) {
				clearInterval(this.timer);
			}
			if (this.getAddress) {
				clearInterval(this.getAddress);
			}
		},

		methods: {
			ClockInAddTrigger(){
				uniCloud.callFunction({
					name: 'clockIn',
					data: {
						name: 'ClockInAddTrigger',
						data: {}
					}
				}).then((res) => {
				})
			},
			sign() {
				if (this.isSclockList == false) {
					uni.showToast({
						title: '没有考勤打卡方案，请联系管理员！',
						icon: 'none'
					})
					return false
				}
				if (this.signStatus == 0 && this.isSclockList == true) {
					this.ClockInAdd() // 正常打卡
				} else if (this.signStatus == 1 && this.isSclockList == true) {
					this.$refs.leaveEarly.show(); // 迟到打卡
				} else if (this.signStatus == 2 && this.isSclockList == true) {
					this.$refs.leaveEarly.show(); // 早退打卡
				} else {}
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success(res) {
						if (res.authSetting['scope.userLocation']) {
							// if(this.signStatus==0){
							// 	this.ClockInAdd()				// 正常打卡
							// }else if(this.signStatus==1){
							// 	this.$refs.leaveEarly.show();		// 迟到打卡
							// }else if(this.signStatus==2){
							// 	this.$refs.leaveEarly.show();			// 早退打卡
							// }else{ }
						} else if (!res.authSetting['scope.userLocation']) {
							uni.authorize({
								scope: 'scope.userLocation',
								success(res) {},
								fail() {
									uni.showModal({
										content: '检测到您没打开获取位置信息功能权限，是否去设置打开？',
										confirmText: "确认",
										cancelText: '取消',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting({
													success: (res) => {}
												})
											} else {}
										}
									})
									console.log("位置授权失败")
								}
							})
						}
					},
					fail() {
						console.log("获取授权信息授权失败")
					}
				})
				// #endif

			},
			onConfirm(e) {
				this.ClockInAdd(e)
			},
			getClockMonthDate() {
				let _this = this;
				let params = {
					"user_uid": uni.getStorageSync('username'),
					"monthDate": timeFormat(new Date(), "yyyy-MM")
				}
				uniCloud.callFunction({
					name: 'clockIn',
					data: {
						name: 'getClockMonthDate',
						data: params
					}
				}).then((res) => {
					if (res.result == null) {
						return false
					}
					if (res.result.schemeSclockList != null) {
						let date = timeFormat(new Date(), "yyyy-MM-dd")
						let flag = false
						for (let i in res.result.schemeSclockList) {
							if (res.result.schemeSclockList[i]._id === date) {
								flag = true
								if (res.result.schemeSclockList[i].daySignList.length == 1) {
									this.clockInCount = 1
									this.signtoWorkTime = res.result.schemeSclockList[i].daySignList[0].clockTime
										.substring(0, 5)
										this.startClockStatus = res.result.schemeSclockList[i].daySignList[0].clockStatus
								} else if (res.result.schemeSclockList[i].daySignList.length == 2) {
									this.signtoWorkTime = res.result.schemeSclockList[i].daySignList[0].clockTime
										.substring(0, 5)
										this.startClockStatus = res.result.schemeSclockList[i].daySignList[0].clockStatus
									this.signoffWorkTime = res.result.schemeSclockList[i].daySignList[1].clockTime
										.substring(0, 5)
										this.endClockStatus = res.result.schemeSclockList[i].daySignList[1].clockStatus
									this.clockInCount = 2
								} else {
									let a = res.result.schemeSclockList[i].daySignList.length
									this.clockInCount = a
									this.signtoWorkTime = res.result.schemeSclockList[i].daySignList[0].clockTime
										.substring(0, 5)
									this.signoffWorkTime = res.result.schemeSclockList[i].daySignList[a - 1]
										.clockTime.substring(0, 5)
								}
							}
						}
						if (flag == false) {
							this.clockInCount = 0
						}
					}
				})
			},
			initClockIn() {
				let _this = this;
				uniCloud.callFunction({
					name: 'clockIn',
					data: {
						name: 'getClockIn',
						data: _this.formData
					}
				}).then((res) => {
					if (res.result == null) {
						uni.hideLoading()
						uni.showToast({
							title: '没有考勤打卡方案，请联系管理员！',
							icon: 'none'
						})
						this.isSclockList = false
						return false
					}
					this.pid = res.result.schemePlaceList[0].pid
					this.compLat = res.result.schemePlaceList[0].compLat
					this.compLng = res.result.schemePlaceList[0].compLng
					this.distance = Number(res.result.schemePlaceList[0].distance)
					this.startWorkTime = res.result.schemetimeList[0].startTime
					this.endWorkTime = res.result.schemetimeList[0].endTime
				})
			},
			ClockInAdd(val) {
				let _this = this;
				let params = {
					"user_uid": uni.getStorageSync('username'),
					"pid": _this.pid,
					"clockTime": _this.nowTime,
					"clockStatus": _this.signStatus,
					"isField": _this.inLocation ? 1 : 0
				}
				if (val || _this.signStatus == 3) {
					params['remarks'] = val
				}
				uniCloud.callFunction({
					name: 'clockIn',
					data: {
						name: 'ClockInAdd',
						data: params
					}
				}).then((res) => {
					if (res.result.id) {
						uni.showToast({
							title: '打卡成功！',
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: '打卡失败！',
							icon: 'none'
						})
					}
					_this.initClockIn();
					_this.getClockMonthDate();
				})
			},

			getLoaction(val) {
				if (val && val == 'showLoad') {
					uni.showLoading({
						title: '获取定位中...',
						mask: false
					});
				}
				var that = this;
				uni.getLocation({
					type: 'gcj02 ',
					geocode: true,
					success: function(res) {
						if (val && val == 'showLoad') {
							uni.hideLoading()
						}
						var ad = res.address.province
						ad += res.address.city
						ad += res.address.district
						ad += res.address.street
						ad += res.address.streetNum
						ad += res.address.poiName
						that.address = ad

						that.userLat = res.latitude
						that.userLng = res.longitude
						var length = that.getDistance(that.userLat, that.userLng, that.compLat, that.compLng)
						// console.log("length:"+length) 
						// console.log("distance:"+that.distance)
						if (length <= Number(that.distance)) {
							that.inLocation = true
						}
					},
					fail: function(res) {
						if (val && val == 'showLoad') {
							uni.hideLoading()
							uni.showToast({
								title: '获取定位失败！',
								icon: 'none',
								mask: true
							})
						}
					}
				});
			},
			// 计算距离函数
			Rad(d) {
				//根据经纬度判断距离
				return d * Math.PI / 180.0;
			},
			getDistance(lat1, lng1, lat2, lng2) {
				// lat1用户的纬度
				// lng1用户的经度
				// lat2公司的纬度
				// lng2公司的经度
				var radLat1 = this.Rad(Number(lat1))
				var radLat2 = this.Rad(Number(lat2))
				var a = radLat1 - radLat2;
				var b = this.Rad(Number(lng1)) - this.Rad(Number(lng2));
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math
					.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10;
				console.log('经纬度计算的距离:' + s)
				return s
			},

			routePatchCard() {
				uni.navigateTo({
					url: '/pagesOA/patchCard/index'
				});
			}
		}
	}
</script>

<style>
	.bg {
		background-color: #F7F8FA;
		width: 100%;
		height: 100%;
	}

	.signInfo {
		border-radius: 6px;
		padding: 17px 18px 16px;
		margin: 14px;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.signInfo_time_up,
	.signInfo_time_down {
		display: flex;
		flex: 1;
	}

	.signInfo_time_down {
		justify-content: center;
	}

	.img {
		width: 18px;
		height: 18px;
		margin-top: 4px;
	}

	.img_sign {
		width: 18px;
		height: 18px;
		margin-top: 3px;
	}

	.img_unsign {
		width: 18px;
		height: 18px;
		margin-top: 3px;
	}

	.time {
		margin-left: 12px;
	}

	.signTime,
	.unSignTime {
		color: #333;
		font-size: 15px;
		font-weight: bold;
	}

	.workTime {
		font-size: 12px;
		color: #e5e5e5;
		display: flex;
	}
   .cardtip{
	   margin-left: 10rpx;
	   font-size: 6px;
	   color: #FFB937;
	   border: 1px solid #FFB937;
	   border-radius: 2px;
   }
	.signInfo_btn {
		position: relative;
		height: 160px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 135px;
	}

	.signInfo_btn span:nth-child(2) {
		z-index: 2;
		color: #fff;
		font-size: 18px;
		font-weight: bold;
	}

	.signInfo_btn span:nth-child(3) {
		z-index: 3;
		color: #B6DDFF;
		font-size: 14px;
	}

	.location {
		padding: 17px 18px;
		background-color: #fff;
		margin: 14px;
		border: 1px solid #fff;
		border-radius: 3px;
		display: flex;
		align-items: center;
	}

	.location image {
		width: 18px;
		height: 18px;
	}

	.location_content {
		width: 90%;
		margin-left: 12px;
		display: inline-flex;
		align-items: center;
	}

	.location_content_tip {
		font-size: 15px;
		color: #333;
		font-weight: bold;

	}

	.location_content_address {
		flex: 1;
		color: #999;
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tip {
		text-align: center;
		color: #999;
		font-size: 13px;
		margin-top: 38px;
	}

	.tip span {
		color: #3B89F5;
		margin-left: 5px;
	}
</style>
