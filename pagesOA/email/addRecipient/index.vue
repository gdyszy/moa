<template>
  <!-- 通讯录联系人 -->
  <view>
    <view class="top">
      <view class="top-little">
        <uni-easyinput
          class="left"
          prefixIcon="search"
          placeholder="搜索联系人"
          @confirm="search"
          v-model.trim="searchName"
        />
      </view>
    </view>
    <view class="line"></view>
    <view class="contacts" @click="getContacts">
      <view class="contacts-title">通讯录</view>
      <image
        src="../../../static/icon_arrow_right.png"
        mode="scaleToFill"
        class="contacts-icon"
      />
    </view>
    <view class="line"></view>
    <scroll-view scroll-y="true">
      <label v-for="item in searchList" :key="item.username">
        <checkbox-group @change="log">
          <view class="people">
            <view class="left-box"
              ><checkbox :value="item.nickname?item.nickname:item.username" checked="item.checked"
            /></view>
            <view class="right-box">
              <view class="name">{{ item.nickname?item.nickname:item.username }}</view>
              <!-- <view class="email">{{ item.phoneNumbers.length > 0 ? item.phoneNumbers[0].value : '' }}</view> -->
              <!-- <view class="email">{{
                item.emails.length > 0 ? item.emails[0].value : ""
              }}</view> -->
            </view>
          </view>
        </checkbox-group>
      </label>
    </scroll-view>
    <!-- <view class="bottom">
      <view class="bottom-left">{{ sure.length }} 名联系人</view>
      <button
        open-type=""
        hover-class="button-hover"
        class="bottom-right"
        @click="add"
      >
        添加
      </button>
    </view> -->
  </view>
</template>

<script>
import uniEasyinput from '../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue';
export default {
  components: { uniEasyinput },
  data() {
    return {
      searchName: "",
      list: [],
      searchList: [],
      sure: [],
      addType: "",
      addInfo: "",
    };
  },
  onLoad(e) {
	  
	  let user =  this.$store.state.selectUser.selectUser.findIndex(item=>{
	    this.searchList.push(item)
	    })
  },
  methods: {
    //获取通讯录
    getContacts: function () {
      var _this = this;
      // uni.navigateTo({
      //   url: "./list?from=email&addType=" + this.addType + "&addInfo=" + this.addInfo,
      // });
      uni.navigateTo({
        url: "/pages/selectUser/index",
      });
    },
    search() {
      const name = new RegExp(this.searchName);
      let list = this.list;
      this.searchList = list.filter((item) => {
        return name.test(item.name);
      });
      const query = this.searchName.trim();
      if (!query) {
        query = "";
      }
      uni.navigateTo({
        url:
          "/pages/selectUser/list2?search=true&query=" +
          query +
          "&from=email",
      });
    },
    log(e) {
      return;
      const { value } = e.detail;
      this.sure = value;
      for (let i of this.sure) {
        if (i.emails.lenght == undefined && !i.emails[0]) {
          let name = i.name;
          uni.showToast({
            title: `${name}没有邮箱`,
            duration: 1500,
            icon: "none",
          });
          return;
        }
      }
    },
    add() {
      for (let i of this.sure) {
        if (i.emails.lenght == undefined && !i.emails[0]) {
          let name = i.name;
          uni.showToast({
            title: `${name}没有邮箱`,
            duration: 1500,
            icon: "none",
          });
          return;
        }
      }

      let personName = "";
      let addresseeId = "";

      this.sure.forEach((item) => {
        personName += `${item.nickname},`;
        addresseeId += `${item._id};`;
      });
      personName = personName.slice(0, -1);
      addresseeId = addresseeId.slice(0, -1);

      let vaule = {
        addType: this.addType,
        personName,
        addresseeId,
      };

      // uni.$emit('planAdd', { sure: this.sure, addType: this.addType });
      uni.$emit("selectUser", vaule);
      uni.navigateBack();
    },
  },
};
</script>

<style lang="less" scoped>
.top {
  // width: 100vw;
  height: 88rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10rpx;
  .top-little {
    width: 650rpx;
    margin: 0 28rpx;
  }
}
.contacts {
  width: 91vw;
  margin: 0 36rpx;
  height: 106rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .contacts-title {
    color: rgba(0, 0, 0, 0.9);
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 30rpx;
    line-height: normal;
    letter-spacing: 0rpx;
    text-align: left;
  }
  .contacts-icon {
    width: 36rpx;
    height: 36rpx;
  }
}
.line {
  width: 100vw;
  height: 32rpx;
  background: rgba(244, 245, 247, 1);
}
.people {
  display: flex;
  width: 100vw;
  height: 122rpx;
  background: rgba(255, 255, 255, 1);
  .left-box {
    width: 110rpx;
    height: 120rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 120rpx;
    width: 80%;
    border-bottom: 2rpx solid #ccc;
    .name {
      color: rgba(0, 0, 0, 0.9);
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 30rpx;
      line-height: normal;
      letter-spacing: 0rpx;
      text-align: left;
    }
    .email {
      color: rgba(0, 0, 0, 0.6);
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 22rpx;
      line-height: normal;
      letter-spacing: 0rpx;
      text-align: left;
    }
  }
}
.bottom {
  height: 108rpx;
  width: 100vw;
  background: rgba(244, 245, 247, 1);
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .bottom-left {
    color: rgba(0, 0, 0, 0.7);
    font-family: PingFang SC;
    font-weight: medium;
    font-size: 28rpx;
    line-height: normal;
    letter-spacing: 0rpx;
    text-align: left;
  }
  .bottom-right {
    width: 124rpx;
    height: 68rpx;
    border-radius: 4rpx;
    background: rgba(59, 137, 245, 1);
    color: rgba(255, 255, 255, 1);
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 28rpx;
    line-height: 68rpx;
    letter-spacing: 0rpx;
    text-align: center;
    margin: 0;
  }
  .bottom-left,
  .bottom-right {
    margin: 0 28rpx;
  }
}
</style>
