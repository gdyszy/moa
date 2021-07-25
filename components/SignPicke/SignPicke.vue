<template>
	<view class="pf-picker">
		<div class="mask" :class="{'show':showPicker}" @tap="maskTap" catchtouchmove="true"></div>
		<view class="pf-picker-cnt" :class="{'show':showPicker}">
			<view class="pf-picker-hd" catchtouchmove="true">
				<view class="pf-picker-title" v-if="statusType==1">迟到打卡</view>
				<view class="pf-picker-title" v-else>早退打卡</view>
				<view class="pf-picker-btn" :style="{'color':themeColor}" @tap="pickerCancel">返回</view>
			</view>
			<view class="pf-picker-view">
				<view>备注</view>
				<view>
					<input type="text" v-model="value" :placeholder="statusType==1?'请填写迟到原因，选填项':'请填写早退原因，选填项'" :maxlength="30" style="border-bottom: 1px solid #ccc; margin: 10px 0 15px;padding-bottom: 13px;width: 100%;"/>
				</view>
				<button class="pf-picker-view-btn" @tap="Confirm()">{{statusType==1?'迟到打卡':'早退打卡'}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:'',
				showPicker: false,
			}
		},
		props: {
			themeColor: {
				type: String,
				default () {
					return "#2D89E5" //返回字体颜色
				}
			},
			statusType: {
				type: Number,
				default () {
					return 1 //迟到1 早退2
				}
			}
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
			//点击返回
			pickerCancel() {
				this.showPicker = false;
			},
			//点击确定
			Confirm() {
				this.$emit("confirm",this.value);
				this.showPicker = false;
			},
			
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
		.pf-picker-btn{
			font-size: 14px;
		}

		.item {
			text-align: center;
			line-height: 80rpx;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 32rpx;
		}

		.pf-picker-view {
			box-sizing:border-box;
			width: 100%;
			background-color: rgba(255, 255, 255, 1);
			z-index: 666;
			padding: 12px 13px 14px;
			&-btn{
				background-color: #FFB937;
				border-radius: 4px;
				color: #fff;
				height: 52px;
				width: 100%;
				line-height: 52px;
			}
		}

		picker-view {
			height: 100%;
		}
	}
</style>
