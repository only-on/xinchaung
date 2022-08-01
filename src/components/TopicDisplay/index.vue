<template>
  <div class="TopicDisplay">
    <div v-for="(v,k) in list" :key="v">
      <!-- 题型标题 -->
      <div class="QuestionType flexCenter">
        <div class="left flexCenter">
          <div>{{getTopicType[v.type]['name']}}</div>
          <div>（<span>共 {{v.question.length}} 题</span><span>共 {{TotalScore(v.question,'score')}} 分</span> ）</div>
        </div>
        <div class="right">
          <div class="flexCenter caozuo">
            <a-button type="primary" class="brightBtn" size="small"> 批量设置分值 </a-button>
            <a-button type="primary" class="del" size="small"> 删除 </a-button>
          </div>
        </div>
      </div>
      <!-- 题型展示 -->
      <div class="item" v-for="(a,i) in v.question" :key="a">
        <div class="itemOrder flexCenter">
          <div class="left flexCenter">
            <!-- <span>拖拽图标</span> -->
            <div>第{{NoToCh(i+1)}}题</div>
            <div class="score">（<span>{{a.score}}分</span>）</div>
          </div>
          <div class="right">
            <div class="flexCenter caozuo">
              <a-button type="text" class="" size="small"> 设置分值 </a-button>
              <a-button type="link" class="del" size="small">删除</a-button>
            </div>
          </div>
        </div>
        <div class="stem">
          {{a.question_desc}}
        </div>
        <!-- 选择题答案选项 -->
        <div class="option option1" v-if="v.type===1">
          <a-checkbox-group v-model:value="a.answer" style="width: 100%" @change="changebox" :disabled="true" >
            <a-row v-for="(j,b) in a.option" :key="j">
              <a-checkbox :value="optionType[b]">{{`${optionType[b]}、`}}</a-checkbox>
              <div> {{j.text}}</div>
            </a-row>
          </a-checkbox-group>
        </div>
        <!-- 判断题答案选项 -->
        <div class="option option2" v-if="v.type===2">
          <a-radio-group v-model:value="a.answer" :disabled="true" @change="changebox">
            <a-row>
              <a-radio :value="1">正确</a-radio>
            </a-row>
            <a-row>
              <a-radio :value="2">错误</a-radio>
            </a-row>
          </a-radio-group>
        </div>
        <!-- 填空题答案选项 -->
        <div class="option option3" v-if="v.type===3">
          <div class="tiankong flexCenter" v-for="(j,b) in a.option" :key="a">
            <span>{{`填空${b+1}`}}</span>
            <a-input v-model:value="a.answer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  Ref,
  inject,
  computed,
  toRefs,
  watch,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import {NoToCh,TotalScore} from 'src/utils/common'
import getTopicType from './topictype'
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;
var configuration: any = inject("configuration");
var updata = inject("updataNav") as Function;
updata({
  tabs: [{ name: "作业", componenttype: 0 }],
  showContent: true,
  componenttype: undefined,
  showNav: false,
});
// interface Props {
//   defaultConfig: any;
//   imageList:string
// }
// const props = withDefaults(defineProps<Props>(), {
//   defaultConfig: () => {},
//   imageList:'',
// });

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();

var checked:Ref<boolean>=ref(false)
const optionType:any=reactive(['A','B','C','D','E','F','G'])
var list:any=reactive([
  {
    type:1,
    question:[
      {
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计 沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级， 实现加强正品心智，提升频',
        option:[
          {
            text:'旧版底部导航图标均为直角处理，会显得生硬，且部分图标的语义并不符合'
          },
          {
            text:'新版图标采取断点式风格，在转角处做圆润倒角处理'
          },
          {
            text:'与主站首页风格保持统一的前提下也延续了频道的整体调性。'
          },
          {
            text:'configurations.xh'
          },
        ],
        score:10,
        answer:[]
      },
      {
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计 沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级， 实现加强正品心智，提升频',
        option:[
          {
            text:'旧版底部导航图标均为直角处理，会显得生硬，且部分图标的语义并不符合'
          },
          {
            text:'新版图标采取断点式风格，在转角处做圆润倒角处理'
          },
          {
            text:'与主站首页风格保持统一的前提下也延续了频道的整体调性。'
          },
          {
            text:'configurations.xh'
          },
        ],
        score:15,
        answer:[]
      }
    ]
  },
  {
    type:2,
    question:[
      {
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计 沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级， 实现加强正品心智，提升频',
        score:15,
        answer:[]
      },
      {
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计 沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级， 实现加强正品心智，提升频',
        score:15,
        answer:[]
      },
    ]
  },
  {
    type:3,
    question:[
      {
        question_desc:'Python关键字elif表示( ▁▁▁▁▁▁ )和( ▁▁▁▁▁▁ )两个单词的缩写。',
        option:[1,2],
        score:10,
        answer:[],
      }
    ]
  }
])

const changebox=()=>{
  
}
</script>
<style scoped lang="less">
  .TopicDisplay{
    .QuestionType{
      justify-content: space-between;
      .del{
        margin-left: 10px;
      }
    }
    .item{
      color: var(--black-65);
      padding: 16px 30px;
      .itemOrder{
        justify-content: space-between;
        margin-bottom: 10px;
        .left{
          .score{
            color: var(--primary-color);
          }
        }
        .right{
          .ant-btn-text{
            color: var(--brightBtn);
          }
        }
      }
      .stem{
        line-height: 28px;
      }
      .option{
        // padding: 16px 0;
        // display: flex;
        // align-items: center;
        .ant-row{
          padding: 14px 0;
        }
      }
      
      &{
        margin-bottom: 16px;
      }
      &:hover{
        background-color: #FFF7E6;
      }
    }
  }
</style>
