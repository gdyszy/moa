<template>
  <view>
    <view>
      <tab selectClass="Selfont" :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></tab>
      <view v-show="TabCur == 0">
        <warehouse @jump="tabChange" :stat="id"></warehouse>
      </view>
      <view v-show="TabCur == 1">
        <statistics></statistics>
      </view>
    </view>
  </view>
</template>

<script>
import tab from '@/components/wuc-tab/wuc-tab.vue';
// import startSubmit from './components/startSubmit.vue';
import warehouse from './components/warehouse/index.vue';
import checkDeatil from './components/checkDetail.vue';
import statistics from './components/statistics/statistics.vue';
import getLogin from '@/mixins/index.js';
export default {
  components: {
    tab,
    // startSubmit,
    checkDeatil,
    statistics,
	warehouse,
  },
  data() {
    return {
      TabCur: 0,
      tabList: [{ name: '资产入库' }, { name: '资产统计' }],
      selectStatus: false,
      filterIndex: 0,
      id: 1,
    };
  },
  mixins: [getLogin],
  methods: {
    // Change1() {
    // 	uni.navigateTo({
    // 		url: './components/warehouse/index'
    // 	})
    // },
    // Change2() {
    // 	uni.navigateTo({
    // 		url: 'components/statistics/statistics'
    // 	})
    // },

    tabChange(index) {
      this.TabCur = index;
      this.TabCur == 1 ? (this.selectStatus = true) : (this.selectStatus = false);
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
  watch: {},
};
</script>

<style lang="scss" scoped>
button {
  margin-bottom: 10rpx;
}
</style>
