<template>
  <view class="record" @click="checkDetail">
    <view class="record_img">
      <image
        src="/static/workOverTime/ico_page_@2x.png"
        style="width: 100%; height: 100%"
      ></image>
    </view>
    <view style="width: 85%">
      <view class="record_detail">
        <view class="record_detail_title">{{ listData.title }} </view>

        <view class="record_detail_time" v-if="time">
          {{ time }}
        </view>

        <view class="record_detail_ico" v-else>
          <image
            src="/static/workOverTime/btn_message.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </view>
      <view class="record_time">
        <view v-if="!patchCardTime">
          <text>用车时间:</text>
          <text>{{ listData.car_begin_time }}</text>
        </view>
        <view v-if="!patchCardTime">
          <text>结束时间:</text>
          <text>{{ listData.car_end_time }}</text>
        </view>
        <view>
          <view
            >审批状态: <span v-if="listData.result == 1">审批中</span>
            <span v-if="listData.result == 10" style="color: #0bb58c"
              >申请通过</span
            >
            <span v-if="listData.result == 20">申请驳回</span>
            <span v-if="listData.result == 30" style="color: #f39819"
              >待审批</span
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { timeStamp } from "@/utils/time.js";

export default {
  props: {
    listData: {
      type: Object,
      default: {},
    },
    time: {
      type: String,
      default: () => {},
    },
    typeFrom: {
      type: Number,
    },
    patchCardTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      leaveTitle: "请假",
    };
  },
  filters: {
    timeStamp,
  },
  methods: {
    checkDetail() {
      this.$emit("checkDetail", {
        id: this.listData._id,
      });
    },
  },
};
</script>

<style scoped>
.record {
  width: 90%;
  margin: 20rpx auto;
  background-color: #ffffff;
  display: flex;
  padding: 28rpx 20rpx 0rpx;
}

.record_img {
  width: 58rpx;
  height: 58rpx;
  margin-right: 20rpx;
}

.record_detail {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.record_detail_title {
  font-weight: bold;
}

.record_detail_ico {
  width: 36rpx;
  height: 36rpx;
}

.record_time {
  font-size: 24rpx;
  color: #999999;
  padding-bottom: 20rpx;
}

.record_time view {
  margin: 13rpx 0;
}

.record_bottom {
  display: flex;

  color: #999999;
  padding: 20rpx 0;
}
.record_detail_time {
  position: absolute;

  top: 8rpx;
  right: -8rpx;
  color: #999999;
  font-size: 24rpx;
}
</style>
