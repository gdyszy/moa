<template>
  <view>
    <view class="box" v-for="(item, index) in list" :key="index">
      <view class="title">{{ item.title }}</view>
      <view class="flex-box">
        <view class="flex-item" v-for="items in item.little_list" :key="items.path" @click="ToDetailPage(items.path)">
          <image :src="items.img" mode="" class="item-img" />
          <view class="item-title">{{ items.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '用车管理',
          little_list: [
            {
              name: '车辆档案',
              img: '/static/ico_car.svg',
              path:'/pagesOA/carArchives/index'
            },
            {
              name: '司机档案',
              img: '/static/ico_driver.svg',
              path: '/pagesOA/driverFile/index',
            },
            {
              name: '用车申请',
              img: '/static/ico_apply.svg',
              path: '/pagesOA/car/index',
            },
            {
              name: '车辆退回申请',
              img: '/static/Frame41.svg',
              path: '/pagesOA/carReturn/index',
            },
/*            {
              name: '用车记录',
              img: '/static/Frame39.svg',
              path:'/pagesOA/carRecord/index'
            }, */
          ],
        },
        {
          title: '资产管理',
          little_list: [
            {
              name: '固定资产管理',
              img: '/static/ico_mange.svg',
              path: '/pagesOA/property/components/warehouse/fixed-assets',
            },
            {
              name: '固定资产入库',
              img: '/static/ico_inbound.svg',
              path: '/pagesOA/property/components/warehouse/index',
            },
            {
              name: '固定资产统计',
              img: '/static/ico_charts.svg',
              path: '/pagesOA/property/components/statistics/statistics',
            },
          ],
        },
        {
          title: '内部邮箱',
          little_list: [
            {
              name: '写邮件',
              img: '/static/ico_email.svg',
              path: '/pagesOA/email/sendEmails/index',
            },
            {
              name: '已发送',
              img: '/static/ico_sent.svg',
              path: '/pagesOA/email/emailList/index?type=2',
            },
            {
              name: '收件箱',
              img: '/static/ico_inbox.svg',
              path: '/pagesOA/email/emailList/index?type=1',
            },
            {
              name: '草稿箱',
              img: '/static/ico_draft.svg',
              path: '/pagesOA/email/emailList/index?type=3',
            },
            {
              name: '回收站',
              img: '/static/ico_deleted.svg',
              path: '/pagesOA/email/emailList/index?type=4',
            },
          ],
        },
      ],
    };
  },
  methods: {
    ToDetailPage(e) {
      uni.navigateTo({
        url: e,
      });
    },
  },
};
uni.navigateTo({
  url: './components/warehouse/fixed-assets',
});
</script>

<style lang="less" scoped>
.box {
  .title {
    color: rgba(0, 0, 0, 0.9);
    font-family: PingFang SC;
    font-weight: bold;
    font-size: 30rpx;
    line-height: normal;
    letter-spacing: 0rpx;
    text-align: left;
    margin: 32rpx 0 0 26rpx;
  }
  .flex-box {
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    margin: 24rpx 0 0 -6rpx;
    .flex-item {
      display: flex;
      flex-direction: column;
      // justify-content: center;
      align-items: center;
      margin: 24rpx 0 0 34rpx;
      width: 114rpx;
      .item-title {
        color: rgba(0, 0, 0, 0.7);
        font-family: PingFang SC;
        font-weight: medium;
        font-size: 26rpx;
        line-height: normal;
        letter-spacing: 0rpx;
        text-align: center;
      }
    }
  }
}
//#ifdef H5
.item-img {
  width: 120rpx;
  height: 120rpx;
}
//#endif
//#ifdef APP-PLUS||MP-WEIXIN
.item-img {
  width: 72rpx;
  height: 72rpx;
}
//#endif
</style>
