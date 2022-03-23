<template>
  <view>
    <view v-for="(item, index) in list" :key="index">
      <recordItem
        :listData="item"
        @checkDetail="checkDetail"
        :typeFrom="typeFrom"
      ></recordItem>
    </view>
    <view class="tips">已显示全部</view> 
  </view>
</template>
<script>
import recordItem from "./formCommon/record.vue";
export default {
  components: {
    recordItem,
  },
  data() {
    return {
      formData: {
        modeid: 2,
        user_id: uni.getStorageSync("username"),
        result: 0,
      },
      list: [
        {
          username: "文西",
          department: [{ name: "测试部" }],
          create_date: "2020 11-11 12:00",
          gwtitle: "123",
        },
      ],
      typeFrom: 2,
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
    checkDetail(e) {
      uni.navigateTo({
        url: `/pagesOA/carExamine/detail?id=${e.id}&type=${this.typeFrom}`,
      });
    },
    getList() {
      let that = this;
      that.loading = true;
      uniCloud
        .callFunction({
          name: "flow",
          data: {
            name: "flowGetList",
            data: this.formData,
          },
        })
        .then((res) => {
          that.list = res.result.data;
        });
    },
  },
};
</script>

<style scoped>
.tips {
  color: #b2b2b2;
  width: 40%;
  margin: 20rpx auto;
  text-align: center;
}
</style>
