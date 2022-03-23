<template>
  <view class="page">
    <loading :loading="loading"></loading>
    <view class="uni-header uhead">
      <view class="uni-group" style="padding-right: 20rpx">
        <uni-easyinput
          class="left"
          prefixIcon="search"
          v-model="query"
          placeholder="搜索联系人"
          @confirm="search"
          @iconClick="search"
        ></uni-easyinput>
      </view>
    </view>
    <view class="uhead">
      <uni-list :border="false">
        <uni-list-item>
          <template slot="header">
            <image
              class="slot-image"
              src="/static/txl/ico_company_@3x.png"
              mode="widthFix"
            ></image>
          </template>
          <view slot="body">
            <text class="uni-list-item__content-title ufont">{{
              companyName
            }}</text>
          </view>
        </uni-list-item>
      </uni-list>
    </view>
    <view class="container">
      <uni-list :border="false">
        <uni-list-item
          v-for="(item, index) in departmentData"
          :key="index"
          :leftText="item.percount"
          :ltextclass="0"
          :rtextclass="0"
          :rightText="item.children == 0 ? '' : item.children.length + '个部门'"
          showArrow
          :title="item.name"
          :ellipsis="0"
          :clickable="true"
          @click="depClick(item._id, item.name, item.percount, item.children)"
        />
      </uni-list>
      <!-- <uni-load-more
        :status="loading ? 'loading' : hasMore ? 'more' : 'noMore'"
      ></uni-load-more> -->
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import loading from "./components/Loading.vue";

const db = uniCloud.database();
export default {
  components: {
    loading,
  },
  data() {
    return {
      companyName: "广东开发公司",
      loading: true,
      hasMore: "",
      departmentData: [],
      query: "",
      where: "",
      loadMore: {
        contentdown: "",
        contentrefresh: "",
        contentnomore: "",
      },
    };
  },
  onPullDownRefresh() {
    this.$refs.udb.loadData(
      {
        clear: true,
      },
      () => {
        uni.stopPullDownRefresh();
      }
    );
  },
  onReachBottom() {
    this.$refs.udb.loadMore();
  },
  onShow() {
    this.getCompany();
  },
  onLoad(e) {
    this.checkToken((res) => {
      //判断token 是否有效
      if (res == true) {
        this.getDepartment();
        this.getCompany();
      } else {
      }
    });
  },
  computed: {
    ...mapState(["hasLogin"]),
  },
  methods: {
    getCompany() {
      db.collection("contactUs")
        .field("companyname")
        .get()
        .then((res) => {
          const data = res.result.data[0];
          if (data) {
            if (data._id) {
              this.companyName = data.companyname;
            }
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    getDepartment() {
      db.collection("opendb-department")
        .orderBy("sort asc")
        .get({
          getTree: {},
        })
        .then((res) => {
          this.departmentData = res.result.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    search() {
      const query = this.query.trim();
      if (!query) {
        query = "";
      }
      uni.navigateTo({
        url:
          "/pagesContacts/contacts/list2?search=true&query=" +
          query +
          "&from=email",
      });
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear,
      });
    },
    depClick(department_id, name, percount, children) {
      let url =
        "./list2?department_id=" +
        department_id +
        "&name=" +
        name +
        "&percount=" +
        percount +
        "&from=email";
      if (children != "") {
        url = url + "&children=true";
      }

      uni.navigateTo({
        url: url,
      });
    },
    handleItemClick(id) {
      uni.navigateTo({
        url: "/pagesContacts/contacts/detail?id=" + id,
      });
    },
    fabClick() {
      // 打开新增页面
      uni.navigateTo({
        url: "/pagesContacts/contacts/add",
        events: {
          // 监听新增数据成功后, 刷新当前页面数据
          refreshData: () => {
            this.$refs.udb.loadData({
              clear: true,
            });
          },
        },
      });
    },
  },
};
</script>

<style>
</style>
