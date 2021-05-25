<template>
	<view class="page">
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" collection="contactUs"
			field="companyname,telephone,email,address">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list :border="false" class="ulist" v-for="(item, index) in data" :key="index">
					<uni-list-item>
						<view slot="body">
							<view class="re-uni-list-item__content">
								<text class="re-uni-list-item__content-note">公司名称</text>
								<text class="re-uni-list-item__content-title">{{item.companyname}}</text>
							</view>
						</view>
					</uni-list-item>
					<!-- #ifdef APP-PLUS -->
					<uni-list-item clickable @click="onClick(item.telephone)">
						<view slot="body" class="slot-box slot-text">
							<view class="re-uni-list-item__content">
								<text class="re-uni-list-item__content-note">联系电话</text>
								<text class="re-uni-list-item__content-title">{{item.telephone}}</text>
							</view>
						</view>
						<template slot="footer">
							<image class="slot-image" src="/static/img/btn-tel@3x.png" mode="widthFix"></image>
						</template>
					</uni-list-item>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<uni-list-item clickable @click="onClickwx(item.telephone)">
						<view slot="body" class="slot-box slot-text">
							<view class="re-uni-list-item__content">
								<text class="re-uni-list-item__content-note">联系电话</text>
								<text class="re-uni-list-item__content-title">{{item.telephone}}</text>
							</view>
						</view>
						<template slot="footer">
							<image class="slot-image" src="/static/img/btn-tel@3x.png" mode="widthFix"></image>
						</template>
					</uni-list-item>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<uni-list-item clickable>
						<view slot="body" class="slot-box slot-text">
							<view class="re-uni-list-item__content">
								<text class="re-uni-list-item__content-note">联系电话</text>
								<text class="re-uni-list-item__content-title">{{item.telephone}}</text>
							</view>
						</view>
						<template slot="footer">
							<image class="slot-image" src="/static/img/btn-tel@3x.png" mode="widthFix"></image>
						</template>
					</uni-list-item>
					<!-- #endif -->
					<uni-list-item>
						<view slot="body">
							<view class="re-uni-list-item__content">
								<text class="re-uni-list-item__content-note">邮箱</text>
								<text class="re-uni-list-item__content-title">{{item.email}}</text>
							</view>
						</view>
					</uni-list-item>
					<uni-list-item :endborder="true">
						<view slot="body">
							<view class="re-uni-list-item__content">
								<text class="re-uni-list-item__content-note">公司地址</text>
								<text class="re-uni-list-item__content-title">{{item.address}}</text>
							</view>
						</view>
					</uni-list-item>
					
				</uni-list>
			</view>
		</unicloud-db>
		<uni-fab v-if="contactUsAdd" ref="fab" horizontal="right" vertical="bottom" :pop-menu="false"
			@fabClick="fabClick" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				contactUsAdd: '',
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onPullDownRefresh() {
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			this.$refs.udb.loadMore()
		},
		onLoad() {
			if (uni.getStorageSync('userInfo').role == 'admin') {
				this.contactUsAdd = true;
			}
		},
		methods: {
			onClick(num) {
				plus.device.dial(num,false) 
			},
			onClickwx(num) {
				wx.makePhoneCall({
				      phoneNumber: num,
				    })
			},
			handleItemClick(id) {
				uni.navigateTo({
					url: './detail?id=' + id
				})
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			fabClick() {
				// 打开新增页面
				uni.navigateTo({
					url: './add',
					events: {
						// 监听新增数据成功后, 刷新当前页面数据
						refreshData: () => {
							this.$refs.udb.loadData({
								clear: true
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.ulist {
		margin-top: 8px;
		padding-left: 26rpx;
		padding-right: 26rpx;
		padding-bottom: 13.5px;
	}

	.re-uni-list-item__content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;

	}

	.re-uni-list-item__content-note {
		margin-top: 6rpx;
		margin-bottom: 6rpx;
		color: #999999;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 13px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.re-uni-list-item__content-title {
		color: #333333;
		font-family: PingFang SC;
		font-weight: 500;
		font-size: 15px;
		line-height: normal;
		letter-spacing: 0px;
		text-align: left;
	}

	.uni-list-item__container {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		padding: $list-item-pd;
		padding-left: $uni-spacing-row-lg;
		flex: 1;
		overflow: hidden;
		// align-items: center;
	}

	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	
	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 0;
		width: 20px;
		height: 20px;
		margin-top: 26rpx;
	}
	
	.slot-text {
		flex: 1;
		font-size: 14px;
		color: #4cd964;
		margin-right: 10px;
	}
</style>
