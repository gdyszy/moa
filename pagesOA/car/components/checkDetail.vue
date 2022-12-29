<template>
  <view>
    <loading :loading="Loading" ></loading>
    <view v-for="(item, index) in list" :key="index">
      <recordItem
        :listData="item"
        @checkDetail="checkDetail"
        :typeFrom="typeFrom"
        :time="time(item.create_date)"
      ></recordItem>
    </view>
    <view class="tips">已显示全部</view>
  </view>
</template>
<script>
import recordItem from "./formCommon/record.vue";
import { timeFormat } from "@/utils/dateUtils.js";
export default {
  components: {
    recordItem,
  },
  data() {
    return {
       Loading: true,
      formData: {
        modeid: 3,
        user_id: uni.getStorageSync("username"),
        result: 0,
      },
      list: [
      ],
      typeFrom: 3,
    };
  },
  // created() {
  // 	this.getList()
  // },
  props: {
    refresh: {
      type: Number,
      default: 0,
    },
    modeid: {
      type: String,
      default: "",
    },
    flowid: {
      type: String,
      default: "",
    },
    filterIndex: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    refresh(newVal, oldVal) {
      if (newVal == 1) {
        this.getList();
      }
    },
    filterIndex(newVal, oldVal) {
      this.formData.result = newVal;
      this.getList();
    },
  },
  methods: {
    time(e){
        return timeFormat(e, "yyyy-MM-dd")
    },
    checkDetail(e) {
      uni.navigateTo({
        url: `/pagesOA/carExamine/detail?_id=${e.id}&type=${this.typeFrom}&gwflowid=${this.flowid}`,
      });
    },
    getList() {
      let that = this;
      that.loading = true;
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwList",
            data: this.formData,
          },
        })
        .then((res) => {
          that.list = res.result.data;
          this.Loading = false
        });
    },
  },
};
</script>

<style scoped>
</style>
