<template>
  <view class="bg">
    <view class="conte">
      <from-item
        ref="gwtitle"
        mode="input"
        itemTitle="标题"
        placeholder="请输入"
        required="true"
        @inputVal="in_gwtitle"
      />
      <from-item
        ref="date_time"
        mode="picker"
        :itemTitle="dTitle"
        @ddTime="dTime"
        dateType="date"
        required="true"
        :pickerType="0"
      />
      <from-item
        ref="fileno"
        mode="input"
        itemTitle="文件字号"
        placeholder="请输入"
        required="true"
        @inputVal="in_fileno"
      />
      <from-item
        ref="originatordeptid"
        mode="selectDet"
        modeTpe="department"
        @departmentDet="departmentDet"
        :itemTitle="fwdw"
        placeholder="请选择"
      />
      <from-item
        ref="urgency"
        mode="select"
        :arr="urgencyArr"
        title="请选择"
        itemTitle="紧急程度"
        placeholder="请选择"
        @inputVal="endCityVal"
      />
      <from-item
        ref="content"
        mode="textarea"
        itemTitle="内容"
        placeholder="请输入"
        required="true"
        @inputVal="in_content"
      />
      <from-item
        ref="attachments"
        mode="upload"
        itemTitle="上传附件"
        placeholder="请输入"
        @inputVal="in_attachments"
      />
      <from-item
        ref="optid"
        mode="selectDet"
        modeTpe="user"
        @userDet="userDet"
        itemTitle="处理人"
        placeholder="请选择"
        @inputVal="in_optid"
      />
      <view class="steps">
        <label class="steps-title">流程</label>
        <steps
          color="#fff"
          backgroundColor="#d6d6d6"
          :infoList="stepsOption"
          @del="del"
          @showTree="showTree"
        ></steps>
      </view>
    </view>
    <tki-tree
      ref="tkitree"
      @watchSearch="watchSearch"
      :range="list"
      :multiple="multiple"
      :treeStatus="treeStatus"
      rangeKey="name"
      confirmColor="#5089f9"
      @confirm="treeConfirm"
    ></tki-tree>

    <view class="status_bar">
      <button class="btn1" @click="reback">取消</button>
      <button class="btn2" @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
import tkiTree from "@/components/tki-tree/tki-tree.vue";
const db = uniCloud.database();
const dbCmd = db.command;
const dbCollectionName = "opendb-department";
const collectionUser = "uni-id-users";
import { timeFormat } from "@/utils/dateUtils.js";
import fromItem from "./formItem.vue";

import steps from "./steps.vue";

export default {
  components: {
    fromItem,
    steps,
    tkiTree,
  },
  data() {
    return {
      multiple: false, //单多选
      list: [], //搜索选择器数据
      treeStatus: 1, //树组件加载状态 1，正在加载，2·暂无数据
      selectType: "", //搜索选择器选择的字段
      showindex: "",
      searchForm: {
        parent_id: "",
      },

      dTitle: "拟文日期",
      fwdw: "发文单位",
      urgencyArr: [
        {
          name: "平件",
          value: 1,
          type: 0,
        },
        {
          name: "急",
          value: 2,
          type: 0,
        },
        {
          name: "特急",
          value: 3,
          type: 0,
        },
      ],
      info: {},
      id: "",
      uid: "",
      isEdit: false,
      showbtn: false,
      flowcontent: [],
      stepsOption: [],

      formData: {
        flowid: "",
        sericnum: "",
        gwtitle: "",
        modeid: this.startInfo.modeid,
        fileno: "",
        file: [],
        result: "",
        checksm: "",
        originatordeptid: "",
        originatordname: "",
        urgency: 1,
        content: "",
        attachments: "",
        optid: "",
        optname: "",
        date_time: "",
        user_id: uni.getStorageSync("username"),
        username: uni.getStorageSync("userInfo").nickname,
        department_id: "",
        title: "",
      },
    };
  },
  props: {
    startInfo: {
      type: Object,
      default() {
        return "";
      },
    },
  },

  mounted() {
    if (this.startInfo.modeid == 1) {
      this.dTitle = "拟文日期";
      this.fwdw = "发文单位";
      this.formData.title =
        uni.getStorageSync("userInfo").nickname + "提交的发文拟稿";
    } else if (this.startInfo.modeid == 2) {
      this.dTitle = "收文日期";
      this.fwdw = "收文单位";
      this.formData.title =
        uni.getStorageSync("userInfo").nickname + "提交的收文登记";
    }
    if (this.startInfo.flowid) {
      this.formData.flowid = this.startInfo.flowid;
    }
    this.checkNickname((res) => {
      //判断昵称是否存在
      if (res == true) {
        if (
          uni.getStorageSync("userInfo").length != 0 &&
          uni.getStorageSync("userInfo").department_id
        ) {
          this.formData.department_id =
            uni.getStorageSync("userInfo").department_id[0];
        }
      } else {
      }
    });
    this.getSN();
  },
  methods: {
    reback(){
      uni.navigateBack({
         delta: 1
      });
    },
    // 获取人员
    getManager(name) {
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
            obj.username = ele.username;
            if (ele.nickname != undefined) {
              obj.name = ele.nickname;
            } else {
              obj.name = ele.username;
            }

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
    },
    //选择器搜索框触发事件
    watchSearch(e) {
      const _this = this;
      clearTimeout(_this.searchTimer);
      _this.searchTimer = setTimeout(function () {
        if (_this.selectType === "department") {
          _this.getDepartment(e); //搜索部门
        } else if (_this.selectType === "manager") {
          _this.getManager(e); //搜索人员
        }
      }, 500);
    },
    //选择确定
    treeConfirm(e) {
      e.forEach((item, index) => {
        e[index].name = item.name.split("(")[0];
      });
      e.forEach((item, index) => {
        this.stepsOption[
          this.showindex
        ].setInfo.actionerRules[0].approvals.push(item);
      });

      var arr =
        this.stepsOption[this.showindex].setInfo.actionerRules[0].approvals;
      let deWeightThree = () => {
        let map = new Map();
        for (let item of arr) {
          if (!map.has(item._id)) {
            map.set(item._id, item);
          }
        }
        return [...map.values()];
      };

      this.stepsOption[this.showindex].setInfo.actionerRules[0].approvals =
        deWeightThree();

      const vm = this;
      if (this.selectType === "department") {
        vm.formData.parent_id = e[0]._id;
        vm.formData.parent_name = e[0].name;
      } else {
        vm.formData.manager_uid = e[0]._id;
        vm.formData.manager_name = e[0].name;
      }
    },
    del(index, index1) {
      this.showindex = index;
      this.stepsOption[
        this.showindex
      ].setInfo.actionerRules[0].approvals.splice(index1, 1);
    },
    showTree(e, index) {
      this.showindex = index;
      if (e == "ALL") {
        this.multiple = true;
      } else {
      }
      this.list = [];
      if (e === "department") {
        this.selectType = "department";
        this.getDepartment("");
      } else {
        this.selectType = "manager";
        this.getManager("");
      }
      this.$refs.tkitree._show();
    },
    getSN() {
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "getSN",
            data: {
              flowid: this.formData.flowid,
              department_id: uni.getStorageSync("userInfo").department_id[0],
            },
          },
        })
        .then((res) => {
          this.formData.sericnum =
            timeFormat(res.result.getSN, "yyyyMMdd") + res.result.getSN;
          this.formData.flowcontent = res.result.flowcontent;
          let flowList = this.formData.flowcontent;

          flowList.forEach((item, index) => {
            // let obj = {};
            if (index > 0) {
              this.stepsOption.push(item);
            }
          });
        });
    },
    in_gwtitle(e) {
      this.formData.gwtitle = e;
    },
    in_fileno(e) {
      this.formData.fileno = e;
    },
    in_content(e) {
      this.formData.content = e;
    },
    in_attachments(e) {
      this.formData.attachments = e;
    },

    in_optid(e) {
      this.formData.optid = e;
    },
    dTime(e) {
      this.formData.date_time = e.val;
    },
    departmentDet(e) {
      this.formData.originatordeptid = [e.parent_id];
      this.formData.originatordname = e.pname;
    },
    userDet(e) {
      this.formData.optid = e.parent_id;
      this.formData.optname = e.pname;
    },
    submit() {
      if (this.formData.gwtitle == "") {
        uni.showToast({
          icon: "none",
          title: "请输入标题",
        });
        return;
      }
      if (this.formData.date_time == "") {
        uni.showToast({
          icon: "none",
          title: "请选择日期",
        });
        return;
      }
      if (this.formData.fileno == "") {
        uni.showToast({
          icon: "none",
          title: "请输入文件字号",
        });
        return;
      }
      if (this.formData.content == "") {
        uni.showToast({
          icon: "none",
          title: "请输入内容",
        });
        return;
      }
      this.formData.file = uni.getStorageSync("gongwenfiledata");
      uni.showLoading({
        title: "请稍等...",
      });
      this.submitData(this.formData);
    },
    submitData(formData) {
      if (formData.modeid == undefined) {
        formData["modeid"] = this.startInfo.modeid;
      }
      let that = this;
      that.loading = true;
      uniCloud
        .callFunction({
          name: "gongwen",
          data: {
            name: "gwAdd",
            data: formData,
          },
        })
        .then((res) => {
          uni.setStorageSync("gongwenfiledata", "");
          that.loading = false;
          uni.hideLoading();
          that.showModal = false;
          if (res.result.id) {
            uni.showToast({
              title: "提交成功！",
            });
            that.$emit("change", 1);
          }
        });
    },
  },
};
</script>

<style>
.bg {
  padding-bottom: 30px;
}
.conte {
  padding-bottom: 160rpx;
}
.tb_item {
  padding: 14px;
  background-color: #fff;
}

.tb_item_title {
  color: #333;
  font-size: 13px;
}

.tb_item_input {
  display: flex;
  padding: 9px 0 12px;
  border-bottom: 1px solid #ccc;
}

.tb_item_input textarea {
  flex: 1;
}

.placeholder_style {
  color: #007aff;
}

.tb_icon {
  width: 18px;
  height: 18px;
}

.status_bar {
  border-top: 1px solid #ccc;
  position: fixed;
  height: 140rpx;
  z-index: 1400;
  bottom: 0;
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
 .btns {
  display: flex;
  justify-content: center;
  color: #ffffff;
  width: 100%;
}

.btn1,
.btn2 {
  width: 300rpx;
  height: 100rpx;
  font-size: 30rpx;
  line-height: 100rpx;
}

.btn1 {
  color: #666;
  background-color: #fff;
  border: 1px solid #e3e4e5;
}

.btn2 {
  color: #fff;
  background-color: #3b89f5;
  margin-left: 13px;
}

.input_put {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #e5e5e5;
  display: flex;
  justify-content: space-between;
}

.tab_icon {
  width: 36rpx;
  height: 36rpx;
}

.item {
  padding: 0 14pt;
  background-color: #ffffff;
  padding-bottom: 30rpx;
  /* width: 100%; */
}

.steps {
  padding: 0 14pt;
  background-color: #ffffff;
  padding-bottom: 30px;
  padding-top: 20px;
}

.steps-title {
  margin-top: 50px;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 600;
}
</style>
