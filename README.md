<h1> 企业移动办公系统 </h1>

# 产品简介
这是一套基于 uniCloud + uni-app 开发的移动办公系统，分为用户端和管理后台两个项目，本插件为用户端项目，管理后台项目另见[https://ext.dcloud.net.cn/plugin?id=5036](https://ext.dcloud.net.cn/plugin?id=5036)。

注意：本插件的云函数依赖管理后台插件，故需先下载[移动办公-管理后台](https://ext.dcloud.net.cn/plugin?id=5036)插件，然后将本项目的服务空间关联到管理后台项目上。


# 应用场景
1.领导长期外出，可通过移动办公随时了解企业的运营情况，能够对一些重大事项，做出及时的决策；

2.企业重要通知可通过移动办公软件及时传达给每个员工，同时能够清楚各个员工是否已经阅读该重要通知；

3.下属员工提交的紧急重要公文，在领导外出时，可提醒领导使用移动办公随时随地的进行审批；大大缩短流程审批时间，提高企业效率；

4.遇有突出事情需要紧急请假的员工，可通过移动办公，在手机上进行请假，而不用回公司进行申请，节省了回来跑的时间。

# 产品优势
产品后台采用uniCloud admin 框架，是基于 uni-app 和 uniCloud 的应用后台管理的开源框架。开发一云多端的整套业务。并充分利用schema2code自动生成代码优势，节省降低开发成本，可以无缝支持其他的admin插件。

产品前端采用uni-App开发，实现App（iOS，Android）、H5、微信小程序多平台部署运营。

# 项目构成
前端基于uni-app开发，后端基于[uniCloud](https://uniapp.dcloud.net.cn/uniCloud/README)开发

整个移动办公系统，有2个项目，复用同一个uniCloud空间。一个项目是用户端，另一个项目是管理端。

本插件即为App端，面向手机用户使用，功能包括：
OA审批、通知公告、考勤打卡、日报、通讯录和我的帐号管理共六大模块。

管理端,面向单位的IT管理人员使用，设置组织架构，考勤管理配置，流程配置等。

管理端是另外插件，另见： [https://ext.dcloud.net.cn/plugin?id=5036](https://ext.dcloud.net.cn/plugin?id=5036)



# 整体功能列表
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_898f6c720d8a5cd6ea357f8a6453f3ab_r.jpg)

# 用户端效果图
#### 首页
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_f09fc2d26d4bdfcb79ea5e27f8fd56d3_r.jpg)

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_679421fe5989711ecf16f5ac3ed205a0_r.jpg)

### 公文管理
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_30e2b6c4412d0aff122fa092f22ba539_r.jpg)

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_bf1f6fff6355002970221d4873101cb4_r.jpg)

#### 加班申请
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_778770ebb5a6e06973b4b12bb9775bc9_r.jpg)

#### 考勤打卡
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_25398624af26d648f3a97ff82303b63b_r.jpg)

#### 打卡记录
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_9c268a5d28edf12ddd3283ddd215e709_r.jpg)

#### 日志刷选
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_48d008e4b031187bc54ff6489fccb449_r.jpg)

#### 日志统计
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_8ac46525f8adddbace3a1a94c6048416_r.jpg)


#### 通讯录
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_e7d206fe67cc7a26b54ce5bd98e218ee_r.jpg)

#### 我的
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_e1d6b94bdce262c179f67f75b7a22a3d_r.jpg)


# 产品演示

用户端H5版本 [https://moa.yszyun.com/#/pages/login/login](https://moa.yszyun.com/#/pages/login/login)
账号：tianlin
密码：123456

用户端小程序版本

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_36bd7bf15092660dc61413ae5052b432_r.jpg)


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
├── pagesOA                     # 考勤类页面
├── pagesContacts               # 通讯录页面
├── static
├── App.vue
├── main.js
├── mainfest.json
├── pages.json
└── uni.scss
```


* 配置appid 与管理后台的一致，将本项目的服务空间关联到管理后台项目上。
* 右键上传cloudfunctions-aliyun文件夹下所有云函数(云函数上传完后请进云开发控制台将函数执行内存改至最大)
* 选择/cloudfunctions-aliyun/db_init.json右键初始化云数据库
![](https://wiki.yszyun.com/uploads/moa-admin/images/m_895636936e563a949911d1e2d2121531_r.jpg)
* 使用HBuilderx运行到浏览器

###### 移动办公操作手册
[https://wiki.yszyun.com/docs/moa-unicloud/moa-unicloud-1ctudvht2ovdi](https://wiki.yszyun.com/docs/moa-unicloud/moa-unicloud-1ctudvht2ovdi)


扫码添加技术微信支持，备注说明对应的插件名称

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_a3639d790e5a0b1f9d1a1dd5e695894c_r.png)

详情咨询电话： 400-008-1668
邮箱：marketing@yszyun.com
