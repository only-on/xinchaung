<template>
  <div class="courseHeader">
    <div class="box">
      <breadcrumb />
      <div class="title">玩转组件库搭建流程</div>
      <div class="info flexCenter">
        <div class="user flexCenter">
          <!-- :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`" -->
          <div class="chart"></div>
          <div class="name">
            <div>教师名字</div>
            <div class="Faculty">教师所在院系</div>
          </div>
        </div>
        <div class="details flexCenter">
          <div class="item">
            <span>章节</span>
            <span class="num num2">4</span>
          </div>
          <div class="item">
            <span>实验</span>
            <span class="num num2">22</span>
          </div>
          <div class="item">
            <span>课时</span>
            <span class="num num2">12</span>
          </div>
          <div class="item">
            <span>课程方向</span>
            <span class="num num2">深度学是发是</span>
          </div>
          <div class="item">
            <span>职业方向</span>
            <span class="num">深度学发是发是</span>
          </div>
        </div>
        <div>
          <a-button type="primary" size="">开课</a-button>
        </div>
      </div>
    </div>
  </div>
  <div class="courseContent">
    <div class="leftContent content">
      <h3 class="courseH3">课程简介</h3>
      <div class="introduce">Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。</div>
      <div>
        <h3 class="courseH3">章节目录</h3>
        <div class="chapterList" v-for="(v,k) in chapterList" :key="k">
          <div class="title flexCenter">
            <div class="flexCenter">
              <h3 class="">{{v.title}}</h3>
              <h3 class="">{{v.name}}</h3>
            </div>
            <span @click="v.openItem=!v.openItem">{{v.openItem?'收起':'展开'}}</span>
          </div>
          <div class="order">{{v.explain}}</div>
          <div class="listBox" v-show="v.openItem">
            <div class="list" v-for="a in v.list" :key="a" :class="v.openItem?'listHeight':''">
              <div class="itemTit flexCenter">
                <div class="TitLeft" @click="ExperimentDetail(a)">
                  <span>{{a.order}}</span>
                  <span>{{a.title}}</span>
                </div>
                <div class="TitRight flexCenter">
                  <a-button class="environment flexCenter" :loading="a.startup" @click.stop="prepare(a)" v-if="a.type==='experiment'">{{a.startup?'准备中':'启动环境'}}</a-button>
                  <span @click.stop="a.openGuidance=!a.openGuidance" @click="ViewExperiment">{{`${a.openGuidance?'收起':'查看'}`}}指导</span>
                </div>
              </div>
              <div class="itemContentBox textScrollbar" v-show="a.openGuidance">
                <div class="itemContent" v-for="i in a.content" :key="i" :class="a.openGuidance?'itemContentHeight':''" v-show="a.type==='experiment'">
                  <h4 class="">{{i.title}}</h4>
                  <div class="text">{{i.text}}</div>
                </div>
                <div class="video-box" v-if="a.type==='mp4'">
                  <video :src="env ? '/proxyPrefix' + detailInfoUrl : detailInfoUrl" :controls="true">
                    您的浏览器不支持 video 标签
                  </video>
                </div>
                <div class="pdfBox" v-if="a.type==='pptx'">
                  <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rightContent">
      <h3 class="courseH3">学习进度排行榜</h3>
      <div class="Ranking">
        <div class="gamePlayer flexCenter" v-for="(v,k) in 10" :key="v">
          <div class="user flexCenter">
            <div class="rank" :class="k<3?`rank${k+1}`:''">{{k>2?k+1:''}}</div>
            <!-- :style="`background-image: url(${env? '/proxyPrefix' + systemBaseInfo.login_logo: systemBaseInfo.login_logo});`" -->
            <div class="portrait"></div>
            <div class="name">{{'左卿辞'}}</div>
          </div>
          <div class="progress">学习进度{{'70'}}%</div>
        </div>
      </div>
      <h3 class="courseH3">知识点</h3>
      
      <div class="graphBox">
        <div id="graph"></div>
        <div class="magnifier" @click="viewAtlas()">
          <span class="iconfont icon-sousuo"></span>
        </div>
      </div>
      <h3 class="courseH3">相关实验</h3>
      <div class="relevant">
        <div class="item" v-for="v in 5" :key="v">
          <div class="text">{{'基于入侵检测的告警分析-外网'}}</div>
          <div class="number">{{'127人学过'}}</div>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="Visible" title="知识点" :width="1413" class="modal-post" :destroyOnClose="true">
    <div id="KnowledgePoints">

    </div>
    <template #footer>
      <span></span>
    </template>
  </a-modal>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  toRefs,
  nextTick,
  provide,
  Ref,
  ref,
  watch,
  onBeforeUnmount,
} from "vue";
import storage from "src/utils/extStorage";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import { IBusinessResp} from 'src/typings/fetch.d';
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect";
import PdfVue from "src/components/pdf/pdf.vue"
import { Knowledge,HotWords} from './echartsOption'
interface IState{
  chapterList:any[]
}
export default defineComponent({
  components: {
    PdfVue
  },
  setup() {
    var updata = inject("updataNav") as Function;
    updata({
      tabs: [],
      showContent: false,
      componenttype: undefined,
      showNav: false,
    });
    const route = useRoute();
    const router = useRouter();
    const http=(request as any).teachCourse
    const currentRole: number = storage.lStorage.get("role");
    const currentTab = route.query.currentTab;
    const course_id = route.query.course_id;
    const type = route.query.type;
    const routeQuery = useRoute().query;
    const env = process.env.NODE_ENV == "development" ? true : false;
    const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
    var state:IState=reactive({
      chapterList:[
        {
          title:'第一章',
          name:'课程介绍',
          explain:'本章节主要介绍课程目标，课程大纲，相关知识点及学习建议。',
          openItem:false,
          list:[
            {
              order:'3-1',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              type:'mp4',
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。"\n"按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
            {
              order:'3-2',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              type:'pptx',
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
            {
              order:'3-3',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              type:'experiment',
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
          ]
        },
        {
          title:'第二章',
          name:'课程介绍',
          explain:'本章节主要介绍课程目标，课程大纲，相关知识点及学习建议。',
          openItem:false,
          list:[
            {
              order:'3-1',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
            {
              order:'3-2',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
            {
              order:'3-3',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
          ]
        },
        {
          title:'第三章',
          name:'课程介绍',
          explain:'本章节主要介绍课程目标，课程大纲，相关知识点及学习建议。',
          openItem:false,
          list:[
            {
              order:'3-1',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
            {
              order:'3-2',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
            {
              order:'3-3',
              title:'基于入侵检测的告警分析-外网',
              openGuidance:false,
              startup:false,
              content:[
                {
                  title:'1、按钮的定义',
                  text:'Wiki是一种在网络上开放且可供多人协同创作的超文本系统，由美国人沃德·坎宁安于1995年首先开发，这种超文本系统支持面向社群的协作式写作，同时也包括一组支持这种写作。沃德·坎宁安将wiki定义为“一种允许一群用户用简单的描述来创建和连接一组网页的社会计算系统”。 [1] Wiki站点可以有多人（甚至任何访问者）维护，每个人都可以发表自己的意见。'+"\n"+'按钮几乎是每一个页面不可或缺的元素，对于按钮的认识基本停留在视觉层面，一个圆角矩形搭配一句文案就能拼凑成一个最基础的按钮。视觉是一个观察的切入点，但仅停留在视觉层面还是不够的，比设计表现更重要的往往是背后支持设计的理由。本文中的所有案例均来自线上产品，观点仅是个人粗浅的理解，有疑问的地方欢迎大家讨论指正。'
                },
                {
                  title:'2、命令型按钮与选择型按钮的区别',
                  text:'如果从视觉形式上看，按钮的组成很简单，一个矩形容器加上文字或图标即可组合成一个常见的按钮，但是仅仅从视觉层面定义按钮是不严谨的。按钮是一种重要的控件类型，而控件是图形用户界面（GUI）的主要构成模块。想要深入理解按钮，就必须要求我们首先理解什么是控件以及控件的分类。'
                },
                {
                  title:'3、命令型按钮与选择型按钮的区别',
                  text:'GUI 中“按钮”的概念来源于真实世界中的按钮。真实的按钮具有一个非常显而易见的特点：拥有一个适合点击按压的受力面，这个受力面就是可点击感的来源。试想一下，假设一个按钮只有针尖般大小，且不说你是否能认出这是按钮，即便你知道这是按钮，你会有按下的欲望吗？真实情况下，摆在人们面前的按钮面积越大，想按压的欲望就越强。因此传统按钮的最显著'
                }
              ]
            },
          ]
        },
      ]
    })
    function initData(){
      http.courseDetail().then((res:IBusinessResp)=>{

      })
    }
    function prepare(a:any) {
      a.startup=true
      // return
      let param: any = {
        type: "course",
        opType: "prepare",
        // taskId: experiment_id.value,
        taskId:500152
      };
      let task_type={
        type:4,
        programing_type:0
      }
      if (task_type.type === 4) {
        // webide
        if (task_type.programing_type === 1) {
          router.push({
            path: "/vm/ace",
            query: {
              type: param.type,
              opType: param.opType,
              taskId: param.taskId,
              routerQuery: JSON.stringify(routeQuery),
            },
          });
        } else {
          toVmConnect(router, param, routeQuery);
        }
      } else {
        toVmConnect(router, param, routeQuery);
      }
    }
    function ExperimentDetail(a:any){
      // 去实验详情页面
    }
    var Visible:Ref<boolean>=ref(false)
    function viewAtlas(){
      Visible.value=true
      nextTick(()=>{
        let data={}
        Knowledge(document.getElementById("KnowledgePoints") as HTMLDivElement,data)
      })
    }
    onMounted(() => {
      // initData() HotWords
      nextTick(()=>{
        let data={}
        HotWords(document.getElementById("graph") as HTMLDivElement,data)
      })
    });
    function tabChange(key: string) {}

    return {
      ...toRefs(state),
      Visible,
      viewAtlas,
      ExperimentDetail,
      tabChange,
      prepare,
      env,detailInfoUrl,
    };
  },
});
</script>

<style lang="less" scoped>
  .courseH3{
    margin-bottom: 1rem;
  }
  .courseHeader{
    height: 200px;
    background: url('src/assets/images/teacherCourse/courseHeader.jpg') no-repeat;
    background-size: 100% 100%;
    color: var(--white);
    .box{
      width: var(--center-width);
      margin: 0 auto;
      padding-top: 16px;
    }
    .title{
      font-size: 30px;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: 38px;
      letter-spacing: 2.1px;
      padding-top: 20px;
    }
    .info{
      justify-content: space-between;
      padding-top: 14px;
      .user{
        .chart{
          width: 48px;
          height: 48px;
          border-radius: 24px;
          background-color: #ffffff;
          background-size: 100% 100%;
        }
        .name{
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          .Faculty{
            font-size: var(--font-size-sm);
            opacity: 0.45;
            letter-spacing: 0.84px;
          }
        }
      }
      .details{
        max-width: 80%;
        flex-wrap: wrap;
        .item{
          margin-right: 16px;
          letter-spacing: 0.98px;
          .num{
            padding-left: 10px;
            margin-right: 14px;
            color: var(--white-85);
            opacity: 0.85;
          }
          .num2{
            position: relative;
            &::after{
              position: absolute;
              content: '';
              width: 2px;
              height: 2px;
              background: var(--white);
              border-radius: 50%;
              top: 50%;
              right: -16px;
            }
          }
        }
      }
    }
  }
  .courseContent{
    width: var(--center-width);
    margin: 0 auto;
    display: flex;
    .content{
      padding: 20px;
    }
    .leftContent{
      // width: 70%;
      flex: 1;
      padding-top: 40px;
      .introduce{
        font-weight: 400;
        color: var(--black-65);
        line-height: 24px;
        margin-bottom: 2rem;
      }
      .chapterList{
        padding-bottom: 2rem;
        .title{
          justify-content: space-between;
          span{
            color: var(--primary-color);
            cursor: pointer;
          }
        }
        .order{
          font-size: var(--font-size-sm);
          color: var(--black-25);
          margin-bottom: 2rem;
        }
        .listBox{
          transition: all .3s;
        }
        .list{
          .itemTit{
            justify-content: space-between;
            padding-right: 2rem;
            line-height: 40px;
            .TitRight{
              .environment{
                justify-content: center;
                padding: 0;
                width: 100px;
                height: 24px;
                background-color:var(--brightBtn);
                color: var(--white);
                border-radius: 12px;
                &:hover{
                  background-color:var(--brightBtn);
                  border: 1px solid transparent;
                }
              }
              span{
                color: var(--primary-color);
                margin-left: 24px;
                cursor: pointer;
              }
            }
          }
          .itemContentBox{
            max-height: 500px;
            overflow: auto;
            .itemContent{
              transition: all .5s;
              h4{
                margin-bottom: 1rem;
              }
              .text{
                height: 100%;
                white-space: pre-wrap;
                color: var(--black-65);
                margin-bottom: 1.5rem;
              }
            }
            .video-box{
              height: 500px;
              width: 100%;
              video{
                width:100%;
                height:100%;
                object-fit: cover;
              }
            }
            .pdfBox{
              height: 500px;
              width: 100%;
            }
          }
        }
      }
    }
    .rightContent{
      // width: 30%;
      width: 240px;
      margin-bottom: 2rem;
      margin-left: 50px;
      padding-top: 20px;
      .Ranking{
        margin-bottom: 2rem;
        .gamePlayer{
          justify-content: space-between;
          line-height: 50px;
          .user{
            width: 50%;
            justify-content: space-between;
          }
          .rank{
            width: 24px;
            height: 20px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            line-height: 20px;
            text-align: center;
            font-size: var(--font-size-sm);
            color: var(--black-45);
            &.rank1{
              // background-image: url('src/assets/images/empty/empty.png');
              background-image: url('src/assets/images/teacherCourse/1.png');   
            }
            &.rank2{
              background-image: url('src/assets/images/teacherCourse/2.png');
            }
            &.rank3{
              background-image: url('src/assets/images/teacherCourse/3.png');
            }
          }
          .portrait{
            width: 30px;
            height: 30px;
            background-color: #FF9544;
            border-radius: 15px;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }
          .name{
            color: var(--black-65);
          }
          .progress{
            color: var(--black-45);
          }
        }
      }
      .graphBox{
        width: 100%;
        height: 166px;
        margin-bottom: 2rem;
        position: relative;
        #graph{
          width: 100%;
          height: 100%;
          // border: 1px solid red;
        }
        .magnifier{
          position: absolute;
          right: 0;
          bottom: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.40);
          color: #ffffff;
          cursor: pointer;
        }
      }
      .relevant{
        .item{
          margin-bottom: 1rem;
          .text{
            color: var(--primary-color);
            letter-spacing: 0.34px;
          }
          .number{
            color: var(--black-45);
          }
        }
      }
    }
  }
  .modal-post{
    #KnowledgePoints{
      height: 600px;
      width: 100%;
      padding: 40px;
    }
  }
</style>
