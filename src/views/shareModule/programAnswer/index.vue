<template>
<a-spin :spinning="testData.loading" size="large" tip="Loading..." wrapperClassName="programAnswerSpin">
  <div class="programAnswer">
    <div class="top">
      <div class="left single_ellipsis">
        {{problemData.question}}
      </div>
      <div class="right">
         内存限制： <span>{{problemData.memory_limit}}MB</span>
         时间限制：<span>{{Number(problemData.time_limit)}}MS</span>
         <lanuageSelect ref="lanuageSelectRef" @change="changeLanugae" :lang="languageDefault" :disabled=" languageDefault == 'sql' ? true : false"/>
        <a-divider type="vertical" style="background:#2C3A54;height:20px"/>
        <i class="iconfont icon-guanji" @click="closeTab"></i>
      </div>
    </div>
    <div class="content">
      <div class="left setScrollbar">
        <question :data="problemData" :type="questionType"/>
      </div>
      <div class="right">
        <div class="codeArea">
          <div id="customCode" :style="{'height': codeHeight + 'px'}">
            <codeMirror :height="codeHeight" v-model:code="code" :lang="languageVal.label"/>
          </div>
          <div class="resize">
            <i class="iconfont icon-huakuai1" @mousedown="dragEagle"></i>
          </div>
        </div>
        <div class="resultArea">
          <!-- 编程题 -->
          <template v-if="questionType === 'program'">
            <a-tabs v-model:activeKey="activeKey">
              <a-tab-pane key="sample" tab="测试样例">
                <a-textarea
                :bordered="false"
                  resize="none"
                  autoSize
                  placeholder="请输入内容"
                  v-model:value="testData.sample">
                </a-textarea>
              </a-tab-pane>
              <a-tab-pane key="result" tab="测试结果" force-render>
                <a-textarea
                :bordered="false"
                  resize="none"
                  autoSize
                  :readonly="true"
                  v-model:value="testData.resultText">
                </a-textarea>
              </a-tab-pane>
            </a-tabs>
            <div class="resultInfo">
              <span>消耗内存：{{testData.memory}}MB</span>
              <span>代码执⾏时⻓：{{testData.time}}MS</span>
              <i v-show="testData.result" :class="['iconfont',[4,13].includes(testData.result) ? 'icon-duigouxiao success' : 'icon-guanbixiao fail']"></i>
            </div>
          </template>
          <!-- SQL题 -->
          <template v-else>
            <div class="sqlResult setScrollbar">
              <div class="tableTitile">
                <span>预期输出</span>
                <i class="iconfont icon-duigouxiao success"></i>
              </div>
              <table class="customTable" border>
                <tr>
                  <th v-for="(col,index) in sqlData.expected_output?.col" :key="index">{{col}}</th>
                </tr>
                <tr v-for="(item,itemIndex) in sqlData.expected_output?.data" :key="itemIndex">
                  <td v-for="(td, tdIndex) in item" :key="tdIndex">{{td}}</td>
                </tr>
              </table>
              <div class="tableTitile">
                <span>实际输出</span>
                <div>
                  <span>消耗内存：{{testData.memory}}MB</span>
                  <span>代码执⾏时⻓：{{testData.time}}MS</span>
                  <i v-show="testData.result" :class="['iconfont',[4,13].includes(testData.result) ? 'icon-duigouxiao success' : 'icon-guanbixiao fail']"></i>
                </div>
              </div>
              <table class="customTable" border v-if="[4,13].includes(testData.result)">
                <tr>
                  <th v-for="(col,index) in sqlData.actual_output?.col" :key="index">{{col}}</th>
                </tr>
                <tr v-for="(item,itemIndex) in sqlData.actual_output?.data" :key="itemIndex">
                  <td v-for="(td, tdIndex) in item" :key="tdIndex">{{td}}</td>
                </tr>
              </table>
              <a-textarea
                v-else
                :bordered="false"
                  resize="none"
                  autoSize
                  :readonly="true"
                  v-model:value="testData.resultText">
                </a-textarea>
            </div>
          </template>
        </div>
        <div class="operateBtn">
          <a-button @click="closeTab">取消</a-button>
          <a-button type="primary" class="brightBtn" @click="handleSubmit(true)">测试</a-button>
          <a-button type="primary" @click="handleSubmit(false)">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</a-spin>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject ,computed, onMounted} from "vue";
import question from './component/question.vue'
import codeMirror from './component/codeMirror.vue'
import lanuageSelect from "./component/lanuageSelect.vue";
import {simList} from 'src/views/teacherModule/teacherExamination/utils'
import { Modal,message } from "ant-design-vue";
import { useRoute } from "vue-router";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { lStorage } from "src/utils/extStorage";
interface IproblemData {
  question: string,
  question_desc: string,
  input: string,
  output: string,
  sample_input: string,
  sample_output: string,
  time_limit: string,
  memory_limit: number | string
}
const route = useRoute()
const http = (request as any).QuestionBank;
const questionId = ref<any>(Number(route.query.questionId)) // 题目id
const examId = ref<any>(Number(route.query?.examId)) // 学生考试id
const questionType = ref<any>(route.query?.type ? route.query.type : 'program') // 题目类型(program、sql)
const languageDefault = ref<string>('') // 语言默认值
const isTeacher = lStorage.get('role') === 3 ? true: false
const questionScroe = ref<any>(route.query?.score) // 题目分值
const lanuageSelectRef = ref<any>()
const problemData = reactive<IproblemData>({
  question: '',
  question_desc: '',
  input: '',
  output: '',
  sample_input: '',
  sample_output: '',
  time_limit: '0',
  memory_limit: 0
})
const languageVal = reactive({
  value: '',
  label: ''
})
const codeHeight = ref(400)
const code = ref('')
const solutionId = ref('')
const activeKey = ref('sample')
const timerNum = ref<number>(0) // 轮询次数
const testData = reactive<any>({
  sample: '',
  resultText: '',
  result: '',
  time: 0,
  memory: 0,
  timer: null,
  loading: false
})
const sqlData = reactive<any>({
  expected_output: {}, // 预期输出
  actual_output: {} // 实际输出
})
// 拖动
  const dragEagle = (ev:any) => {
    var targetDiv:any = document.getElementById('customCode')
    var targetDivHeight = targetDiv.offsetHeight
    var that = this
    var resultHeight:any = 0
    var startY = ev.clientY;
    document.onmousemove = function (e) {
      e.preventDefault();
      //得到鼠标拖动的宽高距离：取绝对值
      var distY = Math.abs(e.clientY - startY)
      //往上方拖动：
      if (e.clientY < startY) {
        resultHeight = targetDivHeight - distY
      }
      //往下方拖动：
      if (e.clientY > startY) {
        resultHeight = targetDivHeight + distY
      }
      if (resultHeight < 100) {
        codeHeight.value = 100
      } else if (resultHeight > 650) {
        codeHeight.value = 650
      } else {
        codeHeight.value = resultHeight
      }
    }
    document.onmouseup = function () {
      document.onmousemove = null
    }
  }
  const changeLanugae = (val:any) => {
    Object.assign(languageVal,val)
    console.log(languageVal)
  }
// 题目详情
const getQuestionDetail = () => {
  let request:any = {
    'program': http.programDetail,
    'sql': http.sqlDetail
  }
  request[questionType.value]({urlParams: {ID: questionId.value}}).then((res:IBusinessResp) => {
    Object.assign(problemData, res.data.problem)
    problemData.question = res.data.question
    problemData.question_desc = res.data.question_desc
    testData.sample = problemData.sample_input
    // sql题目的预期输出
    if (questionType.value === 'sql') {
      sqlData.expected_output = res.data.expected_output
    }
  })
}
const resetContent = () => {
  testData.loading = false
  clearInterval(testData.timer)
  testData.timer = null
  testData.resultText = ''
  message.warning('测试失败')
}
const setResultValue = (result:any) => {
  testData.result = result.result
  testData.memory = result.memory
  testData.time = result.time
  testData.loading = false
  clearInterval(testData.timer)
  testData.timer = null
  activeKey.value = 'result'
  testData.resultText = ''
  let judge = lanuageSelectRef.value.judgeResult.filter((item:any) => item.id === result.result)
  if (judge.length) {
    testData.resultText = judge[0].cn_name + '\n'
  }
  // sql题目答对，就输出表格
  if (questionType.value === 'sql' && [4,13].includes(result.result)) { 
    sqlData.actual_output = result.actual_output
    return
  }
  if (result.compile_info) {
    testData.resultText += result.compile_info.error
    return
  }
  if (result.runtime_info) {
    testData.resultText += result.runtime_info.error
  }
}
// 查询测试结果
const getResult = (test_run:boolean) => {
  timerNum.value += 1
  http.solutionSatus({urlParams:{ID: questionId.value, solution_id:solutionId.value}}).then((res:IBusinessResp) => {
    let result = res.data
    // 测试、提交运行成功
    if (result.result === 4 || result.result === 13) {
      // 教师端点击提交按钮，显示分数
      if (!test_run) {
        message.success(`得 ${questionScroe.value} 分`,5)
      }
      setResultValue(result)
      return
    }
    // 状态大于4或者一分钟之后停止定时器;状态小于4的需要轮询
    if (result.result > 4 || timerNum.value > 20) {// 教师端点击提交按钮，显示分数
      if (!test_run) {
        message.warning(`得 0 分`,5)
      }
      setResultValue(result)
    }
  }).catch(()=>{
    resetContent()
  })
}
// 提交
const handleSubmit =(test_run:boolean) => {
  testData.resultText = ''
  testData.result = ''
  testData.memory = 0
  testData.time = 0
  timerNum.value = 0
  if (!code.value.trim().length){
    message.warning('请输入代码')
    return
  }
  if (test_run && questionType.value === 'program' && !testData.sample.trim().length) {
    message.warning('请输入测试样例')
    return
  }
  let params:any= {
    question_id: questionId.value,
    language: languageVal.value,
    test_run: test_run,
    source: code.value,
    input_text: testData.sample
  }
  if (examId.value) {
    params.exam_id = examId.value
  }
  http.runQuestions({param: params}).then((res:IBusinessResp) => {
     if (!res.data || !res.data.solution_id) {
        message.warning('接口未返回solution_id')
        return
     }
     solutionId.value = res.data.solution_id
     testData.loading = true
     getResult(test_run)
     testData.timer = setInterval(getResult, 3000, test_run);
  })
}
// 关闭标签页
const closeTab = () => {
  Modal.confirm({
    title: "确定要关闭当前页面吗？",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      window.close()
    },
  });
}
onMounted(()=>{
  getQuestionDetail()
  if (questionType.value === 'sql') {
    languageDefault.value = 'sql'
    languageVal.label = 'sql'
  } else {
    languageVal.label = 'c'
    languageDefault.value = 'c'
  }
})

</script>
<style lang="less" scoped>
.programAnswerSpin{
  height: 100%;
  &>div{
    height: 100%;
  }
  :deep(.ant-spin-container){
    height: 100%;
  }
  :deep(.ant-spin){
    max-height: none;
  }
}
.programAnswer{
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  .top{
    background: #192843;
    height: 45px;
    color: var(--white-100);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 75px;
    >.left{
      flex:1;
    }
    >.right{
      display: flex;
      align-items: center;
      margin-left:40px;
      >span{
        color: var(--primary-color);
        margin-right: 20px;
      }
      .iconfont{
        font-size: 20px;
        color: #FF4A3D;
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
  .content{
    flex: 1;
    padding: 20px 75px;
    display: flex;
    overflow: hidden;
    
    .left{
      width: 30%;
      margin-right: 20px;
      background: var(--white-100);
      overflow: auto;
      border-radius: 10px;
      padding: 24px;
    }
    .right{
      flex: 1;
      display: flex;
      flex-direction: column;
      .codeArea{
        position: relative;
        margin-bottom: 10px;
        #customCode{
          height: 400px;
          background: var(--white-100);
          border-radius: 10px;
          box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07);
        }
        .resize{
          width: 100%;
          position: absolute;
          bottom: -18px;
          z-index: 99;
          text-align: center;
          color: #000;
          i{
            font-size: 16px;
            cursor: row-resize;
          }
        }
      }
      .resultArea{
        margin-bottom: 10px;
        flex: 1;
        overflow: auto;
        background: var(--white-100);
        border-radius: 10px;
        box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07);
        position: relative;
        .sqlResult{
          height: 100%;
          overflow: auto;
          padding: 10px 24px; 
          .tableTitile{
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            color: var(--black-65);
            padding-bottom: 3px;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--gray-5);
            &>div>span{
              font-size: 14px;
              margin-left: 20px;
              color: var(--black-65);
            }
          }
          .customTable{
            width: 100%;
            border-color: #ccc;
            margin-bottom: 20px;
            td,th{
              padding: 5px 20px;
              text-align: center;
            }
          }
        }
          .iconfont{
            margin-left: 20px;
            &.success{
              color: #5AB400;
            }
            &.fail{
              color: #FF0505;
            }
          }
        .resultInfo{
          position: absolute;
          right: 20px;
          top: 13px;
          >span{
            margin-left: 20px;
            color: var(--black-65);
          }
        }
        :deep(.ant-tabs){
          height:100%;
          display: flex;
          flex-direction: column;
          .ant-tabs-nav-list, .ant-tabs-content{
            padding: 0 20px;
          }
          .ant-tabs-content-holder{
            flex:1;
            overflow: auto;
            &::-webkit-scrollbar {
              width: 0px;
              height: 8px;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 3px;
              background: var(--primary-1);
            }
            &::-webkit-scrollbar {
              width: 8px;
            }
          }
        }
      }
      .operateBtn{
        text-align: center;
        &>.ant-btn{
          margin-right: 15px;
        }
      }
    }
  }
}
</style>