<h1> 企业移动办公系统 </h1>

# 产品简介
企业移动办公系统，是基于 uniCloud + uni-app 开发的办公系统。

# 应用场景
1.领导长期外出，可通过移动办公随时了解企业的运营情况，能够对一些重大事项，做出及时的决策；

2.企业重要通知可通过移动办公软件及时传达给每个员工，同时能够清楚各个员工是否已经阅读该重要通知；

3.下属员工提交的紧急重要公文，在领导外出时，可提醒领导使用移动办公随时随地的进行审批；大大缩短流程审批时间，提高企业效率；

4.遇有突出事情需要紧急请假的员工，可通过移动办公，在手机上进行请假，而不用回公司进行申请，节省了回来跑的时间。

# 产品优势
产品后台采用uniCloud admin 框架，是基于 uni-app 和 uniCloud 的应用后台管理的开源框架。开发一云多端的整套业务。并充分利用schema2code自动生成代码优势，节省降低开发成本，可以无缝支持其他的admin插件。

产品前端采用uni-App开发，实现App（iOS，Android）、H5、微信小程序多平台部署运营。


# 功能列表
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_55ad7d536139643da6600b90438b83cc_r.jpg)

# 管理后台效果图
#### 首页
![首页](https://wiki.yszyun.com/uploads/moa-admin/images/m_c44e72916ee2e9528a4561a13814acd8_r.png "首页")

#### 流程列表
![流程列表](https://wiki.yszyun.com/uploads/moa-admin/images/m_cd010ed8bacf67ff795e945211358dc4_r.png "流程列表")

#### 基础管理-组织架构
![基础管理-组织架构](https://wiki.yszyun.com/uploads/moa-admin/images/m_aa5434467e17329df72d68649a540cc4_r.png "基础管理-组织架构")
#### 基础管理-组织架构-选择部门
![基础管理-组织架构-选择部门](https://wiki.yszyun.com/uploads/moa-admin/images/m_01030db4734d4226b20c4b389c1bb1df_r.png "基础管理-组织架构-选择部门")

#### 考勤管理-签到方案考勤管理-签到方案
![考勤管理-签到方案](https://wiki.yszyun.com/uploads/moa-admin/images/m_59a9bca0958dbdbdfbb6272f233c39c2_r.png "考勤管理-签到方案")
#### 考勤管理-考勤周期
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_64775a8ab1c7f61f6122cab6ac79ceb4_r.png)
#### 通知管理-通知列表
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_db0dd70b595713dba46ca70552f9430a_r.png)


前端APP效果图
#### 首页
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_a459f4e267d8018c39280174960e56a3_r.png)

#### 加班申请
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_01b07ce8af9ab6bdb22eeea7c27565eb_r.png)
#### 考勤打卡
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_4a5a0121001029caeae039b04e3739f9_r.png)
#### 打卡记录
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_642372f44f5b643eaee98b450084d6e2_r.png)

#### 日志刷选
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_8f23d705107916806929f1a0b4dd5bdc_r.png)

#### 日志统计
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_3ab790ae228fdc5a7f4b494748a4cfa0_r.png)

#### 通讯录
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_9e59f15ff3137b9d2e8046428c878e2c_r.png)

#### 我的
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_8c38464bfccbed393f610b95441f037f_r.png)


# 产品演示

管理后台 [https://moa.yszyun.com/admin/#/pages/login/login](https://moa.yszyun.com/admin/#/pages/login/login)

账号：admin1
密码：123456

前端 [https://moa.yszyun.com/#/pages/login/login](https://moa.yszyun.com/#/pages/login/login)
账号：tianlin
密码：123456


# 目录结构
```
├── cloudfunctions              # 云函数
├── common
│   │── uni.css                 # 公共样式
│   └── uni-icons.css           # icon样式
├── components                  # 自定义组件
├── js_sdk                      # js sdk
├── pages                       # 页面
│   │── index                   # 首页
│   └── login                   # 登录页
├── static
├── store                       # vuex
├── windows
│   │── component               # 项目中使用的组件
│   │── leftWindow.vue          # 左侧窗口（菜单栏）
│   └── topWindow.vue           # 顶部窗口（导航栏）
├── admin.config.js             # 系统配置（配置导航，菜单等）
├── App.vue
├── main.js
├── mainfest.json
├── pages.json
├── postcss.config.js           # postcss 配置（浏览器兼容性）
└── uni.scss
```
> 基于 uni-app，uniCloud 的 admin 管理项目模板。[文档](https://uniapp.dcloud.io/uniCloud/admin)

## 需要导入 管理后台插件，并初始化云函数，初始化云数据库。
插件地址 [企业移动办公[后台管理系统]](https://ext.dcloud.net.cn/plugin?id=5036)

* 创建或选择云服务空间,进入manifest.json可视化重新获取appid
* 右键上传cloudfunctions-aliyun文件夹下所有云函数(云函数上传完后请进云开发控制台将函数执行内存改至最大)
* 选择/cloudfunctions-aliyun/db_init.json右键初始化云数据库，再执行右键初始化云数据库 uni-upgrade-center:uni-module
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_895636936e563a949911d1e2d2121531_r.jpg)
* 使用HBuilderx运行到浏览器
* 访问管理后台，如无管理员账号，请先创建管理员
* uni-upgrade-center - Admin 使用说明参考 /uni_modules/uni-upgrade-center/readme.md

###### 移动办公操作手册
[https://wiki.yszyun.com/docs/moa-unicloud/moa-unicloud-1ctudvht2ovdi](https://wiki.yszyun.com/docs/moa-unicloud/moa-unicloud-1ctudvht2ovdi)


扫码添加技术微信支持，备注说明对应的插件名称

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_a3639d790e5a0b1f9d1a1dd5e695894c_r.png)

详情咨询电话： 400-008-1668
邮箱：marketing@yszyun.com
