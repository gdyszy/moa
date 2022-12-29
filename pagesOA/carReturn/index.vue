<template>
  <view>
    <tab
      selectClass="Selfont"
      :tab-list="tabList"
      :tabCur.sync="TabCur"
      :selectStatus="selectStatus"
    ></tab>
    <view v-if="TabCur == 0">
      <apply
        :sid="id"
        :gwGetType="gwGetType"
        :flowid="flowid"
        :carData="carData"
        :formData="formData"
      ></apply>
    </view>
    <view v-show="TabCur == 1">
      <check-deatil
        :refresh="TabCur"
        :gwGetType="gwGetType"
        :flowid="flowid"
        :modeid="modeid"
        :filterIndex="filterIndex"
        ref="checkDetail"
      ></check-deatil>
    </view>
  </view>
</template>

<script>
import tab from "@/components/wuc-tab/wuc-tab.vue";
import apply from "./apply.vue";
import checkDeatil from "./checkDetail.vue";
import getLogin from "@/mixins/index.js";

export default {
  components: {
    tab,
    apply,
    checkDeatil,
  },
  data() {
    return {
      TabCur: 0,
      tabList: [{ name: "提交申请" }, { name: "申请记录" }],
      selectStatus: false,
      filterIndex: 0,
      id: "",
      carData: {},
      flowid: "",
      gwGetType: {},
      modeid: "",
      formData: {
         carInfoRes: {
          car_num: "",
          carbrand: "",
          color: "1",
          seat_num: "",
        },
        username: uni.getStorageSync("userInfo").nickname,
        car_id: "",
        optname: "",
        car_num:"",
        carbrand:'',
        car_begin_time: "",
        car_end_time:"",
        optid: "",
        optname: "",
        attachments: [],
        explain:""
      },
    };
  },
  mixins: [getLogin],
  onLoad(e) {
    if (e.info) {
      let info = JSON.parse(e.info);
  
      Object.assign(this.formData, info);
        


    }
    this.getType()
  },
  methods: {
    getType() {
      uni.showLoading();
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwGetType",
            data: {
              modeid: 4, //用车申请 3  ，车辆退回申请 4
            },
          },
        })
        .then((res) => {
          this.flowid = res.result.data[0]._id;
          this.lc(res.result.data[0]);
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
    lc(e) {
      this.flowid = e._id;
      let data = {
        flowid: e._id,
        department_id: uni.getStorageSync("userInfo").department_id?uni.getStorageSync("userInfo").department_id[0]:'',
      };

      uni.showLoading();
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "getSN",
            data,
          },
        })
        .then((res) => {

          this.gwGetType = res.result;
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
    custom(obj) {
      this.TabCur = obj.tabIndex;
      this.filterIndex = obj.sid;
      this.$refs.checkDetail.getList();
    },
    resvise(e) {
      this.TabCur = e.tabIndex;
      this.id = e.id;
    },
  },
};
</script>

<style>
page {
  background-color: #f8f8f8;
  display: block;
}
</style>
