<template>
  <div class="chapterList" v-for="(v,k) in state.chapterList" :key="k">
    <div class="title flexCenter" @click.stop="v.openItem=!v.openItem">
      <div class="flexCenter titleBox" :class="props.Editable === 'readOnly'?'noEdit':''">
        <div class="titleItem titleItem1">{{v.title}}</div>
        <div class="titleItem titleItem2 single_ellipsis">{{v.name}}</div>
      </div>
      <div class="titleBoxRight flexCenter">
        <div class="operation flexCenter" v-if="props.Editable === 'canEdit'">
          <span  class="iconfont icon-chuangjian" @click.stop="establishChapter(v)"></span>
          <span class="iconfont icon-bianji1"  @click.stop="editChapter(v)"></span>
          <span class="iconfont icon-shanchu"  @click.stop="deleteChapter(v)"></span>
        </div>
        <span class="collect">{{v.openItem?'收起':'展开'}}</span>
      </div>
    </div>
    <div class="listBox" v-show="v.openItem">
      <div class="list" v-for="(a,i) in v.list" :key="a">
        <div class="itemTit flexCenter" @click.stop="selectExperiment(a)" :class="state.activeTab.title === a.title?'ActiveItem':''">
          <div class="TitLeft flexCenter" :class="getTitLeftClass()">
            <div class="experimentType">
              <span v-if="!a.TeachingAids" :style="{ color: a.type_obj.color, background: a.type_obj.backgroundColor,}">{{a.type_obj.name}}</span>
              <span v-if="a.TeachingAids">教辅</span>
            </div>
            <div class="experimentTitle single_ellipsis">
              <span v-if="a.TeachingAids">{{`【${a.TeachingAidsName}】`}}&nbsp;</span>
              <span v-if="!a.TeachingAids">{{`${k+1}-${i+1}`}}&nbsp;&nbsp;</span>
              <span class="ItemExperimentTitle">{{a.title}}</span>
            </div>
          </div>
          <div class="TitRight">
            <div v-if="props.Editable === 'canStudy'">
              <!-- 准备完成变为 开始  按钮 -->
              <a-button v-if="a.type==='experiment'" type="primary" class="brightBtn" size="small" :loading="a.startup" @click.stop="prepare(a)">{{a.startup?'准备中':'开始学习'}}</a-button>
              <!-- 不以学生端还是教师端区分      “查看指导”用在实验上  “查看文档”用在教辅上 -->
              <span class="view" @click.stop="ViewExperiment(a)">{{`${a.openGuidance?'收起':'查看'}`}}指导</span>
            </div>
            <!-- <div v-if="props.Editable === 'canEdit'">
              
            </div> -->
            <div class="operation flexCenter" v-if="props.Editable === 'canEdit'">
              <span class="iconfont icon-bianji1" @click.stop="editExperiment(a)"></span>
              <span class="iconfont icon-shanchu" @click.stop="deleteExperiment(a)"></span>
            </div>
          </div>
        </div>
        <div class="experimentGuide" v-if="a.openGuidance">
          <div v-if="a.type==='experiment'" class="experiment">
            <div class="itemContentBox textScrollbar">
              <div class="itemContent" v-for="i in a.content" :key="i" :class="a.openGuidance?'itemContentHeight':''">
                <h4 class="">{{i.title}}</h4>
                <div class="text">{{i.text}}</div>
              </div>
            </div>
          </div>
          <div class="video-box" v-if="a.type==='mp4'">
            <video :src="env ? '/proxyPrefix' + detailInfoUrl : detailInfoUrl" :controls="true">
              您的浏览器不支持 video 标签
            </video>
          </div>
          <div class="pdfBox" v-if="a.type==='pptx'">
            <!-- <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive} from "vue";
import { toVmConnect, IEnvirmentsParam } from "src/utils/vncInspect";
import { useRoute ,useRouter} from "vue-router";
import { getTypeList } from 'src/views/teacherModule/teacherExperimentResourcePool/config'
const route = useRoute();
const router = useRouter();
const routeQuery = useRoute().query;
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
interface Props {
  Editable:string
  // knowledge: any;
  // words:any
}
const props = withDefaults(defineProps<Props>(), {
  // knowledge: ()=> [],  //  
  // words: ()=> [],      // 
  Editable:'readOnly'          //readOnly canStudy canEdit 是否可编辑
});
const ExperimentTypeList=['desktop','Jupyter','task','text','video','command','IDE']

var state:any=reactive({
  chapterList:[
    {
      title:'第一章',
      name:'课程介绍本章节主要介绍课程目标，课程大纲，相关知识点及学习建议。',
      // explain:'本章节主要介绍课程目标，课程大纲，相关知识点及学习建议。',
      openItem:false,
      list:[
        {
          TeachingAids:true,
          TeachingAidsName:'教学指导',
          title:'基于入侵检测的告警分析-外网1基于入侵检测的告警分析-外网1基于入侵检测的告警分析-外网1基于入侵检测的告警分析-外网1入侵检测的告警分析-外网1基于入侵检测的告警分析-外网1',
          openGuidance:false,
          startup:false,
          type:'mp4',
          task_type:1,
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
          TeachingAids:true,
          TeachingAidsName:'备课资料',
          title:'基于入侵检测的告警分析-外网2',
          openGuidance:false,
          startup:false,
          type:'pptx',
          task_type:2,
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
          TeachingAids:true,
          TeachingAidsName:'课件',
          title:'基于入侵检测的告警分析-外网3',
          openGuidance:false,
          startup:false,
          type:'experiment',
          task_type:3,
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
          TeachingAids:false,
          TeachingAidsName:'课件',
          title:'基于入侵检测的告警分析-外网3',
          openGuidance:false,
          startup:false,
          type:'experiment',
          task_type:3,
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
          TeachingAids:false,
          TeachingAidsName:'课件',
          title:'基于入侵检测的告警分析-外网3',
          openGuidance:false,
          startup:false,
          type:'experiment',
          task_type:3,
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
          TeachingAids:false,
          TeachingAidsName:'课件',
          title:'基于入侵检测的告警分析-外网3',
          openGuidance:false,
          startup:false,
          type:'experiment',
          task_type:3,
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
          task_type:4,
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
          task_type:5,
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
          task_type:6,
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
          task_type:7,
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
          task_type:8,
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
          task_type:9,
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
  ],
  activeTab:{}
})
const emit = defineEmits<{
  (e: "selectExperiment", val: any): void;

  (e: "establishChapter", val: any): void;
  (e: "editChapter", val: any): void;
  (e: "deleteChapter", val: any): void;

  (e: "editExperiment", val: any): void;
  (e: "deleteExperiment", val: any): void;
  
}>();
state.chapterList.forEach((v: any) => {
  v.list.forEach((i:any)=>{
    i.type_obj = Object.assign({}, getTypeList('90deg')[i.task_type]);
  })
  
});
const getTitLeftClass=()=>{
  let str=''
  if(props.Editable === 'canStudy'){
    str='study'
  }
  if(props.Editable === 'canEdit'){
    str='edit'
  }
  return str
}
  // 选中章节下实验
function selectExperiment(v:any){
  state.activeTab=v
  emit('selectExperiment',v)
  // pdf 视频 跳页面展示
  // const { href } = router.resolve({
  //   path: "/teacher/Workbench/open-jupyte",
  // });
  // window.open(href, "_blank");
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
function ViewExperiment(a:any){
  a.openGuidance=!a.openGuidance
  // a.type 如果是pdf 或者MP4 新开页面播放
}
// 创建章节
const establishChapter=(v:any)=>{
  emit('establishChapter',v)
}
// 编辑章节
const editChapter=(v:any)=>{
  emit('editChapter',v)
}
// 删除章节
const deleteChapter=(v:any)=>{
  emit('deleteChapter',v)
}

// 编辑章节下实验
const editExperiment=(v:any)=>{
  emit('editExperiment',v)
}
// 删除章节下实验
const deleteExperiment=(v:any)=>{
  emit('deleteExperiment',v)
}
</script>

<style lang="less" scope>
  .chapterList{
    // padding-bottom: 2rem;
    .title{
      justify-content: space-between;
      height: 46px;
      border-bottom: 1px dashed #e8e8e8;
      &:hover{
        background: #fff7e6;
        cursor: pointer;
      }
      .titleBox{
        width: calc(100% - 140px);
        // flex-grow: 1;
        .titleItem{
          color: var(--black-85);
          // margin-right: 1rem;
        }
        .titleItem1{
          width: 60px;
        }
        .titleItem2{
          // max-width: 50%;
        }
      }
      .noEdit{
         width: calc(100% - 40px);
      }
      .titleBoxRight{
        .collect{
          color: var(--primary-color);
          cursor: pointer;
          width: 28px;
        }
        .operation{
          width: 84px;
          span{
            display: none;
          }
        }
      }
      &:hover{
        .operation{
          span{
            display: flex;
          }
        }
      }
    }
    .listBox{
      transition: all .3s;
      padding: 1rem 0;
    }
    .list{
      .itemTit{
        justify-content: space-between;
        height: 40px;
        padding: 0 8px;
        .TitLeft{
          width: 100%;
          
          .experimentType{
            color: #1CB2B3;
            width: 60px;
            justify-content: center;
            span{
              // height: 24px;
              // line-height: 24px;
              padding: 4px 6px;
              border-radius: 10px;
            }
          }
          .experimentTitle{
            width: calc(100% - 60px);
            .order{
              color: #1CB2B3;
            }
            .ItemExperimentTitle{
              color: var(--black-65);
              width: calc(100% - 60px);
            }
          }
        }
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
          .view{
            color: var(--primary-color);
            margin-left: 24px;
            cursor: pointer;
          }
          .operation{
            span{
              display: none;
            }
          }
        }
        .study{
          width: calc(100% - 200px);
        }
        .edit{
          width: calc(100% - 100px);
        }
        &:hover{
          background: #fff7e6;
          cursor: pointer;
          .operation{
            span{
              display: flex;
            }
          }
        }
      }
      .ActiveItem{
        background: #fff7e6;
        .TitLeft .ItemExperimentTitle{
          color: var(--primary-color);
        }
      }
      .experimentGuide{
        // max-height: 500px;
        // overflow: auto;
        .experiment{
          border: 1px solid rgba(0,0,0,0.15);
          padding: 20px 10px 20px 30px;
          .itemContentBox{
            overflow: auto;
            max-height: 420px;
          }
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
  .operation{
    margin: 0 1rem;
    .iconfont{
      color: #1CB2B3;
      cursor: pointer;
      padding: 0 6px;
    }
  }
</style>