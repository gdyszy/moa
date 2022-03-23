<template>
	<view class="user-card">
		
		<view style="width: 100%; margin: 0 auto;">
			<view class="all" @click="open" hover-class="bg-light">
				<view class="all-left">
				
					<image :src="item.friend_user.avatar" style="width: 80rpx; height: 80rpx;" class="rounded-circle mr-2" />
				</view>
				
				<view class="border-bottom"> </view>
				
				<view class="all-border">
					<view class="all-center">
						<view class="all-center-top font-weight-bold">
							<!-- font-md 字体加粗-->
							{{item.friend_user.nickname}}
						</view>
						<view class="all-center-bottom" v-if="item.chatDetail">
						{{item.chatDetail.content}}

						</view>
					</view>
					<view class="all-right">
						<view class="all-right-top" v-if="item.chatDetail">
				
						{{ returnTime(item.chatDetail.create_time)}}
						</view>
						<!-- <view class="all-right-bottom" v-if="item.no_read_count != 0">
							<view class="all-rght-bottom-bottom">
								{{item.friend_user.no_read_count}}
							</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="flex align-center p-2 border-light-secondary" hover-class="bg-light" @click="open">
			<image :src="item.avatar" style="width: 80rpx; height: 80rpx;" class="rounded-circle mr-2" />
			<view>
				<text class="font-md font-weight-bold">{{item.nickname}}</text>
			</view>
			<view class="flex-1 flex justify-end">
				<view class="font-sm" :class="item.online ? 'text-success' : 'text-light-muted'">
					{{item.online ? '在线' : '离线'}}
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
import { timeFormat } from "@/utils/dateUtils.js";

	export default {
		name: "user-card",
		data() {
			return {
				name: 0
			};
		},
		props: ['item', 'index'],
		methods: {
			returnTime(e){
			return	timeFormat(e, "hh:mm")
			},
			open() {
				uni.navigateTo({
					url: '/pages/message/user-chat/user-chat?user=' + JSON.stringify(this.item)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-card {
		background-color: #FFFFFF;
	}
	.all{
        width: 750rpx;
		display: flex;
		height: 135rpx;
		align-items: center;
		position: relative;
		
        .all-left{
            padding: 0 20rpx;
        }
		.all-border{
			width: 576rpx;
			display: flex;
			height: 130rpx;
			
			.all-center{
				width: 485rpx;
				height: 130rpx;
				
				.all-center-top{
					width: 465rpx;
					height: 65rpx;
					line-height: 65rpx;
				}
				
				.all-center-bottom{
					width: 465rpx;
					height: 65rpx;
					line-height: 65rpx;
					color: #828282;
					white-space: nowrap;
					/*设置内容不换行*/
					text-overflow: ellipsis;
					/*设置文字超出文本框的内容显示成...*/
					overflow: hidden;
					/*超出部分隐藏*/
				}
			}
			
			.all-right{
				height: 130rpx;
				width: 110rpx;
              
				
				.all-right-top{
               
					height: 65rpx;
					width: 110rpx;
					line-height: 65rpx;
					display: flex;
					flex-direction: row-reverse;
				}
				
				.all-right-bottom{
					height: 65rpx;
					width: 110rpx;
					display: flex;
					flex-direction: row-reverse;
					
					.all-rght-bottom-bottom{
						width: 55rpx;
						height: 35rpx;
						line-height: 35rpx;
						text-align: center;
						background-color: red;
						color: #FFFFFF;
						padding: 3rpx;
						border-radius: 45rpx;
						// padding: 2rpx 3rpx;
						font-size: 30rpx;
					}
				}
			}
		}
	}
	
	.border-bottom{
		position: absolute;
		right: -35rpx;
		bottom: 0rpx;
		border-bottom: 1px solid #e6e6e6;
		width: 615rpx;
	}
</style>
