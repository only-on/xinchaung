<template>
<a-spin :spinning="testData.loading" size="large" tip="Loading..." wrapperClassName="programAnswerSpin">
  <div class="programAnswer">
    <div class="top">
      <div class="left">
        {{problemData.title}}
      </div>
      <div class="right">
         内存限制: <span>{{problemData.memeoy_limit}}kb</span>
         时间限制: <span>{{problemData.time_limit}}ms</span>
         <lanuageSelect @change="changeLanugae"/>
        <a-divider type="vertical" style="background:#2C3A54;height:20px"/>
        <i class="iconfont icon-guanji" @click="closeTab"></i>
      </div>
    </div>
    <div class="content">
      <div class="left setScrollbar">
        <question :data="problemData"/>
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
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="sample" tab="测试样例">
              <a-textarea
                resize="none"
                autoSize
                placeholder="请输入内容"
                v-model:value="testData.sample">
              </a-textarea>
            </a-tab-pane>
            <a-tab-pane key="result" tab="测试结果" force-render>
              <a-textarea
                resize="none"
                autoSize
                :readonly="true"
                v-model:value="testData.resultText">
              </a-textarea>
            </a-tab-pane>
          </a-tabs>
          <div class="resultInfo">
            <span>消耗内存：{{testData.memeory}}kb</span>
            <span>代码执⾏时⻓：{{testData.time}}ms</span>
          </div>
        </div>
        <div class="operateBtn">
          <a-button>取消</a-button>
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
interface IproblemData {
  title: string,
  input: string,
  output: string,
  sample_input: string,
  sample_output: string,
  time_limit: string,
  memeoy_limit: number | string
}
const route = useRoute()
const http = (request as any).QuestionBank;
const questionId = ref<any>(route.query.id)
const problemData = reactive<IproblemData>({
  title: '',
  input: '',
  output: '',
  sample_input: '',
  sample_output: '',
  time_limit: '0',
  memeoy_limit: 0
})
const languageVal = reactive({
  value: '',
  label: ''
})
const codeHeight = ref(400)
const code = ref('')
const solutionId = ref('')
const activeKey = ref('sample')
const testData = reactive<any>({
  sample: '测试样例内容',
  resultText: '',
  time: 0,
  memeory: 0,
  timer: null,
  loading: false
})
const lanuageList = [
  {
    value: 'javascript',
    label: 'javascript'
  },
  {
    value: 'html',
    label: 'html'
  }
]
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
  http.programDetail({urlParams: {ID: questionId.value}}).then((res:IBusinessResp) => {
    Object.assign(problemData, res.data.problem)
    problemData.title = res.data.question
    testData.sample = problemData.sample_input
  })
}
// 查询测试结果
const getResult = () => {
  http.solutionSatus({urlParams:{ID: questionId.value, solution_id:solutionId.value}}).then((res:IBusinessResp) => {
    let result = res.data
    if (result.result === 4 || result.result === 13) {
      testData.loading = false
      clearInterval(testData.timer)
      testData.timer = null
      if (result.compile_info) {
        testData.resultText = result.compile_info.error
        return
      }
      if (result.runtime_info) {
        testData.resultText = result.runtime_info.error
      }
    }
  }).catch(()=>{
    testData.loading = false
    clearInterval(testData.timer)
    testData.timer = null
    testData.resultText = ''
  })
}
// 提交
const handleSubmit =(test_run:boolean) => {
  if (!code.value.trim().length){
    message.warning('请输入代码')
    return
  }
  if (test_run && !testData.sample.trim().length) {
    message.warning('请输入测试样例')
    return
  }
  let params = {
    language: languageVal.value,
    test_run: test_run,
    source: code.value,
    input_text: testData.sample
  }
  http.submitProgramQuestion({urlParams:{ID:questionId.value},param: params}).then((res:IBusinessResp) => {
    if (test_run) {
     solutionId.value = res.data.solution_id
     testData.loading = true
     getResult()
     testData.timer = setInterval(getResult, 3000);
    } else {
      message.success('提交成功')
    }
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
})

</script>
<style lang="less" scoped>
.programAnswerSpin{
  height: 100%;
  :deep(.ant-spin-container){
    height: 100%;
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
      cursor: pointer;
    }
    >.right{
      display: flex;
      align-items: center;
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
        background: var(--white-100);
        border-radius: 10px;
        box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.07);
        position: relative;
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
          .ant-tabs-nav-list, .ant-tabs-content{
            padding: 0 20px;
          }
          .ant-input{
            border: 0;
          }
          .ant-input:focus, .ant-input-focused{
            box-shadow: none;
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