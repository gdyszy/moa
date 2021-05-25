<template>
	<view class="pf-picker">
		<div class="mask" :class="{'show':showPicker}" @tap="maskTap" catchtouchmove="true"></div>
		<view class="pf-picker-cnt" :class="{'show':showPicker}">
			<view class="pf-picker-hd" catchtouchmove="true">
				<view class="hd-date">{{selectedDate.substring(0,7)}}</view>
				<view class="pf-picker-btn" @tap="pickerConfirm">确定</view>
			</view>
			<view class="pf-picker-view">
				<view class="calendar-weeks">
					<view class="calendar-week" v-for="(week, index) in weeks" :key="index">
						{{week}}
					</view>
				</view>
				<view class="calendar-content">
					<swiper class="calendar-swiper" :style="{
					   width: '100%',
					   height: sheight
				   }" :indicator-dots="false" :autoplay="false" :duration="duration" :current="current" @change="changeSwp"
						:circular="true">
						<swiper-item class="calendar-item" v-for="sitem in swiper" :key="sitem">
							<view class="calendar-days">
								<template v-if="sitem === current">
									<view class="calendar-day" v-for="(item,index) in days" :key="index"
										:class="[ !item.show===false?'':'day-hidden' ,item.isToday ? 'todayClassBg' : '', item.fullDate === selectedDate ? 'checkedClassBg' : '',index%7===0||index%7===6?'is-week':'']"
										@click="clickItem(item)">
										<view class="date" :class="[ item.isToday ? todayClass : '' ]">
											{{item.time.getDate()}}
										</view>
										<view class="dot-show" v-if="item.info">
										</view>
										<view class="unsignDot-show" v-else-if="item.showUnsigndot">
										</view>

									</view>
								</template>
								<template v-else>
									<template v-if="current - sitem === 1 || current-sitem ===-2">
										<view class="calendar-day" v-for="(item,index) in predays" :key="index" :class="{
												'day-hidden': !item.show
											}">
											<view class="date" :class="[
													item.isToday ? todayClass : ''
													]">
												{{item.time.getDate()}}
											</view>
										</view>
									</template>
									<template v-else>
										<view class="calendar-day" v-for="(item,index) in nextdays" :key="index" :class="{
												'day-hidden': !item.show
											}">
											<view class="date" :class="[
													item.isToday ? todayClass : ''
													]">
												{{item.time.getDate()}}
											</view>
										</view>
									</template>

								</template>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		gegerateDates,
		dateEqual,
		formatDate
	} from './generateDates.js';
	export default {
		data() {
			return {
				weeks: ['一', '二', '三', '四', '五', '六', '日'],
				current: 1,
				currentYear: '',
				currentMonth: '',
				currentDate: '',
				days: [],
				weekMode: false,
				swiper: [0, 1, 2],
				timeStr: formatDate(new Date(), 'yyyy-MM-dd'),
				selectedDate: formatDate(new Date(), 'yyyy-MM-dd'),

				showPicker: false,
				// value:[],
				// datas: {},
				// checkArr:[],//返回选中数据

			}
		},
		props: {
			duration: {
				type: Number,
				default: 500
			},
			todayClass: {
				type: String, // 今日的自定义样式class
				default: 'is-today'
			},
			dotList: {
				type: Array, // 打点日期列表
				default () {
					return [

					]
				}
			},
			unsignDotList: {
				type: Array, // 未打卡日期列表
				default () {
					return [

					]
				}
			},
		},
		computed: {
			sheight() {
				// 根据年月判断有多少行
				// 判断该月有多少天
				let h = '90rpx';
				if (!this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth, 0);
					const days = d.getDate(); // 判断本月有多少天
					let day = new Date(d.setDate(1)).getDay();
					if (day === 0) {
						day = 7;
					}
					const pre = 8 - day;
					const rows = Math.ceil((days - pre) / 7) + 1;
					h = 90 * rows + 'rpx'
				}
				return h
			},
			predays() {
				let pres = [];
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate)
					d.setDate(d.getDate() - 7);
					pres = gegerateDates(d, 'week')
				} else {
					const d = new Date(this.currentYear, this.currentMonth - 2, 1)
					pres = gegerateDates(d, 'month')
				}
				return pres;
			},
			nextdays() {
				let nexts = [];
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate)
					d.setDate(d.getDate() + 7);
					nexts = gegerateDates(d, 'week')
				} else {
					const d = new Date(this.currentYear, this.currentMonth, 1)
					nexts = gegerateDates(d, 'month')
				}
				return nexts;
			}
		},
		created() {
			this.initDate();
		},
		methods: {
			//背景处理
			maskTap() {
				this.showPicker = false;
			},
			//显示
			show() {
				this.showPicker = true;
			},
			//隐藏
			hide() {
				this.showPicker = false;
			},
			//点击确定
			pickerConfirm(e) {
				// console.log(this.selectedDate)
				this.$emit("confirm", this.selectedDate);
				this.showPicker = false;
			},
			changeSwp(e) {
				// console.log(e);
				const pre = this.current;
				const current = e.target.current;
				/* 根据前一个减去目前的值我们可以判断是下一个月/周还是上一个月/周 
				 *current - pre === 1, -2时是下一个月/周
				 *current -pre === -1, 2时是上一个月或者上一周
				 */
				this.current = current;
				if (current - pre === 1 || current - pre === -2) {
					this.daysNext();
				} else {
					this.daysPre();
				}
			},
			// 初始化日历的方法
			initDate(cur) {
				let date = ''
				if (cur) {
					date = new Date(cur)
					this.selectedDate = formatDate(date, 'yyyy-MM-dd')
				} else {
					date = new Date()
				}
				this.currentDate = date.getDate() // 今日日期 几号
				this.currentYear = date.getFullYear() // 当前年份
				this.currentMonth = date.getMonth() + 1 // 当前月份
				this.currentWeek = date.getDay() === 0 ? 7 : date.getDay() // 1...6,0   // 星期几
				const nowY = new Date().getFullYear() // 当前年份
				const nowM = new Date().getMonth() + 1
				const nowD = new Date().getDate() // 今日日期 几号
				const nowW = new Date().getDay();
				// this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd')
				this.days = [];
				let days = [];
				if (this.weekMode) {
					days = gegerateDates(date, 'week');
					// this.selectedDate = days[0].fullDate;
				} else {
					days = gegerateDates(date, 'month');
					// const sel = new Date(this.selectedDate.replace('-', '/').replace('-', '/'));
					// const isMonth = sel.getFullYear() === this.currentYear && (sel.getMonth() + 1) === this.currentMonth;
					// if(!isMonth) {
					// 	this.selectedDate = formatDate(new Date(this.currentYear, this.currentMonth-1,1), 'yyyy-MM-dd')
					// }
				}
				days.forEach(day => {
					const dot = this.dotList.find(item => {
						return dateEqual(item.date, day.fullDate);
					})
					if (dot) {
						day.info = dot;
					}
					const unsigndot = this.unsignDotList.find(item => {
						return dateEqual(item.date, day.fullDate);
					})
					if (unsigndot) {
						day.showUnsigndot = unsigndot;
					}
				})
				this.days = days;

				//  派发事件,时间发生改变
				let obj = {
					start: '',
					end: ''
				};
				if (this.weekMode) {
					obj.start = this.days[0].time;
					obj.end = this.days[6].time
				} else {
					const start = new Date(this.currentYear, this.currentMonth - 1, 1);
					const end = new Date(this.currentYear, this.currentMonth, 0);
					obj.start = start;
					obj.end = end;
				}
				this.$emit('days-change', obj)
			},
			//  上一个
			daysPre() {
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
					d.setDate(d.getDate() - 7);
					this.initDate(d);
				} else {
					const d = new Date(this.currentYear, this.currentMonth - 2, 1);
					this.initDate(d);
				}
			},
			//  下一个
			daysNext() {
				if (this.weekMode) {
					const d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
					d.setDate(d.getDate() + 7);
					this.initDate(d);
				} else {
					const d = new Date(this.currentYear, this.currentMonth, 1);
					this.initDate(d);
				}
			},
			changeMode() {
				const premode = this.weekMode;
				let isweek = false;
				if (premode) {
					isweek = !!this.days.find(item => item.fullDate === this.selectedDate)
				}
				this.weekMode = !this.weekMode;
				let d = new Date(this.currentYear, this.currentMonth - 1, this.currentDate)
				const sel = new Date(this.selectedDate.replace('-', '/').replace('-', '/'));
				const isMonth = sel.getFullYear() === this.currentYear && (sel.getMonth() + 1) === this.currentMonth;
				if ((this.selectedDate && isMonth) || isweek) {
					d = new Date(this.selectedDate.replace('-', '/').replace('-', '/'))
				}
				this.initDate(d)
			},
			// 点击日期
			clickItem(e) {
				// console.log(e)
				this.timeStr = e.fullDate;
				this.selectedDate = e.fullDate;
				// console.log(e)
				this.$emit('selected-change', e);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pf-picker {
		.mask {
			position: fixed;
			z-index: 1000000000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
			visibility: hidden;
			opacity: 0;
			transition: all 0.3s ease;
		}

		.mask.show {
			visibility: visible;
			opacity: 1;
		}

		.pf-picker-cnt {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: #F4F5F7;
			transition: all 0.3s ease;
			transform: translateY(100%);
			z-index: 3000000000;
		}

		.pf-picker-btn {
			font-size: 14px;
			color: #2D89E5;
		}

		.pf-picker-cnt.show {
			transform: translateY(0);
		}

		.pf-picker-hd {
			display: flex;
			padding: 15px 14px;
			background-color: #fff;
			position: relative;
			text-align: center;
			font-size: 16px;
			justify-content: space-between;
			margin-bottom: 8px;
		}

		.hd-date {
			position: relative;
		}

		.hd-date::after {
			content: '';
			width: 14px;
			height: 4px;
			background-color: #3B89F5;
			position: absolute;
			left: 50%;
			margin-left: -7px;
			bottom: -7px;
			border-radius: 2px;

		}

		.pf-picker-hd:after {
			content: ' ';
			position: absolute;
			left: 0;
			bottom: 0;
			right: 0;
			height: 1rpx;
			border-bottom: 1rpx solid #e5e5e5;
			color: #e5e5e5;
			transform-origin: 0 100%;
			transform: scaleY(0.5);
		}

		.item {
			text-align: center;
			line-height: 80rpx;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 32rpx;
		}

		.pf-picker-view {
			width: 100%;
			box-sizing: border-box;
			overflow: hidden;
			background-color: rgba(255, 255, 255, 1);
			z-index: 666;
			padding: 12px 13px 14px;
		}

		picker-view {
			height: 100%;
		}
	}

	.todayClassBg {
		color: #3B89F5;
	}

	.checkedClassBg {
		background-color: #F4F5F7;
	}

	.is-week {
		color: #b2b2b2;
	}

	.calendar-weeks {
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		height: 60upx;
		line-height: 60upx;
		justify-content: center;
		align-items: center;
		font-size: 30upx;

		.calendar-week {
			width: calc(100% / 7);
			height: 100%;
			text-align: center;
			font-size: 12px;
			color: #b2b2b2;
		}
	}

	swiper {
		width: 100%;
		height: 60upx;
	}

	.calendar-content {
		min-height: 60upx;
	}

	.calendar-swiper {
		min-height: 70upx;
		transition: height ease-out 0.3s;
	}

	.calendar-item {
		margin: 0;
		padding: 0;
		height: 100%;
	}

	.calendar-days {
		display: flex;
		flex-flow: row wrap;
		width: 100%;
		height: 100%;
		overflow: hidden;
		font-size: 28upx;

		.calendar-day {
			width: calc(100% / 7);
			height: 90upx;
			text-align: center;
			display: flex;
			flex-flow: column nowrap;
			justify-content: flex-start;
			align-items: center;
		}
	}

	.day-hidden {
		visibility: hidden;
	}

	.mode-change {
		display: flex;
		justify-content: center;

		.mode-arrow-top {
			width: 0;
			height: 0;
			border-left: 12upx solid transparent;
			border-right: 12upx solid transparent;
			border-bottom: 10upx solid #b2b2b2;
		}

		.mode-arrow-bottom {
			width: 0;
			height: 0;
			border-left: 12upx solid transparent;
			border-right: 12upx solid transparent;
			border-top: 10upx solid #b2b2b2;
		}
	}

	.is-today {
		color: #3B89F5;
	}

	.is-checked {
		background: #ccc;
		color: #666;
	}

	.date {
		line-height: 50upx;
		margin: 0 auto;
	}

	.dot-show {
		margin-top: 5px;
		width: 6px;
		height: 6px;
		background: #3B89F5;
		border-radius: 50%;
	}

	.unsignDot-show {
		margin-top: 5px;
		width: 6px;
		height: 6px;
		background: #ccc;
		border-radius: 50%;
	}
</style>
