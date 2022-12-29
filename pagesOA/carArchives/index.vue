<template>
  <view class="page">
    <view v-for="(item, index) in carListData" :key="index">
      <checkDeatil
        @checkDetail="checkDetail(item._id)"
        :title="item.car_num"
        :listText="item.carbrand"
        :list="list"
        :status="item.status"
        :statusText="statusText"
      ></checkDeatil>
    </view>
	<view class="tips">已显示全部</view>
  </view>
</template>

<script>
import checkDeatil from "../driverFile/components/checkDetail.vue";
export default {
  components: {
    checkDeatil,
  },
  data() {
    return {
      carListData: [],
      list: ["型号特征", "设备状态"],
      statusText: ["在用", "可用"],
    };
  },

  onLoad() {
    this.getCarList();
  },
  methods: {
    getCarList() {
      uni.showLoading();
      uniCloud
        .callFunction({
          name: "car",
          data: {
            name: "getCarInfoList",
            data: {},
          },
        })
        .then((res) => {
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
    checkDetail(e) {
      uni.navigateTo({
        url: "./carInfo?id=" + e,
      });
    },
  },
};
</script>

<style>
</style>