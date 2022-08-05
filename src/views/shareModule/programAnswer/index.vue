<template>
  <div class="programAnswer">
    <div class="top">
      <div class="left">
        题目名称
      </div>
      <div class="right">
         内存限制: <span>128mb</span>
         时间限制: <span>128mb</span>
         <a-select v-model:value="lanuageVal" placeholder="请选择" class="customSelect">
          <a-select-option
            v-for="(item, index) in lanuageList"
            :key="index"
            :value="item.value">
            {{item.label}}
          </a-select-option>
        </a-select>
        <a-divider type="vertical" style="background:#2C3A54;height:20px"/>
        <i class="iconfont icon-guanji"></i>
      </div>
    </div>
    <div class="content">
      <div class="left setScrollbar">
        <question/>
      </div>
      <div class="right">
        <div class="codeArea">
          <div id="customCode" :style="{'height': codeHeight + 'px'}">
            <codeMirror :height="codeHeight" v-model:code="code" :lang="lanuageVal"/>
          </div>
          <div class="resize">
            <i class="iconfont icon-yidong" @mousedown="dragEagle"></i>
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
            <a-tab-pane key="result" tab="测试结果" force-render>Content of Tab Pane 2</a-tab-pane>
          </a-tabs>
          <div class="resultInfo">
            <span>消耗内存：1.24mb</span>
            <span>代码执⾏时⻓：3452ms</span>
          </div>
        </div>
        <div class="operateBtn">
          <a-button>取消</a-button>
          <a-button type="primary" class="brightBtn">测试</a-button>
          <a-button type="primary">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject ,computed} from "vue";
import question from './component/question.vue'
import codeMirror from './component/codeMirror.vue'
import {simList} from 'src/views/teacherModule/teacherExamination/utils'
const lanuageVal = ref('')
const codeHeight = ref(400)
const code = ref('')
const langModel = ref()
const activeKey = ref('sample')
const testData = reactive({
  sample: '测试样例内容',
  result: ''
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
</script>
<style lang="less" scoped>
.programAnswer{
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
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
      .ant-select {
        margin-right: 20px;
        // border: 1px solid var(--brightBtn);
        color: var(--brightBtn);
        margin-top: -3px;
        :deep(.ant-select-selector) {
          border: 1px solid var(--brightBtn);
          color: var(--brightBtn);
          background: rgba(0, 0, 0, 0);
          width: 200px;
          height: 24px;
          line-height: 24px;
          .ant-select-selection-item {
            line-height: 22px;
          }
        }
        &.ant-select-open :deep(.ant-select-selection-item) {
          color: var(--brightBtn);
        }
        :deep(.ant-select-arrow) {
          color: var(--brightBtn);
        }
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