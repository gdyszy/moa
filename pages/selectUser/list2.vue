<template>
  <view class="page">
    <loading :loading="loading" />
    <view class="uni-header uhead">
      <view class="uni-group">
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
    <uni-list class="uhead" :border="false">
      <uni-list-item :title="department" :ellipsis="0" :ltextclass="0" />
    </uni-list>
    <view class="container" v-show="userData != '' || departmentData != ''">
      <view class="uni-list">
        <checkbox-group @change="checkboxChange">
          <label
            class="uni-list-cell uni-list-cell-pd"
            v-for="item in userData"
            :key="item._id"
          >
            <view class="personOptionsItem" @click="select(item)">
              <view class="optionsChoice">
                  <checkbox
                  class="checkBoxChoice"
                  :value="item._id"
                  :checked="userValidate(item.username)== -1? item.checked : true
                  "
                />
              </view>
              <view class="personIntroduction">
                <text class="personName">{{ item.nickname }}</text>
              </view>
            </view>
          </label>
        </checkbox-group>
      </view>
      <uni-list :border="false" v-if="departmentData">
        <uni-list-item
          v-for="(item, index) in departmentData"
          :key="index"
          :leftText="item.percount"
          :ltextclass="0"
          :rtextclass="0"
          showArrow
          :title="item.name"
          :ellipsis="0"
          :clickable="true"
          @click="depClick(item._id, item.name, item.percount)"
        />
      </uni-list>
    </view>
    <view
      style="height: 108rpx"
      v-show="$store.state.selectUser.selectUser.length"
    ></view>
    <view
      class="statisticalBar"
      v-show="$store.state.selectUser.selectUser.length"
    >
      <view class="barContent">
        <text class="contacts"
          >{{ $store.state.selectUser.selectUser.length }}名联系人</text
        >
        <button type="default" class="addButton" @click="jumpEmailPage">
          添加
        </button>
      </view>
    </view>
  </view>
</template>

<script>
const db = uniCloud.database();
// 表查询配置
const dbOrderBy = "create_date desc";
const dbSearchFields = ["username"]; // 支持模糊搜索的字段列表
const dbCollectionName = "uni-id-users";
import loading from "./components/Loading.vue";
export default {
  components: {
    loading,
  },
  data() {
    return {
      ContactsAdd: "",
      loading: true,
      hasMore: "",
      department: "查询结果",
      percount: "",
      departmentData: [],
      userData: [],
      department_id: "",
      pic: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png",
      query: "",
      where: "",

      selectPerson: "0",
      selectPersonName: [],
    };
  },
  onLoad(e) {
    if (e.name) {
      this.department = e.name;
    }
    if (e.percount) {
      this.percount = e.percount;
    }
    this.department_id = e.department_id;
    if (e.children == "true") {
      this.getDepartment(e.department_id);
      this.getUser(e.department_id);
    } else if (e.search == "true") {
      this.query = e.query;
      this.getSearch(e.query);
    } else {
      this.getUser(e.department_id);
    }
    if (uni.getStorageSync("userInfo").role == "admin") {
      this.ContactsAdd = true;
    }
  },

  computed: {
    countCheck() {
      return this.selectPerson;
    },
  },
  methods: {
    userValidate(val){
     let user =  this.$store.state.selectUser.selectUser.findIndex(item=>{
        return val == item.username
       })
      return user
    },

    select(e) {
      this.$store.dispatch("selectUser/actionsadduser", e);
    },
    checkboxChange: function (e) {
      var items = this.userData,
        values = e.detail.value;
      for (var i = 0, lenI = items.length; i < lenI; ++i) {
        const item = items[i];
        if (values.indexOf(item._id) >= 0) {
          this.$set(item, "checked", true);
        } else {
          this.$set(item, "checked", false);
        }
      }
    },
    jumpEmailPage() {
      let pages = getCurrentPages();
      let num = Number;
      pages.forEach((item, index) => {
        if (item.route == this.$store.state.selectUser.pageRouter) {
          num = pages.length - index - 1;
        }
      });
      uni.$emit("selectUser", this.$store.state.selectUser.selectUser);
       this.$store.state.selectUser.selectUser = [];
      uni.navigateBack({
        delta: num,
      });
    },
    getDepartment(id) {
      const parent_id = id;
      db.collection("opendb-department")
        .orderBy("sort asc")
        .where({
          parent_id: id,
        })
        .get()
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
    getUser(id) {
      var _this = this;
      const parent_id = id;
      db.collection("uni-id-users")
        .where({
          department_id: id,
        })
        .field("username,nickname,name,department_id,mobile,email")
        .get()
        .then((res) => {
          let userList = res.result.data;

          userList.forEach((item) => {
            item.checked = false;
          });
          this.userData = userList;
          this.loading = false;
        })
        .catch((err) => {
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
          this.loading = false;
        })
        .finally(() => {});
    },
    back() {
      uni.navigateBack({});
    },
    search() {
      const query = this.query.trim();
      if (!query) {
        query = "";
      }
      uni.redirectTo({
        url: "./list2?search=true&query=" + query,
      });
    },
    getSearch(query) {
      var _this = this;
		db.collection("uni-id-users").where({
				'nickname': new RegExp(query)
			}).field("username,nickname,name,department_id,post,mobile,email,avatar").get()
			.then((res) => {
				this.loading = false;
          let userList = res.result.data;
          let listArr = [];
          userList.forEach((ele) => {
            let obj = {};
            obj._id = ele.username + "|" + ele.nickname;
            if (ele.nickname != undefined) {
              obj.nickname = ele.nickname;
            } else {
              obj.nickname = "用户 (" + ele.username + ")";
            }

            listArr.push(obj);
          });
          this.userData = listArr;
        })
        .catch((err) => {
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },

    depClick(department_id, name, percount) {
      let url =
        "./list2?department_id=" +
        department_id +
        "&name=" +
        name +
        "&percount=" +
        percount;
      uni.navigateTo({
        url: url,
      });
    },
  },
};
</script>

<style>
.load-more {
  background-color: #f7f8fa;
}

.uni-list-cell {
  justify-content: flex-start;
}
.personOptionsItem {
  height: 60px;
  background-color: #fff;
  display: flex;
}
.optionsChoice {
  width: 56px;
  padding: 12px 10px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #fff;
}
.checkBoxChoice {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
}
.personIntroduction {
  flex: 1;
  height: 50px;
  border-bottom: 1px solid #e5e5e5;
  padding-top: 10px;
}
.personName {
  line-height: 70rpx;
  font-size: 15px;
}
.personEmail {
  display: block;
  margin-top: 4px;
  font-size: 11px;
}
.statisticalBar {
  width: 100%;
  height: 54px;
  background-color: #f4f5f7;
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  z-index: 10;
}
.contacts {
  font-size: 14px;
  display: flex;
  align-items: center;
}
.barContent {
  width: 350px;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addButton {
  width: 62px;
  height: 34px;
  background-color: #2b81fa;
  font-size: 14px;
  color: #fff;
  border-radius: 0;
  margin: 0;
}
</style>
