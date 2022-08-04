<template>
  <div class="programAnswer">
    <div class="top">
      <div class="left">
        <i class="iconfont icon-zuojiantou"></i>
        题目名称
      </div>
      <div class="right">
         内存限制: <span>128mb</span>
         时间限制: <span>128mb</span>
         <a-select v-model:value="lanuageVal" placeholder="请选择" class="customSelect">
          <a-select-option
            v-for="(item, index) in simList"
            :key="index"
            :value="item.value">
            {{item.label}}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="content">
      <div class="left setScrollbar">
        <question/>
      </div>
      <div class="right">
        <div class="codeArea">
          <div id="customCode" :style="{'height': codeHeight}"></div>
          <div class="resize">
            <i class="iconfont icon-yidong" @mousedown="dragEagle"></i>
          </div>
        </div>
        <div class="reaultArea"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, watch, provide, inject ,computed} from "vue";
import question from './component/question.vue'
import {simList} from 'src/views/teacherModule/teacherExamination/utils'
const lanuageVal = ref('')
const codeHeight = ref()
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
        codeHeight.value = 100 + 'px'
      } else if (resultHeight > 650) {
        codeHeight.value = 650 + 'px'
      } else {
        codeHeight.value = resultHeight + 'px'
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
    .left{
      cursor: pointer;
    }
    .right{
      >span{
        color: var(--primary-color);
        margin-right: 20px;
      }
      .ant-select {
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
        #customCode{
          height: 400px;
          background: pink;
        }
        .resize{
          width: 100%;
          position: absolute;
          bottom: -17px;
          z-index: 99;
          text-align: center;
          color: #000;
          i{
            font-size: 25px;
            cursor: row-resize;
          }
        }
      }
      .reaultArea{
        flex: 1;
        background: lightgreen;
      }
    }
  }
}
</style>