<template>
  <a-modal
    title="一键评阅权重设置"
    v-model:visible="weightVisible"
    @cancel="colseModal"
    :footer="false"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <div class="review-weight-wrap">
      <div class="weight-content">
        <label>实验报告</label
        ><a-input
          v-model:value="fromData.report"
          @change="dataChange"
        ></a-input>
        <i>+</i>
        <label>随堂测试</label><a-input 
          v-model:value="fromData.test"
          @change="dataChange"></a-input>
        <template v-if="type == 0">
          <i>+</i>
          <label>实验代码</label><a-input
            v-model:value="fromData.code"
          @change="dataChange"
          ></a-input>
        </template>
      </div>
      <p class="hint" v-if="exceed">权重总和超过已超过100%，无法提交！</p>
      <div class="modal-footer">
        <a-button type="default" @click="cancel">取消</a-button>
        <a-button type="primary" @click="apply">应用到本课程</a-button>
        <a-button type="primary" @click="submit">提交</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, reactive, onMounted, ref, nextTick } from "vue";
import {message} from "ant-design-vue"
const props = defineProps({
  type: Number,   // 0 实操类实验 1 视频文档类实验
  weightVisible: { // 弹框显示隐藏
    type: Boolean,
    require: false,
    default: false,
  },
});

console.log(window.XC_ROLE);

const fromData: {
  report: number | string;
  test: number | string;
  code: number | string;
} = reactive({
  report: "",
  test:"",
  code:""
});

const exceed=ref(false)
// 获取父组件方法
const emit = defineEmits(["update:weightVisible"]);
// 关闭弹窗
function colseModal() {
  emit("update:weightVisible", false);
}

// input数据发生变化时执行
function dataChange(e: InputEvent) {
  if ((e.target as any).value) {
    verifyNumber((e.target as any).value)
  }
  let report:string=fromData.report?fromData.report as any:0
  let test:string=fromData.test?fromData.test as any:0
  let code:string=fromData.code?fromData.code as any:0
  if (report&&report.indexOf("%")!=-1) {
    report=report.substring(0,report.length-1)
  }
  if (test&&test.indexOf("%")!=-1) {
    test=test.substring(0,test.length-1)
  }
  if (code&&code.indexOf("%")!=-1) {
    code=code.substring(0,code.length-1)
  }
  
  if (props.type==0) {
    if (Number(report)+Number(test)+Number(code)>100) {
     exceed.value=true
    }else{
      exceed.value=false
    }
  }else{
    if (Number(report)+Number(test)) {
     exceed.value=true
    }else{
      exceed.value=false
    }
  }
}

// 校验
function verifyNumber(val:string) {
  if (!(/^\d+\.?\d*\%?$/.test(val))) {
    message.warn("请输入数字")
    return false
  }else{
    return true
  }
}

// 应用到本课程
function apply() {
  console.log("apply");
}
// 取消
function cancel() {
  emit("update:weightVisible",false)
}
// 提交
function submit() {
  if (!exceed.value) {
    console.log("pass");
  }else{
    message.warning("权重总和超过已超过100%，无法提交！")
  }
}
onMounted(() => {
  // dataChange()
});
</script>

<style lang="less" scoped>
.review-weight-wrap {
  .weight-content {
    display: flex;
    align-items: center;
    label {
      flex-shrink: 0;
    }
    input {
      width: 70px;
      margin-left: 8px;
      border-radius: 18px;
    }
    i {
      margin: 0 8px;
      font-style: normal;
    }
  }

  .hint {
    color: var(--red-5);
    letter-spacing: 0.86px;
    font-size: 12px;
    margin-top: 16px;
    // margin-bottom: 18px;
  }
  .modal-footer {
    margin-top: 18px;
    text-align: center;
    button {
      margin-left: 8px;
      margin-right: 8px;
    }
  }
}
</style>
