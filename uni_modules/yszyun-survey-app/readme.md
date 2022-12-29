# yszyun-survey-app 云端一体调查问卷-用户端
# 产品简介
这是一套基于 uniCloud + uni-app 开发的调查问卷系统，分为用户端和管理后台两个项目，
本插件为用户端项目，管理端目另见[https://ext.dcloud.net.cn/plugin?id=7872](https://ext.dcloud.net.cn/plugin?id=7872)。

注意：本插件的云函数依赖管理后台插件，故需先下载云端一体调查问卷-管理端插件，然后将本项目的服务空间关联到管理后台项目上。

###  1.安装第三方依赖
uni_modules/yszyun-survey-app 目录，鼠标右键选择‘安装插件三方依赖’

##  2.在`pages.json`中添加页面路径
```json
//此结构与uniCloud admin中的pages.json结构一致
"pages": [
			// ……其他页面配置
		{
		    "path": "uni_modules/yszyun-survey-app/pages/survey/edit",
		    "style": {
		        "navigationBarTitleText": "编辑"
		    }
		},
		{
		    "path": "uni_modules/yszyun-survey-app/pages/survey/list",
		    "style": {
		        "navigationBarTitleText": "列表"
		    }
		},
		{
		    "path": "uni_modules/yszyun-survey-app/pages/survey/detail",
		    "style": {
		        "navigationBarTitleText": "详情"
		    }
		}
		,{
		    "path" : "uni_modules/yszyun-survey-app/pages/survey-problem/add",
		    "style" :                                                                                    
		    {
		        "navigationBarTitleText": "",
		        "enablePullDownRefresh": false
		    }
		}
		
]
```


##  3.添加问卷列表
在需要引入的地方，添加入口路径
 `uni_modules/yszyun-survey-app/pages/survey/list`
 

## 4.技术支持
扫码添加技术微信支持，备注说明对应的插件名称

![](https://wiki.yszyun.com/uploads/moa-admin/images/m_a3639d790e5a0b1f9d1a1dd5e695894c_r.png)

详情咨询电话： 400-008-1668
邮箱：marketing@yszyun.com
