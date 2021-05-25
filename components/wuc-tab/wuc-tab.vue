<template>
	<scroll-view class="wuc-tab" :class="tabClass" :style="tabStyle" scroll-with-animation scroll-x
		:scroll-left="scrollLeft">
		<view v-if="!textFlex" style="display: flex;justify-content: space-between;">
			<view>
				<view class="wuc-tab-item" :class="[index === tabCur ? selectClass:'']" v-for="(item,index) in tabList"
					:key="index" :id="index" @tap="tabSelect(index,$event)">
					<text :class="item.icon"></text>
					<span>{{item.name}}</span>
					<view :class="[index === tabCur ? 'newCur':'']"></view>
				</view>
			</view>
			<view style="display: flex;color: #999999;width: 120rpx;" v-if="selectStatus" @tap="screen">
				筛选
				<span class="ico1">
					<image src="../../static/workOverTime/ico_screen.png" style="width: 100%; height: 100%;"></image>
				</span>
			</view>
			<div style="display: flex; color: #999999;" v-if="false" @tap="monthData">
				月数据
				<span class="ico1">
					<image src="../../static/workOverTime/ico_month.png" style="width: 18px; height: 18px;"></image>
				</span>
			</div>
			<div style="display: flex;  color: #999999;font-size: 12px;" v-if="selectStatus3" @tap="selectDate">
				{{seldate}}
				<span class="ico1">
					<image src="../../static/workOverTime/ico_datescreen.png" style="width: 18px; height: 18px;">
					</image>
				</span>
			</div>
		</view>


		<view class="flex text-center" v-if="textFlex">
			<view class="wuc-tab-item flex-sub" :class="index === tabCur ? selectClass + ' cur':''"
				v-for="(item,index) in tabList" :key="index" :id="index" @tap="tabSelect(index,$event)">
				<text :class="item.icon"></text>
				<span>{{item.name}}</span>
			</view>
		</view>
	</scroll-view>
</template>
<script>
	export default {
		name: 'wuc-tab',
		data() {
			return {
			};
		},
		props: {
			seldate: {
			    type: String,
			    default() {
			        return '';
			    }
			},
			tabList: {
				type: Array,
				default () {
					return [];
				}
			},
			tabCur: {
				type: Number,
				default () {
					return 0;
				}
			},
			tabClass: {
				type: String,
				default () {
					return '';
				}
			},
			tabStyle: {
				type: String,
				default () {
					return '';
				}
			},
			textFlex: {
				type: Boolean,
				default () {
					return false;
				}
			},
			selectClass: {
				type: String,
				default () {
					return 'text-blue';
				}
			},
			selectStatus: {
				type: Boolean,
				default: false
			},
			selectStatus2: {
				type: Boolean,
				default: false
			},
			selectStatus3: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			tabSelect(index, e) {
				if (this.currentTab === index) return false;
				this.$emit('update:tabCur', index);
				this.$emit('change', index);
			},
			screen() {
				uni.navigateTo({
					url: '/pages/formCommon/screen'
				})
			},
			monthData() {
				uni.navigateTo({
					url: '/pages/sign/monthData'
				})
			},
			selectDate() {
				this.$emit('selectMonth')
			}
		},
		computed: {
			scrollLeft() {
				return (this.tabCur - 1) * 60;
			}
		}
	};
</script>
<style scoped>
	view,
	scroll-view,
	swiper {
		box-sizing: border-box;
	}

	.wuc-tab {
		white-space: nowrap;
		background-color: #FFFFFF;
		padding-top: 30rpx;
	}

	.wuc-tab-item {
		height: 90upx;
		display: inline-block;
		/* line-height: 90upx; */
		margin: 0 10upx;
		padding: 0 20upx;
		color: #999999;
	}

	.wuc-tab-item.cur {
		border-bottom: 4upx #007AFF solid;
	}

	.wuc-tab.fixed {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1024;
		box-shadow: 0 1upx 6upx rgba(0, 0, 0, 0.1);
	}

	.flex {
		display: flex;
	}

	.text-center {
		text-align: center;
	}

	.flex-sub {
		flex: 1;
	}

	.text-blue {
		color: #0081ff;
	}

	.text-white {
		color: #ffffff;
	}

	.bg-white {
		background-color: #ffffff;
	}

	.bg-blue {
		background-color: #0081ff;
	}

	.text-orange {
		color: #f37b1d
	}

	.text-xl {
		font-size: 36upx;
	}

	.newCur {
		height: 4pt;
		width: 14pt;
		background-color: #3B88F5;
		;
		border-radius: 2pt;
		margin: 4pt auto;
	}

	.Selfont {
		font-size: 16px;
		font-weight: bold;
		color: #333333;
	}

	.ico1 {
		width: 46rpx;
		height: 46rpx;
	}
</style>
