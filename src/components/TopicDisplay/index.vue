<template>
  <div class="TopicDisplay">
    <div v-if="props.purpose==='IsEdit'" class="statistics flexCenter">
      <div class="flexCenter left">
        <div class="tit">试题列表</div>
        <div class="score">（
          <span>试题总数：{{statisticsInfo.selectNum}}</span>
          <span>总分：{{statisticsInfo.selectScore}}</span>
          ）</div>
      </div>
      <div class="flexCenter right">
        <div class="tip">小题之间可以拖拽排序</div>
        <a-button type="primary">继续选择</a-button>
      </div>
    </div>
    <div v-for="(v,k) in list" :key="v">
      <!-- 题型标题 v-for="(a,i) in v.question" :key="a"  -->
      <div class="QuestionType flexCenter">
        <div class="left flexCenter">
          <div>{{getTopicType[v.type]['name']}}</div>
          <div>（<span>共 {{v.question.length}} 题</span><span>共 {{TotalScore(v.question,'score')}} 分</span> ）</div>
        </div>
        <div class="right">
          <div v-if="props.purpose==='IsEdit'"  class="batchcaozuo flexCenter">
            <a-button type="primary" class="brightBtn" size="small"> 批量设置分值 </a-button>
            <a-button type="primary" class="del" size="small"> 删除 </a-button>
          </div>
        </div>
      </div>
      <!-- 题型展示 -->
      <Draggable :list="v.question" :draggable="props.purpose==='IsEdit'?'.item':'.noitem'" :sort="props.purpose==='IsEdit'?true:false"    @start="onStart" @end="onEnd(v.question)" ghost-class="ghost" :force-fallback="true" chosen-class="chosenClass" animation="300"  itemKey="id">
        <template #item="{ element,index}">
          <div class="item">
            <!-- 题号 -->
            <div class="itemOrder flexCenter">
              <div class="left flexCenter">
                <!-- <span>拖拽图标</span> -->
                <div>第{{NoToCh(index+1)}}题</div>
                <div class="score">（<span>{{element.score}}分</span>）</div>
              </div>
              <div class="right">
                <div v-if="props.purpose==='IsEdit'" class="caozuo flexCenter">
                  <a-button type="text" class="" size="small"> 设置分值 </a-button>
                  <a-button type="link" class="del" size="small">删除</a-button>
                </div>
              </div>
            </div>
            <!-- 题干 -->
            <div class="stem">
              {{element.question_desc}}
            </div>
            <!-- 答案可选项 -->
            <div>
              <!-- 选择题答案选项 -->
              <div class="option option1" v-if="v.type===1">
                <a-checkbox-group v-model:value="element.answer" style="width: 100%" @change="changebox" :disabled="CanDisabled()">
                  <a-row v-for="(j,b) in element.option" :key="j">
                    <a-checkbox :value="optionType[b]">{{`${optionType[b]}、`}}</a-checkbox>
                    <div> {{j.text}}</div>
                  </a-row>
                </a-checkbox-group>
              </div>
              <!-- 判断题答案选项 -->
              <div class="option option2" v-if="v.type===2">
                <a-radio-group v-model:value="element.answer" :disabled="CanDisabled()" @change="changebox">
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
                <div class="tiankong flexCenter" v-for="(j,b) in element.option" :key="element">
                  <span>{{`填空${b+1}`}}</span>
                  <a-input v-model:value="element.answer[b]" :disabled="CanDisabled()" />
                </div>
              </div>
              <!-- 简答题 -->
              <div class="option option4" v-if="v.type===4">
                  <div class="jianda">
                    <div class="daan">答案</div>
                    <a-textarea v-model:value="element.answer" :disabled="CanDisabled()" placeholder="" :autoSize="{ minRows: 4, maxRows: 6 }" />
                  </div>
              </div>
              <!-- 编程题 -->
              <div class="option option5" v-if="v.type===5">
                <Programming :info="programmingObj" /> 
                <div v-if="props.purpose==='achievement'" class="details operationResults">
                  <div class="outputTit">学生代码+运行日志</div>
                  <div class="outputContent" v-html="'最后执行的输入： 90 执行出错信息：'">
                  </div>
                </div>
                <div v-if="props.purpose==='IsStuAnswer'" class="reply"> 答 题 </div>
              </div>
              <!-- 模型题 -->
              <div class="option option6" v-if="v.type===6">
                <ModelQuestion :info="ModelObj" />
                <div v-if="props.purpose==='achievement'" class="details operationResults">
                  <div class="outputTit">学生答案</div>
                  <div class="outputContent">
                    <div class="flexCenter">
                      <div>
                        <span>结果文件</span>
                        <span>查看</span>
                      </div>
                      <div>
                        <span>结果文件</span>
                        <span>查看</span>
                      </div>
                    </div>
                    <div>作品说明</div>
                    <div>在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱。</div>
                  </div>
                </div>
                <div v-if="props.purpose==='IsStuAnswer'" class="reply"> 答 题 </div>
              </div>
              <!-- SQL题 -->
              <div class="option option7" v-if="v.type===7">
                <Sqldetail :info="SqllObj" />
                <div v-if="props.purpose==='IsStuAnswer'" class="reply"> 答 题 </div>
              </div>
            </div>
            <!-- 题目结果 -->
            <div v-if="props.purpose==='achievement'" class="achievement" >
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
                    <div v-if="v.type===4 && editScore()" class="flexCenter changeScore">
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
                  <div v-if="editScore()" class="flexCenter changeScore">
                    <span class="iconfont icon-bianji1"></span>
                    <span>修改得分</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </Draggable>
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
  PropType
} from "vue";
import Draggable from 'vuedraggable'
import Programming from './detail/programming.vue'
import ModelQuestion from './detail/ModelQuestion.vue'
import Sqldetail from './detail/Sqldetail.vue'
import MarkedEditor from "src/components/editor/markedEditor.vue";
import { useRouter, useRoute } from "vue-router";
import storage from "src/utils/extStorage";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import {NoToCh,TotalScore,randomCreatScore} from 'src/utils/common'
import getTopicType from './topictype'
const role = Number(storage.lStorage.get("role"));
const router = useRouter();
const route = useRoute();
const { editId } = route.query;
const http = (request as any).teacherImageResourcePool;


type Tpurpose= 'IsPreview' | 'IsEdit' | 'IsStuAnswer' | 'achievement'  //预览// 编辑// 学生作答 //成绩查看
interface Props {
  // IsPreview?: boolean;   //预览
  // IsEdit?:boolean        // 编辑
  // IsStuAnswer?:boolean   // 学生作答
  purpose?:Tpurpose
}
const props = withDefaults(defineProps<Props>(), {
  purpose:'achievement'
});

// const emit = defineEmits<{
//   (e: "selectedImage", val: any): void;
// }>();
const onStart=()=>{
  return true
}
const onEnd=(arr:any)=>{
  console.log(arr);
  // return true
}
const CanDisabled=()=>{
  return props.purpose!=='IsStuAnswer'
}
const editScore=()=>{
  return role===3
}
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
        answer:[],
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
        score:16,
        answer:['A'],
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
        answer:[],
      },
      {
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计 沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级， 实现加强正品心智，提升频',
        score:15,
        answer:[],
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
        answer:{},
      }
    ]
  },
  {
    type:6,
    question:[
      {
        score:15,
        question_desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。 在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；',
        answer:{},
      }
    ]
  },
  {
    type:7,
    question:[
      {
        score:28,
        question_desc:'SQL题目',
        answer:{},
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
var statisticsInfo=computed(()=>{
  let obj:any={
    selectNum:0,
    selectScore:0
  }
  if(list.length===0){
    return obj
  }
  list.forEach((v:any)=>{
    obj.selectNum+=v.question && v.question.length 
    obj.selectScore+=TotalScore(v.question,'score')
    //question
  })
  return obj
})
onMounted(()=>{
  // const {selectNum,selectScore}=randomCreatScore(list,'','')
})
</script>
<style scoped lang="less">
  .TopicDisplay{
    .statistics{
      justify-content: space-between;
      height: 50px;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      margin-bottom: 2rem;
      .left{
        .tit{
          font-size: 16px;
          color: var(--black-85);
          font-weight: 500;
        }
        .score{
          color: #1CB2B3;
          span{
            margin-right: 10px;
          }
        }
      }
      .right{
        .tip{
          color: var(--black-25);
          font-size: 12px;
          letter-spacing: 0.29px;
          margin-right: 10px;
        }
      }
    }
    .QuestionType{
      justify-content: space-between;
      padding-bottom: 14px;
      .del{
        margin-left: 10px;
      }
    }
    .item{
      color: var(--black-65);
      padding: 16px 30px;
      background-color: var(--lightgray-2);
      .itemOrder{
        justify-content: space-between;
        margin-bottom: 10px;
        height: 24px;
        .left{
          cursor: move;
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
        .operationResults{
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
            color: var(--black-85);
          }
          .outputContent{
            padding: 24px 34px;
            border-radius: 0px 0px 20px 20px;
            border: 1px solid rgba(0,0,0,0.15);
            border-top: none;
          }
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
