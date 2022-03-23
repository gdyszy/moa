<template>
  <view class="content">
    <view v-if="status !== 0">
		<template v-if="carListData.length!=0">
      <view  v-for="(item, index) in carListData" :key="index">
        <view class="carbox" @click="setCarData(item, index)">
          <view class="number">
            <view class="num-left">{{ item.car_num }}</view>
            <view class="num-right" v-if="item.select == true">
              <image src="./image/choose.png" mode="" />
              <span class="num-right-txt">当前选择</span>
            </view>
          </view>
          <view class="model"
            ><span style="padding-right: 20rpx">型号特征:</span
            >{{ item.carbrand }}</view
          >
          <view class="status">
            <span>设备状态: </span>
            <span style="color: #0bb58c" v-if="item.status == 1">可用</span>
            <span style="color: #fa9c18" v-else>在用</span>
          </view>
        </view>
      </view>
	   </template>
	   <view class="tips" v-else> 暂无可用车辆 </view>
    </view>

    <view v-else>
		<template v-if="carListData.length!=0">
      <view  v-for="(item, index) in carListData" :key="index">
        <view class="carbox" @click="setCarData(item, index)">
          <view class="number">
            <view class="num-left">{{ item.carInfo[0].car_num }}</view>
            <view class="num-right" v-if="item.select == true">
              <image src="./image/choose.png" mode="" />
              <span class="num-right-txt">当前选择</span>
            </view>
          </view>
          <view class="model"
            ><span style="padding-right: 20rpx">型号特征:</span
            >{{ item.carInfo[0].carbrand }}</view
          >
          <view class="status">
            <span>设备状态: </span>
            <span style="color: #0bb58c" v-if="item.status == 1">可用</span>
            <span style="color: #fa9c18" v-else>在用</span>
          </view>
        </view>
      </view>
	  </template>
	  <view class="tips" v-else> 暂无可退车辆 </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      carListData: [],
      status: 1,
    };
  },
  onLoad(e) {
    if (e.status) {
      this.status = Number(e.status);
      this.getgwUseCarList(e.id);
      return;
    }

    this.getCarList(e.id);
  },

  methods: {
    getgwUseCarList(id) {
      uni.showLoading();
      let params = {
        modeid: 3,
        user_id: uni.getStorageSync("username"),
      };
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwUseCarList",
            data: params,
          },
        })
        .then((res) => {
          if (id) {
            res.result.data.forEach((item, index) => {
              if (item.car_id == id) {
                res.result.data[index].select = true;
              }
            });
          }

          this.carListData = res.result.data;
        });
      uni.hideLoading();
    },

    getCarList(id) {
      uni.showLoading();
      uniCloud
        .callFunction({
          name: "car",
          data: {
            name: "getCarInfoList",
            data: {
              status: this.status,
            },
          },
        })
        .then((res) => {
          if (id) {
            res.result.data.forEach((item, index) => {
              if (item._id == id) {
                res.result.data[index].select = true;
              }
            });
          }
          this.carListData = res.result.data;

          uni.hideLoading();
        })
        .catch((err) => {
          uni.hideLoading();
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    setCarData(item, index) {
      if (item.status == 1 || this.status == 0) {
        uni.$emit("selectCarData", item);
        uni.navigateBack({
          delta: 1,
        });
      } else {
        uni.showToast({
          icon: "none",
          title: "当前选择车辆不可用",
          duration: 2000,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.content {
  background-color: #f4f5f7;
}

span {
  display: inline-block;
}

.carbox {
  width: 682rpx;
  height: 194rpx;
  background-color: #ffffff;
  margin: 0 auto;
  margin-top: 20rpx;
  padding: 26rpx 34rpx;
  .number {
    display: flex;
    justify-content: space-between;
    .num-left {
      font-size: 36rpx;
      font-weight: bold;
    }

    .num-right {
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        height: 48rpx;
        width: 48rpx;
        display: block;
      }
      .num-right-txt {
        line-height: 48rpx;
        font-size: 26rpx;
        color: #1e7ff5;
      }
    }
  }
  .model {
    color: #000000;
    margin-top: 10rpx;
    line-height: 48rpx;
  }
  .status {
    line-height: 40rpx;
  }
}
.model,
.status > span {
  margin-right: 20rpx;
  overflow: scroll;
}
.tips {
  width: 100vw;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 32rpx;
}
</style>