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
          <div class="batchcaozuo flexCenter">
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
            <div class="caozuo flexCenter">
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
          <a-checkbox-group v-model:value="a.answer" style="width: 100%" @change="changebox" :disabled="false">
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
            <a-input v-model:value="a.answer[b]" :disabled="true" />
          </div>
        </div>
        <!-- 简答题 -->
        <div class="option option4" v-if="v.type===4">
            <div class="jianda">
              <div class="daan">答案</div>
              <a-textarea v-model:value="a.answer" :disabled="false" placeholder="" :autoSize="{ minRows: 4, maxRows: 6 }" />
            </div>
        </div>
        <!-- 编程题 -->
        <div class="option option5" v-if="v.type===5">
          <Programming :info="programmingObj" />
          <div class="details details4">
            <div class="outputTit">代码+运行日志</div>
            <div class="outputContent" v-html="'最后执行的输入： 90 执行出错信息：'">
            </div>
          </div>
          <div class="reply"> 答 题 </div>
        </div>
        <!-- 模型题 -->
        <div class="option option6" v-if="v.type===6">
          <ModelQuestion :info="ModelObj" />
          <div class="reply"> 答 题 </div>
        </div>
        <!-- SQL题 -->
        <div class="option option7" v-if="v.type===7">
          <Sqldetail :info="SqllObj" />
          <div class="reply"> 答 题 </div>
        </div>
        <!-- 题目结果 -->
        <div class="achievement">
          <template v-if="[1,2,3,4].includes(v.type)">
            <div class="achievement1 Adjudicate flexCenter">
              <div class="left flexCenter" :class="k%2===0?'left1':'left2'">
                <!-- icon-cuowu -->
                <span class="iconfont" :class="k%2===0?'icon-cuowu':'icon-zhengque'"></span>
                <span>答{{`${k%2===0?'错':'对'}`}}了</span>
              </div>
              <div class="flexCenter">
                <div class="resultscore">
                  得<span>10</span>分
                </div>
                <div v-if="v.type===4" class="flexCenter changeScore">
                  <span class="iconfont icon-bianji1"></span>
                  <span>修改得分</span>
                </div>
              </div>
            </div>
            <div class="achievement1 rightkey">
              <div class="tip">{{`${v.type===2?'参考':'正确'}`}}答案：</div>
              <div>填空1（答案1） / 填空2（答案2）频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的 品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高</div>
            </div>
            <div class="achievement1 analysis">
              <div class="tip">题目解析：</div>
              <div>在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的 品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。</div>
            </div>
          </template>
          <template v-if="[5,6,7].includes(v.type)">
            <div class="achievement1 modifyscore flexCenter">
              <div class="resultscore">
                得<span>10</span>分
              </div>
              <div class="flexCenter changeScore">
                <span class="iconfont icon-bianji1"></span>
                <span>修改得分</span>
              </div>
            </div>
          </template>
          
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
import Programming from './detail/programming.vue'
import ModelQuestion from './detail/ModelQuestion.vue'
import Sqldetail from './detail/Sqldetail.vue'
import MarkedEditor from "src/components/editor/markedEditor.vue";
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
        score:14,
        answer:['B','D'],
        //   选择 answer:['B','D']  判断answer:[true],  填空answer:['填空答案1','填空答案2']   简答answer:['简答题答案'] 
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
      },
      {
        question_desc:'222Python关键字elif表示( ▁▁▁▁▁▁ )和( ▁▁▁▁▁▁ )两个单词的缩写。',
        option:[1,2,3],
        score:16,
        answer:[],
      }
    ]
  },
  {
    type:4,
    question:[
      {
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞',
        option:'',
        score:10,
        answer:'设计规范性差，设计沟通维护成本高。',
      },
      {
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞',
        option:'',
        score:19,
        answer:'答案2',
      }
    ]
  },
  {
    type:5,
    question:[
      {
        score:22,
        question_desc:'题目名称题目名称题目名称题目名称题目名称题目名称题目名称题目名称题目名称',
        
        requirement:'根据提示，在代码文件中Begin-End区间补充代码1',
        testExplain:'平台会对你编写的代码进行测试：输入数据以空格分开测试输入：536841113249预期输出：奇数列表：[5,3,11,13,9]',
        answer:{}
      }
    ]
  },
  {
    type:6,
    question:[
      {
        score:15,
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。 在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；',
        answer:{}
      }
    ]
  },
  {
    type:7,
    question:[
      {
        score:28,
        question_desc:'SQL题目',
        answer:{}
      }
    ]
  }
])
const programmingObj:any=reactive({
  desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计 沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级， 实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
  access:{
    input:'输入内容',
    output:'输出内容'
  },
  example:{
    input:'样例输入内容',
    output:'样例输出内容'
  },
})
const ModelObj:any=reactive({
  desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。',
  evaluating:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。 在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。'
})
const SqllObj:any=reactive({
  desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。'
})
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
        height: 24px;
        .left{
          .score{
            color: var(--primary-color);
          }
        }
        .right{
          .ant-btn-text{
            color: var(--brightBtn);
          }
          .caozuo{
            display: none;
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
        .ant-row,.tiankong,.jianda{
          padding: 14px 0;
        }
        .reply{
          height: 38px;
          line-height: 38px;
          background: rgba(0,0,0,0.07);
          cursor: pointer;
          text-align: center;
          margin-bottom: 1rem;
        }
        &.option3{
          .tiankong{
            span{
              width: 50px;
            }
          }
        }
        &.option4{
          .jianda{
            display: flex;
            .daan{
              width: 50px;
              padding-top: var(--fontSize);
            }
          }
        }
        &.option5{
          
          .details4{
            background: rgba(0,0,0,0.04);
            margin-bottom: 1rem;
            .outputTit{
              padding: 0 34px;
              height: 44px;
              background: rgba(0,0,0,0.10);
              line-height: 44px;
              border-radius: 20px 20px 0px 0px;
              border: 1px solid rgba(0,0,0,0.15);
              border-bottom: none;
            }
            .outputContent{
              padding: 24px 34px;
              border-radius: 0px 0px 20px 20px;
              border: 1px solid rgba(0,0,0,0.15);
              border-top: none;
            }
          }
        }
      }
      .achievement{
        .achievement1{
          margin-bottom: 16px;
        }
        .resultscore{
          color: #51B048;
          span{
            padding: 0 4px;
          }
        }
        .changeScore{
          color: var(--primary-color);
          .iconfont{
            padding: 0 4px;
            cursor: pointer;
          }
        }
        .Adjudicate{
          .left{
            width: 99px;
            height: 34px;
            border-radius: 4px;
            margin-right: 16px;
            justify-content: center;
            .iconfont{
              font-size: 34px;
              line-height: 34px;
            }
          }
          .left1{
            background: #FFF3F3;
            color: #E22D2D;
            
          }
          .left2{
            background: #ddf9f3;
            color: #1CB2B3;
          }
          .changeScore{
            margin-left: 16px;
          }
        }
        .rightkey,.analysis{
          display: flex;
          .tip{
            width: 90px;
          }
        }
        .rightkey{
          color: #1CB2B3;
        }
        .modifyscore{
          .resultscore{
            margin-right: 16px;
          }
        }
      }
      
      &{
        margin-bottom: 16px;
      }
      &:hover{
        background-color: #FFF7E6;
        .itemOrder .right .caozuo{
          display: flex;
        }
      }
    }
  }
</style>
