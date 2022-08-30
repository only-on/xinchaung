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
          <a-button type="primary" @click="keepOn()">继续选择</a-button>
        </div>
      </div>
      <div v-for="(v,k) in list" :key="v" class="TypeDifference">
        <!-- 题型标题 v-for="(a,i) in v.question" :key="a"  questionsList-->
        <div class="QuestionType flexCenter">
          <div class="left flexCenter">
            <div>{{getTopicType[v.type]['name']}}</div>
            <div>（<span>共 {{v.question.length}} 题</span><span>共 {{TotalScore(v.question,'score')}} 分</span> ）</div>
          </div>
          <div class="right">
            <div v-if="props.purpose==='IsEdit'"  class="batchcaozuo flexCenter">
              <a-button @click="SetupScore(0,v,k)" type="primary" class="brightBtn" size="small"> 批量设置分值 </a-button>
              <a-button @click="deleteTopic(0,v,k)" type="primary" class="del" size="small"> 删除 </a-button>
            </div>
          </div>
        </div>
        <!-- 题型展示 -->
        <Draggable :list="v.question" :draggable="props.purpose==='IsEdit'?'.item':'.noitem'" :sort="props.purpose==='IsEdit'?true:false"    @start="onStart" @end="onEnd(v.question)" ghost-class="ghost" :force-fallback="true" chosen-class="chosenClass" animation="300"  itemKey="id">
          <template #item="{ element,index}">
            <div class="item">
              <div class="itemSon">
                <!-- 题号 -->
                <div class="itemOrder flexCenter">
                  <div class="left flexCenter">
                    <img class="img" v-if="props.purpose==='IsEdit'" src="../../assets/images/TopicDisplay/tuo.png" alt=""/>
                    <div>第{{NoToCh(index+1)}}题</div>
                    <div class="score">（<span>{{element.score}}分</span>）</div>
                  </div>
                  <div class="right">
                    <div v-if="props.purpose==='IsEdit'" class="caozuo flexCenter">
                      <a-button @click="SetupScore(1,element,k)" type="text" class="" size="small"> 设置分值 </a-button>
                      <a-button @click="deleteTopic(1,element,k)" type="link" class="del" size="small">删除</a-button>
                    </div>
                  </div>
                </div>
                <!-- 题干 -->
                <div class="stem">
                  <!-- {{element.question}} -->
                  <MarkedEditor v-model="element.question" class="markdown__editor" :preview="true"/>
                </div>
                <!-- 答案可选项 -->
                <div class="optionBox">
                  <!-- 选择题答案选项 -->
                  <div class="option option1" v-if="v.type==='choice'">
                    <a-checkbox-group v-model:value="element.answer" style="width: 100%" @change="changebox(v,element)" :disabled="CanDisabled()">
                      <a-row v-for="(j,b) in element.choice_options" :key="j">
                        <!-- <a-checkbox :value="optionType[b]">{{`${optionType[b]}、`}}</a-checkbox> -->
                        <a-checkbox :value="j.content">{{`${j.origin_option}、`}}</a-checkbox>
                        <div> {{j.content}}</div>
                      </a-row>
                    </a-checkbox-group>
                  </div>
                  <!-- 判断题答案选项 -->
                  <div class="option option2" v-if="v.type==='judge'">
                    <a-radio-group v-model:value="element.answer" :disabled="CanDisabled()" @change="changebox(v,element)">
                      <a-row>
                        <a-radio :value="'right'">正确</a-radio>
                      </a-row>
                      <a-row>
                        <a-radio :value="'wrong'">错误</a-radio>
                      </a-row>
                    </a-radio-group>
                  </div>
                  <!-- 填空题答案选项 -->
                  <div class="option option3" v-if="v.type==='blank'">
                    <div class="tiankong flexCenter" v-for="(j,b) in element.blank_correct" :key="element.id">
                      <span>{{`填空${b+1}`}}</span>
                      <a-input v-model:value="element.answer[b]" @blur="changebox(v,element)" :disabled="CanDisabled()" />
                    </div>
                  </div>
                  <!-- 简答题 -->
                  <div class="option option4" v-if="v.type==='short-answer'">
                      <div class="jianda">
                        <div class="daan">答案</div>
                        <a-textarea v-model:value="element.answer" @blur="changebox(v,element)" :disabled="CanDisabled()" placeholder="" :autoSize="{ minRows: 4, maxRows: 6 }" />
                      </div>
                  </div>
                  <!-- 编程题 -->
                  <div class="option option5" v-if="v.type==='program'">
                    <Programming :info="element.problem" :desc="element.question_desc" :index="element.id" /> 
                    <div v-if="props.purpose==='achievement'" class="details operationResults">
                      <div class="outputTit">学生代码+运行日志</div>
                      <div class="outputContent" v-html="'最后执行的输入： 90 执行出错信息：'">
                      </div>
                    </div>
                    <div @click="programAnswer(element.question_id,'program')" v-if="props.purpose==='IsStuAnswer'" class="reply"> 答 题 </div>
                  </div>
                  <!-- 模型题 -->
                  <div class="option option6" v-if="v.type==='ai'">
                    <ModelQuestion :desc="element.question_desc" :evaluating="element.model.ai_test_desc" />
                    <div v-if="props.purpose==='achievement'" class="details operationResults">
                      <div class="outputTit">学生答案</div>
                      <div class="outputContent">
                        <ResultShow :resultInfo="{}" />
                        <!-- <div class="flexCenter">
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
                        <div>在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱。</div> -->
                      </div>
                    </div>
                    <div @click="AiAnswer(element.question_id)" v-if="props.purpose==='IsStuAnswer'" class="reply"> 答 题 </div>
                  </div>
                  <!-- SQL题 -->
                  <div class="option option7" v-if="v.type==='sql'">
                    <Sqldetail :info="SqllObj" :desc="element.question_desc" />
                    <div @click="programAnswer(element.question_id,'sql')" v-if="props.purpose==='IsStuAnswer'" class="reply"> 答 题 </div>
                  </div>
                </div>
                <!-- 题目结果 -->
                <div v-if="props.purpose==='achievement'" class="achievement" >
                  <template v-if="['choice','judge','blank','short-answer'].includes(v.type)">
                    <div class="achievement1 Adjudicate flexCenter">
                      <div class="left flexCenter" :class="element.is_right===0?'left1':'left2'">
                        <!-- <img :src="`../../assets/images/TopicDisplay/${element.is_right===0?'cuo':'dui'}.png`" alt=""/> -->
                        <img v-if="element.is_right===0" src="../../assets/images/TopicDisplay/cuo.png" alt=""/>
                        <img v-else src="../../assets/images/TopicDisplay/dui.png" alt=""/>
                        <span>答{{`${element.is_right===0?'错':'对'}`}}了</span>
                      </div>
                      <div class="flexCenter">
                        <div class="resultscore">
                          得<span>{{element.score}}</span>分
                        </div>
                        <div v-if="v.type==='short-answer' && editScore()" class="flexCenter changeScore" @click="editScoreFn(element,k)">
                          <span class="iconfont icon-bianji1"></span>
                          <span>修改得分</span>
                        </div>
                      </div>
                    </div>
                    <div class="achievement1 rightkey">
                      <div class="tip">{{`${v.type==='short-answer'?'参考':'正确'}`}}答案：</div>
                      <div class="text">{{standardAnswer(element)}}</div>
                    </div>
                    <div class="achievement2 analysis">
                      <div class="tip">题目解析：</div>
                      <!-- <div>{{element.question_analysis}}</div> -->
                      <MarkedEditor v-model="element.question_analysis" class="markdown__editor" :preview="true"/>
                    </div>
                  </template>
                  <template v-if="['program','ai','sql'].includes(v.type)">
                    <div class="achievement1 modifyscore flexCenter">
                      <div class="resultscore">
                        得<span>{{element.score}}</span>分
                      </div>
                      <div v-if="editScore()" class="flexCenter changeScore" @click="editScoreFn(element,k)">
                        <span class="iconfont icon-bianji1"></span>
                        <span>修改得分</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </Draggable>
      </div>
      <Empty v-if="!list.length && !props.loading"/>
  </div>
  <a-modal v-model:visible="Visible"  :title="batchData.title" class="setupVisible" :width="500">
    <a-form :layout="'horizontal'" :rules="rules" :model="formState" ref="formRef">
      <a-form-item :label="batchData.label" name="score">
        <a-input v-model:value="formState.score" :placeholder="`请输入分数`" suffix="分/题" />
      </a-form-item>
    </a-form>
    <template #footer>
      <Submit @submit="Save" @cancel="cancel"></Submit>
    </template>
  </a-modal>
  <!-- 选择题目 -->
  <addQuestion v-if="addVisible" v-model:visible="addVisible" @select="questionSelect" :allQuestionIds="allQuestionIds"/>
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
  PropType,
  createVNode
} from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import addQuestion from 'src/views/teacherModule/teacherExamination/component/addQuestion.vue'
import Submit from "src/components/submit/index.vue";
import Draggable from 'vuedraggable'
import Programming from './detail/programming.vue'
import ModelQuestion from './detail/ModelQuestion.vue'
import Sqldetail from './detail/Sqldetail.vue'
import MarkedEditor from "src/components/editor/markedEditor.vue";
import ResultShow from 'src/components/trialModel/resultShow.vue' //
import { useRouter, useRoute } from "vue-router";
import storage from "src/utils/extStorage";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { Modal, message } from "ant-design-vue";
import {NoToCh,TotalScore,Debounce} from 'src/utils/common'
import getTopicType from './topictype'
const role = Number(storage.lStorage.get("role"));
const router = useRouter();
const route = useRoute();
const { id ,uesr} = route.query;
const httpStu = (request as any).studentExamination;
const httpExam= (request as any).teacherExamination

type Tpurpose= 'IsPreview' | 'IsEdit' | 'IsStuAnswer' | 'achievement'  //预览// 编辑// 学生作答 //成绩查看
type Tcategory= 'assignment' | 'exam'   // 作业   考试
interface Props {
  // category?:Tcategory
  loading?:boolean
  purpose?:Tpurpose
  list:any
}
const props = withDefaults(defineProps<Props>(), {
  // category:'assignment',
  purpose:'achievement',
  loading:false,
  list:()=>{[]}
  
});

const emit = defineEmits<{
  // (e: "setScore", val: number[]): void;
  // (e: "setBatchScore", val: number[]): void;
  (e: "updataQuestion", val: any): void;   // 设置分数/删除后处理的数据格式    反馈给父组件
  (e: "updateList"): void;            // 更新列表 
  (e: "EndOfAnswer"): void;            // 答题时间已结束
}>();
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
  // return true
  return role===3
}
const optionType:any=reactive(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'])
const SqllObj:any=reactive({
  desc:'在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。在旧版分析中也提到，频道的整体设计风格缺乏品牌调性，缺少可以让用户记忆的品牌元素，无法建立对京东国际的品牌认知；并且视觉信息层级混乱，设计规范性差，设计沟通维护成本高。结合前期对用户及竞品的分析，以及一系列设计的探索，因此我们确定将从「品牌强化」及「体验升级」两个方向进行京东国际频道的品牌视觉全新升级，实现加强正品心智，提升频道访问量，品牌强化的业务目标。'
})
var statisticsInfo:any=reactive({
   selectNum:0,
    selectScore:0
})
const allQuestionIds:number[]=reactive([])
watch(()=>{return props.list},(val:any)=>{
  let obj:any={
    selectNum:0,
    selectScore:0
  }
  allQuestionIds.length=0
  val.map((v:any)=>{
    v.question.map((i:any)=>{
      allQuestionIds.push(i.id)
      // i.answer=i.answer?i.answer:{}
      // console.log();
      if(!i.answer){
        i.answer=getTopicType[i.kind]['answerformat']
      }
    })
    obj.selectNum+=v.question && v.question.length 
    obj.selectScore+=TotalScore(v.question,'score')
  })
  statisticsInfo.selectNum= obj.selectNum
  statisticsInfo.selectScore= obj.selectScore
  // console.log(allQuestionIds);
  
},{immediate:true,deep:true})

const DebounceUse:Function= new Debounce().use(submitAnswers,0.5) //延时
// 答题
var curQuestionId:Ref<number> = ref(0)
const changebox=(v:any,element:any)=>{
  console.log(v)
  if(curQuestionId.value === element.question_id){
    DebounceUse(element)
  }else{
    curQuestionId.value=element.question_id
    submitAnswers(element)
  }
}
function submitAnswers(params:any) {
  let answer=params.answer
  console.log(params.id); 
  console.log(params.answer);
  /// 需过滤空答案 
  // if(['choice','blank'].includes(params.kind) && answer && answer.length){
  //     answer=answer.filter((v:any)=>v)
  // }
  // console.log(answer);
  // if(['choice','blank'].includes(params.kind) && !answer.length){
  //   return
  // }
  // if(['judge','short-answer'].includes(params.kind) && !answer){
  //   return
  // }
  httpStu.submitAnswers({param:{exam_id:Number(id),question_id:curQuestionId.value,answer:params.answer}}).then((res:any)=>{
    // console.log(res)
    if(res.data.EndOfAnswer){
      emit('EndOfAnswer')  // 考试时间已结束
    }
  })
}
/**
 * 批量设置分数
 */
const selectIds:number[]=reactive([]) // 选中的 批量/单 修改/删除  的题id
function getQuestionIdsAndScore(arr:any[]){
  let arr2:any[]=[]
  arr.map((v:any)=>{
    v.question.map((i:any)=>{
      let obj={
        id:i.id,
        score:i.score
      }
      arr2.push(obj)
    })
  })
  return arr2
}
var setScoreType:Ref<number> = ref(0);
var setScoreData:any[]=[]
var setScoreKey:Ref<number> = ref(0);
var setScoreId:Ref<number> = ref(0);
var kind:Ref<string> = ref('');
// var loading:Ref<boolean> = ref(false);
// 成绩页   单个修改题得分
const editScoreFn=(item:any,key:number)=>{
  SetupScore(2,item,key)
}
// 编辑页   批量 单个修改题分数
const SetupScore=(type:number,item:any,key:number)=>{
  setScoreType.value=type
  setScoreKey.value=key
  batchData.title=titleArr[type]
  batchData.label=!type?getTopicType[item.type]['name']:'本题分值'
  Visible.value=true
  if(!type){
    // getId(data.question)
    // kind.value=item.type
    setScoreId.value=0
  }else{
    setScoreId.value=item.id
    // getId([data])
  }
}
const formRef = ref();
var Visible: Ref<boolean> = ref(false);
const titleArr=['批量设置分数','设置分数','修改得分']
var batchData:any=reactive({
  title:titleArr[0],
  label:'本题分值',
})
const formState=reactive<any>({
  score:''
})
const rules = {
  score: [
    { required: true, message: `请输入分数`, trigger: "blur" },
  ],
}
const cancel=()=>{
  Visible.value=false
}
const Save=()=>{
  formRef.value.validate().then(()=>{ 
    if(setScoreType.value===2){ //成绩页修改得分
      httpExam.editScore({param:{...formState,resultItemId:setScoreId.value},urlParams:{resultItemId:setScoreId.value}}).then(()=>{
        message.success('操作成功')
        emit('updateList')
      }).finally(()=>{
        formRef.value.resetFields()
        Visible.value=false
      })
      return 
    }
    //编辑页修改分数
    props.list.map((v:any,k:number)=>{
      if(v.type===props.list[setScoreKey.value].type){
          props.list[setScoreKey.value].question.map((i:any)=>{
            if(setScoreType.value===0){//批量   
              i.score=formState.score
            }else{
              if(setScoreId.value===i.id){
                i.score=formState.score
              }
            }
          })
        }
    })
    // message.success('操作成功')
    emit('updataQuestion',getQuestionIdsAndScore(props.list))
    formRef.value.resetFields()
    Visible.value=false
    
    // let pro:any=null
    // let type=props.category==='exam'?2:1
    // if(setScoreType.value){
    //   pro=httpExam.questionsScore({param:{...formState},urlParams:{examsId:id,questionsId:selectIds,type:type}})
    // }else{
    //   pro=httpExam.questionsBatchScore({param:{...formState,kind:kind.value},urlParams:{examsId:id,type:type}})
    // }
    // loading.value=true
    // pro.then((res: any)=>{
    //   message.success('操作成功')
    //   formRef.value.resetFields()
    //   Visible.value=false
    //   loading.value=false
    // }).catch((err:any)=>{
    //   loading.value=false
    // })
  })
}
/**
 * 批量删除
 */
const deleteTopic=(type:number,data:any,key:number)=>{
  // 前端删除   保存才生效
  // !type?getId(data.question):getId([data])
  props.list.map((v:any,k:number)=>{
    if(type===0){//批量
      if(v.type===data.type){
        props.list.splice(k,1)
      }
    }else{
      props.list[key].question.map((i:any,idx:any)=>{
        if(data.id===i.id){
          props.list[k].question.splice(idx,1)
        }
      })
      if(!props.list[key].question || props.list[key].question.length===0){
        props.list.splice(key,1)
      }
    }
  })
  // message.success('操作成功')
  emit('updataQuestion',getQuestionIdsAndScore(props.list))
  // let title=['确认批量删除吗？','确认删除吗？'][type]
  // batchData.label=!type?getTopicType[data.type]['name']:'本题分值'
  // Modal.confirm({
  //   title: title,
  //   icon: createVNode(ExclamationCircleOutlined),
  //   content: "删除后不可恢复",
  //   okText: "确认",
  //   cancelText: "取消",
  //   onOk() {
  //     httpStu.deleteTopic({ urlParams: { courseId: '' } }).then((res: any) => {
  //         message.success("删除成功");
  //     });
  //   },
  // });
}
function getQuestionAnswers(){
  // 看情况加loading
  // list.length=0
  httpStu.getQuestionAnswers({ urlParams: { courseId: '' } }).then((res: any) => {
      message.success("获取成功");
  })
}
//编程 sql  题作答 
const programAnswer=(val:number,type:string)=>{
  const {href} = router.resolve({
    path: '/programAnswer',
    query:{
      examId:id,
      questionId:val,
      type:type
    }
  })
  window.open(href,'_blank')
}
//模型题作答
const AiAnswer=(val:any)=>{
  // router.push({
  //   path:'/student/studentExamination/Examinationanswerques/studentModelAnswer',
  //   query:{
  //     examId:id,
  //     questionId:val,
  //   }
  // })
  const {href} = router.resolve({
    path:'/student/studentExamination/Examinationanswerques/studentModelAnswer',
    query:{
      examId:id,
      questionId:val,
    }
  })
  window.open(href,'_blank')
}
// 继续选择题目
const addVisible = ref<boolean>(false)
const keepOn=()=>{
  addVisible.value=true
}
const questionSelect=(data:any)=>{
  console.log('选择的题目',data)  //props.list
  data.map((v:any)=>{
    let isExitType=props.list.filter((a:any) => v.kind === a.type).length
    if(isExitType){
      props.list.map((i:any)=>{
        if(v.kind===i.type){
          if(!allQuestionIds.includes(v.id)){
            i.question.push(v)
          }
        }
      })
    }else{
      let obj={
        type:v.kind,
        question:[v]
      }
      props.list.push(obj)
    }
  })
  emit('updataQuestion',getQuestionIdsAndScore(props.list))
}
//处理正确答案
const standardAnswer=(element:any)=>{
      // console.log(element)
  let str=''
  // return str
  if(element.kind==='blank'){
    let arr:string[]=[]
    element.blank_correct.map((v:any,k:number)=>{
      let text=`填空${k+1}（${v}）`
      arr.push(text)
    })
    str=arr.join(' / ')
  }
  if(element.kind==='choice'){
    str=element.choice_correct.join('')
  }
  if(element.kind==='judge'){
    str='判断正确答案'
  }
  if(element.kind==='short-answer'){
    str='简答正确答案'
  }
  // console.log(str);
  return str
}
onMounted(()=>{
  // const selectSorce =randomCreateSorce
  // const {selectNum,selectScore}=randomCreatScore(list,'','')
  // getQuestionAnswers()
})
</script>
<style scoped lang="less">
  .TopicDisplay{
    .statistics{
      justify-content: space-between;
      height: 50px;
      border-bottom: 1px solid rgba(0,0,0,0.15);
      // margin-bottom: 2rem;
      margin: 24px 0;
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
    .TypeDifference{
      background-color: var(--white);
      margin-bottom: 24px;
      border-radius: 10px;
      box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.07); 
    }
    .QuestionType{
      justify-content: space-between;
      // padding-bottom: 14px;
      // background-color: var(--lightgray-2);
      background-color:var(--black-0-6);
      padding: 19px 40px;
      .del{
        margin-left: 10px;
      }
    }
    .item{
      color: var(--black-65);
      padding: 30px 30px 0;
      
      .itemSon{
        border-bottom: 1px solid var(--lightgray-2);
      }
      // background-color: var(--lightgray-2);
      .itemOrder{
        justify-content: space-between;
        margin-bottom: 10px;
        height: 24px;
        .left{
          cursor: move;
          .score{
            color: var(--primary-color);
          }
          .img{
            margin-right: 20px;
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
      .optionBox{
        padding-bottom: 30px;
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
          border-radius: 20px;
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
      }
      .achievement{
        border-top: 1px dotted var(--lightgray-2);
        padding: 24px 0 30px 28px;
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
          cursor: pointer;
          .iconfont{
            padding: 0 4px;
            
          }
        }
        .Adjudicate{
          .left{
            width: 99px;
            height: 34px;
            border-radius: 4px;
            margin-right: 16px;
            justify-content: space-evenly;
            img{
              width:18px;
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
        .rightkey{
          display: flex;
          color: #1CB2B3;
          .tip{
            width: 116px;
          }
          .text{
            flex: 1;
          }
        }
        .analysis{
          .tip{
            color: var(--black-65);
            padding:8px 0;
            font-weight: 700;
          }
        }
        .modifyscore{
          .resultscore{
            margin-right: 16px;
          }
        }
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
