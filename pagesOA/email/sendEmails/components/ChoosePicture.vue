<template>
  <scroll-view scroll-x="true">
    <view class="bot-bottom">
      <view class="add-box" @click="chooseAndUploadFile"
        ><image
          src="../../../../static/email/ico_data_@3x.png"
          mode="scaleToFill"
          class="add"
      /></view>
      <view class="choose" v-for="(item, index) in imageList" :key="item.url">
        <image
          :src="item.url"
          mode="scaleToFill"
          class="img"
          @click="deleteImg(index)"
        />
        <view class="img-title">
          <view class="title-name">{{ item.name }}</view>
          <view class="title-ext">.{{ item.ext }}</view>
        </view>
        <view class="capacity">{{ item.size }}</view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      imageList: [],
      inviteUrl: "",
    };
  },
  watch: {
    imageList() {
      this.handlePicture();
    },
  },
  methods: {
    handlePicture() {
      this.$emit("picture", this.imageList);
    },
    /* ---------------上传图片--------------- */
    chooseAndUploadFile(file) {
      uniCloud
        .chooseAndUploadFile({
          type: "image",
          onChooseFile: (res) => {
			  if(res.tempFilePaths){
				uni.showLoading({
				  title: "文件上传中...",
				});  
			  }
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
                let reg = new RegExp(`.${fileItem.ext}`);
                let name = fileItem.name.replace(reg, "");
                let size =
                  fileItem.size / 1024 < 1024
                    ? (fileItem.size / 1024).toFixed(1) + "KB"
                    : (fileItem.size / 1024 / 1024).toFixed(1) + "M";

                return {
                  size: size,
                  name: name,
                  ext: fileItem.ext,
                  path: fileItem.path,
                  cloudPath: "" + Date.now() + index + "." + fileItem.ext, // 云端路径，这里随便生成了一个
                  fileType: fileItem.fileType,
                };
              });
              return result;
            });
          },
        })
        .then((res) => {
          const tempFiles = res.tempFiles;
          this.imageList.unshift(tempFiles[0]);
          this.$emit("picture", this.imageList);
        })
        .catch((err) => {
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    cropImg(file) {
      return new Promise((resolve, reject) => {
        let ext;
        let filePathProcessed = file.path; // 处理结果
        // #ifdef H5
        ext = file.name.split(".").pop();
        resolve({
          path: filePathProcessed,
          ext,
          fileType: file.type,
          size: file.size,
          name: file.name,
        });
        // #endif
        // #ifndef H5
        uni.getImageInfo({
          src: file.path,
          success(info) {
            ext = info.type.toLowerCase();
            resolve({
              path: filePathProcessed,
              ext,
              fileType: file.type,
              size: file.size,
              name: file.name,
            });
          },
          fail(err) {
            reject(new Error(err.errMsg || "未能获取图片类型"));
          },
        });
        // #endif
      });
    },

    /* 删除图片 */
    deleteImg(index) {
      var that = this;
      uni.showModal({
        content: "删除这张照片？",
        success(res) {
          if (res.confirm) {
            that.imageList.splice(index, 1);
            that.$emit("picture", that.imageList);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bot-bottom {
  height: 288rpx;
  display: flex;
  margin: 38rpx 0 0 28rpx;

  .add-box {
    width: 144rpx;
    min-width: 144rpx;
    height: 144rpx;
    border-radius: 6rpx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    .add {
      width: 72rpx;
      height: 72rpx;
    }
  }
  .choose {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20rpx;

    .img {
      width: 144rpx;
      height: 144rpx;
    }
    .capacity,
    .img-title {
      color: rgba(0, 0, 0, 0.9);
      font-family: PingFang SC;
      font-weight: medium;
      font-size: 22rpx;
      line-height: normal;
      letter-spacing: 0rpx;
      text-align: center;
    }
    .img-title {
      display: flex;
      .title-name {
        width: 84rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
