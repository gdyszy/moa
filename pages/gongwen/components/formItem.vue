<template>
  <view class="item">

    <view class="input_item" v-if="mode == 'input'">
      <view style="display: flex;">{{ itemTitle }}<view style="color: red; margin-left: 15rpx" v-if="required=='true'">*</view></view>
      <view class="input_put">
        <input
          type="text"
          style="width: 100%"
          maxlength="40"
          v-model="itemVal"
          :placeholder="placeholder"
          placeholder-style="#999999"
        />
      </view>
    </view>

    <view class="input_item" v-if="mode == 'picker'">
      <view style="display: flex;">{{ itemTitle }} <view style="color: red; margin-left: 15rpx" v-if="required=='true'">*</view></view>
      <view class="input_put picker_put">
        <uni-datetime-picker
          class="pickerDate"
          :border="false"
          v-model="ddTime"
          :type="dateType"
          :hide-second="true"
         
          @change="change"
        ></uni-datetime-picker>
        <view class="tab_icon">
          <image
            src="../../../static/workOverTime/btn_01.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </view>
    </view>

    <view class="input_item" v-if="mode == 'upload'">
      <view style="display: flex;">{{ itemTitle }}<view style="color: red; margin-left: 15rpx" v-if="required=='true'">*</view></view>
      <view class="input_put picker_put">
        <!-- #ifdef H5 || MP-WEIXIN -->

        <uni-file-picker
          ref="files"
          limit="5"
          file-mediatype="all"
          title="最多选择5个文件"
          v-model="upload"
          @select="select"
          @progress="progress"
          @success="success"
          @fail="fail"
        ></uni-file-picker>

        <!-- #endif -->
          <!-- #ifdef APP -->

        <view class="appfilepocker" @click="appfilepocker()">选择文件</view>

        <!-- #endif -->
      </view>
    </view>

    <view v-if="mode == 'select'">
      <view style="display: flex;">{{ itemTitle }}<view style="color: red; margin-left: 15rpx" v-if="required=='true'">*</view></view>
      <view class="input_put" @tap="showSelect">
        {{ arr[selCur].name }}
        <view style="z-index: 99999">
          <uni-popup ref="selectPopup" type="bottom" :maskClick="false">
            <view class="sel_content">
              <view class="header">
                <view v-if="title" style="font-weight: bold; font-size: 16px">{{
                  title
                }}</view>
                <view v-else style="font-weight: bold; font-size: 16px"
                  >类型</view
                >
                <view style="color: #3b88f5" @tap="selConfirm">确定</view>
              </view>
              <scroll-view style="height: 80%" scroll-y="true">
                <view
                  class="list-cell"
                  v-for="(item, index) in arr"
                  :key="index"
                  @tap="selType(index)"
                >
                  <view class="list_icon" v-if="selCur == index">
                    <image
                      src="../../../static/workOverTime/btn-next@2x.png"
                      style="width: 100%; height: 100%"
                    ></image>
                  </view>
                  <view class="list_icon" v-else>
                    <image
                      src="../../../static/workOverTime/btn-next@2x-1.png"
                      style="width: 100%; height: 100%"
                    ></image>
                  </view>
                  <view style="font-size: 16px"
                    >{{ item.name
                    }}<text class="list_text">{{ item.msg }}</text></view
                  >
                </view>
              </scroll-view>
            </view>
          </uni-popup>
        </view>
        <view class="tab_icon">
          <image
            src="../../../static/workOverTime/btn_01.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </view>
    </view>

    <view v-if="mode == 'textarea'">
      <view style="display: flex;">{{ itemTitle }}<view style="color: red; margin-left: 15rpx" v-if="required=='true'">*</view></view>
      <view class="input_put">
        <textarea
          style="height: 160rpx; width: 100%"
          maxlength="-1"
          v-model="itemVal"
          :placeholder="placeholder"
        />
      </view>
    </view>
    <view v-if="mode == 'selectDet'">
      <view style="display: flex;">{{ itemTitle }}<view style="color: red; margin-left: 15rpx" v-if="required=='true'">*</view></view>
      <view class="input_put" @tap="showTree(modeTpe)">
        <view v-if="parent_name">{{ parent_name }}</view>
        <view v-else>{{ placeholder }}</view>
        <view style="z-index: 99999">
          <tki-tree
            ref="tkitree"
            @watchSearch="watchSearch"
            :range="list"
            :status="treeStatus"
            rangeKey="name"
            confirmColor="#5089f9"
            @confirm="treeConfirm"
            :multiple="true"
          ></tki-tree>
        </view>
        <view class="tab_icon">
          <image
            src="../../../static/workOverTime/btn_01.png"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </view>
    </view>
    <tki-tree
      ref="tkitree"
      @watchSearch="watchSearch"
      :range="list"
      :status="treeStatus"
      rangeKey="name"
      confirmColor="#5089f9"
      @confirm="treeConfirm"
      :multiple="true"
    ></tki-tree>
  </view>
</template>

<script>
import tkiTree from "@/components/tki-tree/tki-tree.vue";
const db = uniCloud.database();
const dbCmd = db.command;
const dbCollectionName = "opendb-department";
const collectionUser = "uni-id-users";
export default {
  data() {
    return {
      upload: [], //文件列表
      file: [], //上传文件
      list: [], //搜索选择器数据
      treeStatus: 1, //树组件加载状态 1，正在加载，2·暂无数据
      selectType: "", //搜索选择器选择的字段
      searchForm: {
        parent_id: "",
      },
      parent_name: "",
      parent_id: "",
      suserList: [],
      itemVal: "",
      dTime: "",
      selectCur: "",
      selCur: 0,
      ddTime: "",
      ceshiData: [],
    };
  },
  components: {},
  watch: {
    itemVal: function (newVal, oldVal) {
      this.$emit("inputVal", this.itemVal);
    },
    dTime: function (newVal, oldVal) {
      this.$emit("ddTime", {
        val: this.dTime,
        type: this.pickerType,
      });
    },
  },
  props: {
    itemTitle: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "",
    },
    modeTpe: {
      type: String,
      default: "",
    },
    pickerType: {
      type: Number,
      default: 0,
    },
    arr: {
      type: Array,
      default: function () {
        return [];
      },
    },
    dateType: {
      type: String,
      default: "date",
    },
    title: {
      type: String,
      default: "",
    },required: {
      type: String,
      default: "false",
    },
  },
  methods: {  
    
    //安卓文件上传
   

    //H5/小程序文件上传
    chooseAndUploadFile(file) {
      uni.showLoading({
        title: "文件上传中...",
      });
      uniCloud
        .chooseAndUploadFile({
          type: "all",
          onChooseFile: (res) => {
            const processAll = [];
            for (let i = 0; i < res.tempFiles.length; i++) {
              processAll.push(this.cropImg(res.tempFiles[i]));
            }
            return Promise.all(processAll).then((fileList) => {
              let result = {
                tempFilePaths: [],
              };
              result.tempFiles = fileList.map((fileItem, index) => {
                result.tempFilePaths.push(fileItem.path);
                return {
                  path: fileItem.path,
                  cloudPath: "" + Date.now() + index + "." + fileItem.ext, 
                  fileType: fileItem.fileType,
                };
              });
              return result;
            });
          },
        })
        .then((res) => {
          this.submitForm(res.tempFiles[0].url);
        })
        .catch((err) => {
        })
        .finally(() => {
          uni.hideLoading();
        });
    },

    // 获取上传状态
    select(e) {
      console.log("选择文件：", e);
    },
    // 获取上传进度
    progress(e) {
      console.log("上传进度：", e);
      uni.showLoading({
        title: "文件上传中...",
      });
    },
    // 上传成功
    success(e) {
           console.log(e);
      uni.hideLoading();
      this.file.push(e.tempFiles[0]);
	uni.setStorageSync('gongwenfiledata',this.file )
    },

    // 上传失败
    fail(e) {
      console.log("上传失败：", e);
    },
    closePop() {
      this.$refs.popup.close();
    },
    showSelect() {
      this.$refs.selectPopup.open();
    },
    selType(index) {
      this.selCur = index;
    },
    selConfirm() {
      this.$refs.selectPopup.close();
      this.$emit("selectVal", this.selCur);
    },
    change(e) {
      this.dTime = e;
    },
    showTree(e) {
      this.list = [];
      if (e === "department") {
        this.selectType = "department";
        this.getDepartment("");
      } else {
        this.selectType = "user";
        this.getUser("");
      }

      this.$refs.tkitree._show();
    },
    // 获取部门
    getDepartment(name) {
      var _this = this;
      _this.treeStatus = 1; //树组件加载状态  {getTree: {}}
      db.collection("opendb-department")
        .where({
          name: new RegExp(name),
        })
        .get()
        .then((res) => {
          let depList = res.result.data;
          let listArr = [];
          depList.forEach((ele) => {
            let obj = {};
            obj._id = ele._id;
            obj.name = ele.pathName;
            listArr.push(obj);
          });
          _this.list = listArr;
        })
        .catch((err) => {
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    }, // 获取人员
    getUser(name) {
      var _this = this;
      _this.treeStatus = 1; //树组件加载状态
      db.collection("uni-id-users")
        .where({
          username: new RegExp(name),
        })
        .field("username,nickname")
        .get()
        .then((res) => {
          if (res.result.data == "") {
            _this.treeStatus = 2;
          }
          let userList = res.result.data;
          let listArr = [];
          userList.forEach((ele) => {
            let obj = {};
            obj._id = ele._id;
            if (ele.nickname != undefined) {
              obj.name = ele.nickname;
            } else {
              obj.name = ele.username;
            }

            listArr.push(obj);
          });
          listArr.forEach((item, index) => {
            this.suserList.forEach((item1) => {
              if (item._id === item1._id) {
                listArr.splice(index, 1);
              }
            });
          });
          _this.list = listArr;
        })
        .catch((err) => {
          uni.showModal({
            content: err.message || "请求服务失败",
            showCancel: false,
          });
        })
        .finally(() => {});
    },
    //选择器搜索框触发事件
    watchSearch(e) {
      const _this = this;
      clearTimeout(_this.searchTimer);
      _this.searchTimer = setTimeout(function () {
        if (_this.selectType === "department") {
          _this.getDepartment(e); //搜索部门
        } else if (_this.selectType === "manager") {
          _this.getUser(e); //搜索人员
        }
      }, 500);
    },
    //选择确定
    treeConfirm(e) {
      const vm = this;
      let pname = "";
      let pid = "";
      for (let i = 0; i < e.length; i++) {
        pname += e[i].name + ",";
        pid += e[i]._id + ",";
      }
      //去掉最后一个逗号(如果不需要去掉，就不用写)
      if (pname.length > 0) {
        pname = pname.substr(0, pname.length - 1);
        pid = pid.substr(0, pid.length - 1);
      }
      vm.parent_id = pid;
      vm.parent_name = pname;
      vm.$emit(vm.modeTpe + "Det", {
        parent_id: pid,
        pname: pname,
      });
    },
  },
};
</script>

<style scoped>
.item {
  padding: 0 14pt;
  background-color: #ffffff;
  padding-bottom: 30rpx;
  /* width: 100%; */
}

.input_put {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #e5e5e5;
  display: flex;
  justify-content: space-between;
}

.pickerDate {
  z-index: 99999;
  color: #999999;
}

.picker_put {
  display: flex;
  justify-content: space-between;
}

.tab_icon {
  width: 36rpx;
  height: 36rpx;
}

.tipBtn {
  color: #007aff;
  width: 100%;
  text-align: right;
  margin-top: 20rpx;
}

.sel_content {
  width: 100%;
  background-color: #ffffff;
  height: 600rpx;
  z-index: 9999;
}

.header {
  padding: 30rpx;
  display: flex;
  align-content: center;
  justify-content: space-between;
  border-bottom: 8px solid #f4f5f7;
}

.list-cell {
  display: flex;
  border-bottom: 1px solid #cccccc;
  padding: 20rpx 0;
  width: 90%;
  margin: 0 auto;
}

.list_icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 30rpx;
}

.list_text {
  font-size: 14px;
  color: #999999;
  margin-left: 20rpx;
}
.appfilepocker{
  line-height: 30rpx;
  height: 30rpx;
  padding: 17rpx 30rpx;
  color: #fff;
  border-radius: 3px;
  background-color: #007aff;
}
</style>
