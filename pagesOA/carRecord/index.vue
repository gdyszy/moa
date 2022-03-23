<template>
  <view>
    <view v-for="(item, index) in mainData" :key="index">
      <checkDeatil
        :title="getLocalTime(item.create_date) + `的使用记录`"
        :list="list"
        :listText="item.carInfo[0].car_num"
        :listText2="item.carInfo[0].carbrand +`  `+ carColor(item.carInfo[0].color)"
        rightText="在用"
        :status="3"
        :statusText="statusText"
        @checkDetail="checkDetail(item)"
      >
      </checkDeatil>
    </view>
  </view>
</template>

<script>
import checkDeatil from "../driverFile/components/checkDetail.vue";
import { timeFormat } from "@/utils/dateUtils.js";

export default {
  components: {
    checkDeatil,
  },
  data() {
    return {
      list: ["车辆牌照", "型号特征"],
      statusText: ["在用", "可用"],
      mainData: [],
    };
  },

  onLoad() {
    this.getList();

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
        this.mainData = res.result.data;
      });
  },
  methods: {
    getLocalTime(nS) {
      return timeFormat(nS, "yyyy/MM/dd");
    },
    getList() {},
    checkDetail(item) {
      uni.navigateTo({
        url: "./carRecordInfo?id=" + item._id+"&gwflowid="+item.flowid,
      });
    },
  },
};
</script>

<style lang="less" scoped>
* {
  background-color: #f5f5f7;
  margin: 0;
  padding: 0;
}
</style>