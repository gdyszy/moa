<template>
  <view style="width: 100%; background-color: #f5f5f7">
    <view class="header">
      <view class="header_img">
        <image
          src="../../static/workOverTime/ico_avator_@2x.png"
          style="width: 100%; height: 100%"
        ></image>
      </view>
      <view style="width: 80%">
        <view class="header_name">{{ getLocalTime(listDetail.create_date)}}的使用记录</view>
      </view>
    </view>
    <view class="baseMsg">
      <view class="baseMsg_item">
        <view class="baseMsg_item_title">车辆牌照</view>
        <view class="baseMsg_content">{{listDetail.carInfoRes.car_num}}</view>
        <view class="state">
          <view></view>
        </view>
      </view>
      <view class="baseMsg_item">
        <view class="baseMsg_item_title">型号特征</view>

        <view class="state">
          <view>{{listDetail.carInfoRes.carbrand}} {{carColor(listDetail.carInfoRes.color)}}</view>
        </view>
      </view>
    </view>
    <view
      class="box-border"
      style="background-color: #ffffff; padding-bottom: 20rpx"
    >
      <view class="baseMsg_detail">
        <view style="margin-bottom: 10rpx">
          <h3>使用信息</h3>
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">申请人</view>
          <view class="baseMsg_content">{{listDetail.username}}</view>
        </view>

        <view class="baseMsg_item">
          <view class="baseMsg_item_title">车辆使用人</view>
          <view class="baseMsg_content">{{listDetail.username}}</view>
        </view>

		<view v-if="listDetail.modeid==4">
        <view class="baseMsg_item">
          <view class="baseMsg_item_title">退回申请人</view>
          <view class="baseMsg_content">黄可用</view>
        </view>
        <view class="baseMsg_item">
          <view class="baseMsg_item_title">车辆退回人</view>
          <view class="baseMsg_content">黄可用</view>
        </view>
        <view class="baseMsg_item">
          <view class="baseMsg_item_title">车辆接收人</view>
          <view class="baseMsg_content">王猛</view>
        </view>
        <view class="baseMsg_item">
          <view class="baseMsg_item_title">退回时间</view>
          <view class="baseMsg_content">2020/06/30 12:00</view>
        </view>
		</view>
        <view class="baseMsg_item">
          <view class="usercardata">
            <view class="cartitle">用车时间 {{ userCarTime() }}天</view>
            <view class="carmain">
              <view class="carmain-left">
                <view class="carmain-left-top"></view>
                <view class="carmain-left-middle"></view>
                <view class="carmain-left-btn"></view>
              </view>
              <view class="carmain-right">
                <view class="carmain-right-top">{{
                  listDetail.car_begin_time
                }}</view>
                <view class="carmain-right-btn">{{
                  listDetail.car_end_time
                }}</view>
              </view>
            </view>

            <view class="cartitle">用车行程</view>
            <view class="carmain">
              <view class="carmain-left">
                <view class="carmain-left-top"></view>
                <view class="carmain-left-middle"></view>
                <view class="carmain-left-btn"></view>
              </view>
              <view class="carmain-right">
                <view class="carmain-right-top"> {{
                  listDetail.place_bengin
                }}</view>
                <view class="carmain-right-btn">{{
                  listDetail.place_end
                }}</view>
              </view>
            </view>
          </view>
        </view>

        <view style="margin-bottom: 15px">
          <h3>车辆信息</h3>
          <view class="cardata">
            <view class="cardata-box">
              <view class="carnumber"> {{listDetail.carInfoRes.car_num}} </view>
              <view class="carinfo">  {{listDetail.carInfoRes.carbrand}} | {{ carColor(listDetail.carInfoRes.color) }} {{listDetail.carInfoRes.seat_num}}座 </view>
            </view>
          </view>
        </view>
      </view>
	  <step :flowTaskRes="listDetail.flowTaskRes" :username="listDetail.username">
	  </step>
    </view>
  </view>
</template>

<script>
import { timeFormat } from "@/utils/dateUtils.js";
import step from "@/components/step/step.vue";
export default {
  data() {
    return {
		listDetail: {
		  carInfoRes: {
		    car_num: "",
		    carbrand: "",
		    color: "1",
		    seat_num: "",
		  },
		  flowTaskRes: [
		    {
		      nickname: "",
		      resul: "",
		    },
		    {
		      nickname: "",
		      resul: "",
		    },
		  ],
		},
	};
  },
  comments: {
    step,
  },
onLoad(option) {
	 this.getDetailInfo(option.id, option.gwflowid)
},
  methods: {
	  userCarTime() {
	    let start = Date.parse(this.listDetail.car_begin_time);
	    let end = Date.parse(this.listDetail.car_end_time);
	    let day = Math.floor((start - end) / (24 * 3600 * 1000));
	    return Math.abs(day);
	  },
	  getLocalTime(nS) {
	    return timeFormat(nS, "yyyy/MM/dd");
	  },
	  getDetailInfo(id, gwflowid) {
	    let formData = {
	      _id: id,
	      gwflowid: gwflowid,
	      user_id: uni.getStorageSync("username"),
	    };
	    uniCloud
	      .callFunction({
	        name: "gongwen",
	        data: {
	          name: 'gwGetDetail',
	          data: formData,
	        },
	      })
	      .then((res) => {
	        uni.hideLoading();
	        this.listDetail = res.result.data[0];
	        this.Loading = false;
	      });
	  },
  },
};
</script>

<style lang="less" scoped>
.header {
  background-color: #ffffff;
  padding: 30rpx;
  display: flex;
  padding-bottom: 0;
}

.header_avatar {
  width: 54px;
  height: 54px;
  margin-right: 15px;
  border-radius: 4px;
}

.header_name {
  font-size: 36rpx;
  font-weight: bold;
}

.header_status {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #999999;
  margin-top: 10rpx;
  font-size: 28rpx;
}

.baseMsg {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
}

.baseMsg_header {
  display: flex;
  align-items: center;
}

.baseMsg_header_img {
  width: 24px;
  height: 24px;
  margin-right: 20rpx;
}

.baseMsg_header_title {
  font-weight: bold;
}

.baseMsg_item {
  display: flex;
  margin: 20rpx 0;
}

.baseMsg_item_title {
  color: #999999;

  width: 140rpx;
}

.baseMsg_content {
  flex: 1;
}

.baseMsg_item_val {
  padding-left: 12px;
  flex: 1;
}

.baseMsg_detail {
  width: 92%;
  margin: 0 auto;
  background-color: #ffffff;
  padding-top: 30rpx;
}

.bottom {
  background-color: #ffffff;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: space-around;
  padding: 5px 0;
}

.bottom_ico {
  width: 48rpx;
  height: 48rpx;
  margin: 0 auto;
}

.bottom_btn {
  align-items: center;
}

.bottom_text {
  font-size: 24rpx;
}

.submit {
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  color: #ffffff;
  width: 90%;
  background-color: #3b88f5;
  line-height: 90rpx;
  font-size: 12pt;
}

.file {
  display: flex;
  width: 580rpx;
}

.file_list {
  line-height: 30px;
  margin-bottom: 5px;
  width: 300rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.file_list_btn {
  width: 150rpx;
  height: 60rpx;

  line-height: 60rpx;
}

.state {
  margin-top: 3rpx;
  font-size: 13px;
}
.title {
  width: 280rpx;
}
.box-border {
  width: 694rpx;
  margin: 28rpx;
}
.usercardata {
  width: 100%;
  padding: 18rpx;
  height: 375rpx;
  background-color: #f2f9ff;
  .cartitle {
    font-weight: 700;
    font-size: 30rpx;
  }
  .carmain {
    display: flex;
    .carmain-left {
      height: 150rpx;
      width: 30rpx;
      margin-right: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .carmain-left-top {
        width: 16rpx;
        border: solid #1577ff 2rpx;
        height: 16rpx;
        border-radius: 16rpx;
        background-color: #1577ff;
      }
      .carmain-left-middle {
        border: solid 2rpx #cccccc;
        height: 40rpx;
        width: 0;
      }
      .carmain-left-btn {
        width: 16rpx;
        border: solid #1577ff 2rpx;
        height: 16rpx;
        border-radius: 16rpx;
      }
    }
    .carmain-right {
      width: 400rpx;
      padding: 26rpx 0;
      font-size: 26rpx;

      .carmain-right-top {
        width: 100%;
      }
      .carmain-right-btn {
        margin-top: 29rpx;
      }
    }
  }
}

.cardata {
  box-sizing: border-box;

  width: 638rpx;
  height: 132rpx;
  margin-top: 20rpx;
  background-color: #f2f9ff;
  padding: 24rpx 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .cardata-box {
    .carinfo {
      font-size: 14rpx;
      color: #999;
      margin-top: 10rpx;
    }
  }
  .rigthicon {
    width: 40rpx;
    height: 40rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}

.lc {
  padding: 5rpx;
  padding-bottom: 20rpx;

  .cartitle {
    font-weight: 700;
    font-size: 30rpx;
  }
  .carmain {
    display: flex;
    .carmain-left {
      height: 150rpx;
      width: 30rpx;
      margin-right: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .carmain-left-top {
        width: 16rpx;
        border: solid #1577ff 2rpx;
        height: 16rpx;
        border-radius: 16rpx;
        background-color: #1577ff;
      }
      .carmain-left-middle {
        border: solid 2rpx #cccccc;
        height: 60rpx;
        width: 0;
      }
      .carmain-left-btn {
        width: 16rpx;
        border: solid #1577ff 2rpx;
        height: 16rpx;
        border-radius: 16rpx;
      }
    }
    .carmain-right {
      width: 400rpx;
      padding: 20rpx 0;
      font-size: 26rpx;

      .carmain-right-top {
        width: 100%;
      }
      .carmain-right-btn {
        margin-top: 45rpx;
      }
    }
  }
}
</style>
