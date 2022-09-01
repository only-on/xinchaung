## 对接系统的登录用户信息存储:

1. 信息存储在localStorage

2. 字段名：role（登录用户的角色： 教师— 3、学生— 4）、username（登录用户的账号）

## 用户对接：

##### 使用postMessage进行通信：

1. 监听oj模块发送的信息。

    当监听到发送的数据（event.data）是以下情况时：

    1、 `event.data === 'openDialog'` 时，打开学生选择弹框 【**两种对接模式下都需要**】

    2、 `event.data.type === 'getStudent'` 时，发送的数据（event.data.data）是已选择的学生id数组，是获取学生列表接口的参数之一（用来过滤已选择的学生）【**两种对接模式下都需要**】

    3、 `event.data.type === 'height'`时，发送的数据（event.data.data）可以用来设置iframe的高度，避免iframe出现滚动条。 【**仅在iframe模式下需要**】

    4、 `event.data.type === 'fullScreen'`时, 页面设置为全屏，隐藏菜单栏及设置页面间距保证页面是全屏【**两种对接模式下都需要**】

    5、`event.data.setTop === true` 时，给oj模块发送消息，设置底部透明条的top值。此操作是为刚进入页面时设置top值，而不是滚动页面时才设置

iframe模式下，在对接系统放置iframe的页面进行监听；

组件模式下，在对接系统的路由出口文件页面监听；例如：

```
<div class="views-main-content">
    <router-view></router-view>
    // 学生选择弹框
    <testDialog :dialogVisible="dialogVisible"/>
 </div>
export default {
  components: {
    testDialog
  },
  data () {
    return {
      dialogVisible: false，
      selectStudentIds: []
    }
  },
  watch: {
    // 监听路由，离开oj模块的提交答案页，菜单栏显示
    $route (to, from) {
      if (from.name === 'submitAnswer') {
        $('header').show()
      }
    }
  },
  mounted () {
    window.addEventListener('message', event => {
      if (event.data == 'openDialog') {
        // 打开学生弹框
        this.dialogVisible = true
      }
      if (event.data.type == 'fullScreen') {
        // 全屏处理
        $('header').hide()
      } 
       if (event.data.type == 'getStudent') {
        // 已选择的学生id数组， 用来请求学生列表过滤已选择的学生
        this.selectStudentIds = event.data.data
      }
    })
  }
};
```


2. 当在弹框中选择好学生，点击添加按钮之后，给oj模块发送信息。信息格式如下:

    ```
    { 
      type: 'student',
      data: 已选择的学生信息数组 
    }
    ```
    其中学生信息所必须包含的字段：

    ```
    {
      uid: '', // 学生id
      stu_no: '', // 学生学号
      username: '', // 姓名
      classname: '' // 班级
    }
    ```
#### oj模块页面底部固定定位top值设置，所需的操作：
监听页面滚动事件，给oj模块发送信息。信息格式如下：
```
{
    type: 'top',
    data：$(window).height() + $(window).scrollTop() - $('#iframe').offset().top
}
```
### 系统对接模式：
#### 1、组件模式
使用方法：

私服地址：`http://192.168.101.176:4873`， npm包： `@xianfe/oj`

1、安装组件

```
npm install @xianfe/oj
```

2、全局引入组件， 注册组件

```
import Oj, { setToken } from '@xianfe/oj'

setToken(token值) // 给oj模块提供系统的token值

Vue.component('Oj', Oj)
```
3、页面内使用
 
**page**：questionBank：题库页面；homeWork: 作业页面; 必传

**apiUrl**：学生列表接口url；该参数可选。 不传的话，使用对接系统内部的学生选择页面；传了则使用oj内部提供的学生选择页面

**model**：模式类型。 默认值为`component`。可选

**themeColor**：主题颜色。可选

```
<Oj page="questionBank" model="component"/>
```
- oj模块提供了路由数组，对接系统的路由**必须**要加入oj模块提供的路由数据；数据地址：`安装的npm包名/src/router/routes`

例如：
`
import ojRoute from '@xianfe/oj/src/router/routes'
`
- oj模块使用了vuex,提供了store里面state,mutations数据，对接系统的store**必须**加入oj模块所提供的

引入方法：
`
import {ojState,ojMutations} from '@xianfe/oj/src/store/index'
`

- 必须在对接系统中引入oj模块颜色变量及全局样式文件。在`vue.config.js`文件中配置。注意文件引入顺序

```
css: {
      loaderOptions: {
        // 定义全局scss无需引入即可使用
        // 由于sass-loader版本的不同，loaderOptions的data键名也不同
        // data V8-
        // prependData V8+
        // additionalData V10+
        sass: {
          data: `
          @import "node_modules/@xianfe/oj/src/assets/scss/variable.scss"; // oj模块颜色变量文件
          @import "./src/assets/scss/variable.scss"; // 对接系统的颜色变量文件
          @import "node_modules/@xianfe/oj/src/assets/scss/common.scss";` // oj模块全局样式
        }
      }
    },
```

#### 2、 iframe模式

##### 使用方法：
```
题库页面iframe的src: /oj#/questionBank?isTeacher=true&isEmbed=true&themeColor=#8955B5

作业页面iframe的src: /oj#/homeWork?isTeacher=true&isEmbed=true&studentApi=学生列表接口url&themeColor=#8955B5

```
说明：oj模块需要的信息通过iframe的src来传递

`isTeacher`：登录用户是否是教师，是---值为true,否----值为false。默认为false

`isEmbed`: 表示iframe模式，值仅为true。必传

`studentApi`: 添加作业时所选学生列表接口url。可选。使用oj模块提供的选择学生界面时传该值，不传的话则默认使用对接系统的选择学生界面

`themeColor`: 主题色。可选

`token`: 接口有token验证时，传递对接系统的token值给oj系统。oj系统接收到之后会存储在sessionStorage里面。发送请求时会携带

### 使用oj内部的学生选择界面，对接系统提供请求接口的url

要求提供的接口的格式如下：

##### 请求方式

`get请求`

##### 请求参数：
```
{
  username: '', // 姓名
  stu_no: '', // 学号
  page: 1, // 当前第几页
  limit: 10, // 一页条数
  ids: 1,2,3 // 已选择的学生id字符串
}
```
##### 返回格式：

```
{
  data: {
    list: [
        {
          uid: 104, // 学生id
          stu_no: 'hmm', // 学号
          username: 'stu1', // 姓名
          gender: '男', // 性别
          classname: '', //班级
        }
      ],
     page: {
       currentPage: 1,
       totalCount: 1
    }
  }
}
```
颜色变量见 [配色方案变色文档](http://192.168.50.14:8081/MiddlePlatform/oj-frontend/-/wikis/%E9%85%8D%E8%89%B2%E6%96%B9%E6%A1%88%E5%8F%98%E6%9B%B4%E6%96%87%E6%A1%A3)



 
    
