<template>
  <div class="chartTerr">
    <div class="chartTerrLeft" :class="((currentTab === '1' && role === 3) || role === 4)?'chartTerrLeft2':''">
      <div class="title flexCenter">
        <h3 class="courseh3">章节目录</h3>
        <a-button class="brightBtn" type="primary" @click="createChart()" v-if="(currentTab === '0' && role === 3)">新建章节</a-button>
      </div>
      <div class="myChapter textScrollbar">
        <ChapterList 
          :chartLoading="chartLoading"
          :chapterList="ChaptersTreeList"
          :Editable="props.Editable"
          @deleteChapter="deleteChapter"
          @deleteExperiment="deleteExperiment"
          @editExperiment="editExperiment"
          @editChapter="editChapter"
          @selectExperiment="selectExperiment" 
          @establishChapter="establishChapter" />
      </div>
    </div>
    <div class="chartTerrRight" v-if="currentTab === '0'" :class="state.activeExperimentObj.id?'':'flexCenter'">
      <template v-if="state.activeExperimentObj.id">
        <div class="title flexCenter">
          <h3 class="courseh3">实验指导</h3>
          <a-button type="primary" @click="Reselection()" v-if="state.activeExperimentObj.TeachingAids">重新选择</a-button>
          <div class="reports flexCenter" v-if="!state.activeExperimentObj.TeachingAids">
            <div class="report flexCenter" @click="viewReport">
              <span class="iconfont icon-timu"></span>
              <span>报告模板</span>
            </div>
            <div class="Lesson flexCenter" @click="viewReport">
              <span class="iconfont icon-jitibeike"></span>
              <span>开始备课</span>
            </div>
          </div>
        </div>
        <div class="pdfBox experimentGuide" v-if="(currentTab === '0' && role === 3)">
          <div v-if="state.activeExperiment.type==='experiment'" class="experiment">
            <div class="itemContentBox textScrollbar">
              <div class="itemContent" v-for="i in state.activeExperiment.content" :key="i" :class="state.activeExperiment.openGuidance?'itemContentHeight':''">
                <h4 class="">{{i.title}}</h4>
                <div class="text">{{i.text}}</div>
              </div>
            </div>
          </div>
          <div class="video-box" v-if="state.activeExperiment.type==='mp4'">
            <video :src="env ? '/proxyPrefix' + detailInfoUrl : detailInfoUrl" :controls="true">
              您的浏览器不支持 video 标签
            </video>
          </div>
          <div class="pdfBox" v-if="state.activeExperiment.type==='pptx'">
            <!-- <PdfVue :url="'/professor/classic/courseware/112/13/1638337036569.pdf'" /> -->
          </div>
        </div>
      </template>
      <Empty v-else :text="'暂无数据'" />
    </div>
  </div>

  <a-modal v-model:visible="Visible"  :title="state.activeExperiment.title" class="setupVisible" :width="500">
    <a-form :layout="'vertical'" :rules="rules" :model="formState" ref="formRef">
      <a-form-item :label="`${state.activeExperiment.typeName}名称`" name="name">
        <a-input v-model:value="formState.name" :placeholder="`请输入${state.activeExperiment.typeName}名称`" />
      </a-form-item>
    </a-form>
    <template #footer>
      <Submit @submit="Save" @cancel="cancel"></Submit>
    </template>
  </a-modal>

  <!-- 选择实验或者素材 -->
  <ExperimentsAndMaterials :visible="editChartVisible" @closeDrawerDoc="closeDrawerDoc" @selectDocOrMp4File="selectFile" />
</template>

<script lang="ts" setup>
import { ref, toRefs, onMounted ,Ref,reactive,nextTick,createVNode} from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { IBusinessResp } from "src/typings/fetch.d";
import { useRoute ,useRouter} from "vue-router";
import request from 'src/api/index'
import ExperimentsAndMaterials from 'src/components/SelectDocOrMp4/ExperimentsAndMaterials.vue'
import Submit from "src/components/submit/index.vue";
import ChapterList from './ChapterList.vue'
import extStorage from "src/utils/extStorage";
import { Modal, message } from "ant-design-vue";
import Empty from "src/components/Empty.vue";
import { getTypeList } from 'src/views/teacherModule/teacherExperimentResourcePool/config'
const env = process.env.NODE_ENV == "development" ? true : false;
const detailInfoUrl='/professor/classic/video/112/22/1523425771.mp4'
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const route = useRoute();
const router = useRouter();
const { currentTab,course_id } = route.query;
interface Props {
  // chapterList:any
  Editable:string
  courseId:number
  // knowledge: any;
  // words:any
}
const props = withDefaults(defineProps<Props>(), {
  // knowledge: ()=> [],  //  
  // chapterList: ()=> [],      // 
  Editable:'readOnly',          //readOnly canStudy canEdit 是否可编辑
  courseId:0
});
const http=(request as any).teachCourse
const rules = {
  name: [
    { required: true, message: `请输入名称`, trigger: "blur" },
    { max: 30, message: `名称最多30个字符`, trigger: "blur" },
  ],
}
const formState=reactive<any>({
  name:''
})
var state:any=reactive({
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
  ],
  activeTab:{},
  activeExperiment:{
    title:'新建章节',
    type:1,     // 1新建章节 2编辑章节  3编辑素材  4编辑实验名称
    typeName:'章节'         
  },   // 章节树当前选中的实验类别
  activeExperimentObj:{      // 章节树当前选中的 实验
    id:0,
  }
})
/**
章节树操作
 */
var chartLoading: Ref<boolean> = ref(false);
var ExperimentsAndMaterialsObj=reactive<any>({
  activeExperiments:{},
  activeMaterials:[]
})
var editChartVisible: Ref<boolean> = ref(false);
// 新建章节
var Visible: Ref<boolean> = ref(false);
const formRef = ref();
const createChart=()=>{
  state.activeExperiment.title='新建章节'
  state.activeExperiment.type=1
  state.activeExperiment.typeName='章节'
  Visible.value=true
}
const closeDrawerDoc = () => {
  // 调保存到章节的接口
  editChartVisible.value = false;
};
const selectFile=(val:any)=>{
  console.log(val)
  editChartVisible.value = false;
  
  let  Pro=null
  if(val.type===1){   // 1实验  2教辅
    let obj={
      type:val.type,    
      content_ids:val.list
    }
    Pro = http.addCoursesChapter({urlParams: {courseId:props.courseId,chapterId:activeChapterId.value},param:{...obj}})
  }else{
    let obj={
      item_id:[val.item.id]
    }
    Pro = http.addCoursesChapterAids({urlParams: {courseId:props.courseId,chapterId:activeChapterId.value},param:{...obj}})
  }
  Pro.then((res: any) => {
    message.success("操作成功");
    getChaptersTree()
  });
  
}
// 选中的实验 、素材
var activeExperiment:any=reactive({

})
// 选中章节下实验
const selectExperiment=(val:any)=>{
  console.log(val)
  state.activeExperimentObj={...val}
  // 获取实验详情
  
}
//  编辑章节下素材、实验列表     保存/更新实验|实训|视频|文档到章节
const activeChapterId:Ref<number>=ref(0)
const establishChapter=(val:any)=>{
  console.log('添加实验列表',val)
  activeChapterId.value=val.id
  editChartVisible.value=true
}
//  编辑章节名称
const editChapter=(val:any)=>{
  console.log('编辑章节名称',val)
  activeChapterId.value=val.id
  formState.name=val.name
  state.activeExperiment.title='编辑章节名称'
  state.activeExperiment.type=2
  state.activeExperiment.typeName='章节'
  Visible.value=true
}
//  编辑实验名称
const editExperiment=(val:any)=>{
  console.log('编辑实验名称',val)
  // 区分是否是素材
  // 3编辑素材  4编辑实验名称
  state.activeExperiment.title=val.TeachingAids?'编辑教辅名称':'编辑实验名称'
  state.activeExperiment.type=val.TeachingAids?3:4
  state.activeExperiment.typeName=val.TeachingAids?'教辅':'实验'
  if(state.activeExperiment.type === 4){
    activeChapterId.value=val.id
    formState.name=val.name
  }
  Visible.value=true
}
//  删除章节
const deleteChapter=(val:any)=>{
  console.log('删除章节章节',val)
  activeChapterId.value=val.id
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      http.DeleteCourseChapter({urlParams: {courseId:props.courseId,chapterId:val.id}}).then((res: any) => {
        message.success("删除成功");
          getChaptersTree()
      });
    },
  });
}
// 删除实验
const deleteExperiment=(val:any)=>{
  console.log('删除实验',val)
  // return 
  // activeChapterId.value=val.v.id
  Modal.confirm({
    title: "确认删除吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "删除后不可恢复",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      let  Pro=null
      if(!val.a.TeachingAids){   // TeachingAids教辅    非-实验 
        Pro = http.DeleteCourseChapter({urlParams: {courseId:props.courseId,chapterId:val.a.id}})
      }else{
        Pro = http.DeleteChapterAids({urlParams: {courseId:props.courseId,chapterId:activeChapterId.value,itemId:val.a.id}})
      }
      Pro.then((res: any) => {
        message.success("删除成功");
        getChaptersTree()
      });;
    },
  });
}
//  编辑章节名称   实验名称公用
const EditCreateChapterName=(id:number)=>{
  formRef.value.validate().then(()=>{ 
      http.EditCreateChapterName({param:{chapter_name:formState.name},urlParams:{courseId:props.courseId,chapterId:id}}).then((res: IBusinessResp)=>{
        message.success('操作成功')
        formState.name=''
        Visible.value=false
        getChaptersTree()
    })
  })
}
const Save=()=>{
  // Visible.value=false
  // state.activeExperiment.type=1   编辑 章节 素材 实验名称  区分
  
  if(state.activeExperiment.type === 1){ // 新建章节
    formRef.value.validate().then(()=>{ 
        http.createChapter({param:{chapter_name:formState.name},urlParams:{courseId:props.courseId}}).then((res: IBusinessResp)=>{
          message.success('操作成功')
          formState.name=''
          Visible.value=false
          getChaptersTree()
      })
    })
  }
  if(state.activeExperiment.type === 2 || state.activeExperiment.type === 4){  // 1新建章节 2编辑章节  3编辑素材  4编辑实验名称
    EditCreateChapterName(activeChapterId.value)
  }
}
const cancel=()=>{
  formRef.value.resetFields()
  Visible.value=false
}
// 重新选择章节教辅
const Reselection=()=>{
  Visible.value=true
}
//
const viewReport=()=>{
  Visible.value=false
}
const initData = () => {
  return
  // const param = currentTab.value ? Object.assign({}, {...searchInfo}, {myexper: true}) : Object.assign({}, {...searchInfo})
  // const param: ISearchInfo = Object.assign({}, {...searchInfo})
  // loading.value = true;
  // courseList.length = 0
  // http.getExperimentList({param}).then((res: IBusinessResp) => {
  //   loading.value = false
  //   if (!res) return
  //   const { list, page }  = res.data
  //   list.forEach((v: any) => {
  //     // v.type_obj = Object.assign({}, getTypeList('90deg')[v.task_type]);
  //   });
  //   courseList.push(...list)
  //   totalCount.value = page.totalCount
  // })
};
var ChaptersTreeList:any=reactive([])
const getChaptersTree=()=>{
  chartLoading.value=true
  ChaptersTreeList.length=0
  http.getChaptersTree({urlParams:{courseId:props.courseId}}).then((res:IBusinessResp)=>{
    const {data}=res
    chartLoading.value=false
    ChaptersTreeList.push(...data)
  })
}
onMounted(() => {
  getChaptersTree()
  // 获取课程详情
  //  获取章节树
});
</script>

<style lang="less" scope>
  .chartTerr{
    display: flex;
    
    .chartTerrLeft{
      width: 470px;
      // flex: 1;
      // padding: 10px;
      .title{
        padding: 10px;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .myChapter{
        // padding: 10px;
        min-height:500px;
        max-height: 700px;
        overflow: auto;
      }
    }
    .chartTerrLeft2{
      width: 914px;
    }
    .chartTerrRight{
      // width: 674px;
      margin-right: 16px;
      flex: 1;
      padding:10px 22px 22px;
      .title{
        justify-content: space-between;
        .report{
          color: var(--primary-color);
          cursor: pointer;
        }
        .Lesson{
          margin-left: 2rem;
          cursor: pointer;
          color: var(--brightBtn);
        }
      }
      .pdfBox{
        height: 630px;
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
</style>