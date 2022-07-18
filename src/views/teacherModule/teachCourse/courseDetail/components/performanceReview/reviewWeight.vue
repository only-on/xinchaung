<template>
  <a-modal
    title="一键评阅权重设置"
    v-model:visible="props.weightVisible"
    @cancel="colseModal"
    :footer="false"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <div class="review-weight-wrap">
      <div class="weight-content">
        <template v-if="weightData.show.includes('report')">
          <label>实验报告</label
          ><a-input v-model:value="weightData.calc.report" @change="dataChange"></a-input>
          <i v-if="weightData.show.length>1&&weightData.show.includes('question')">+</i>
        </template>
        <template v-if="weightData.show.includes('question')">
          <label>随堂测试</label
          ><a-input
            v-model:value="weightData.calc.question"
            @change="dataChange"
          ></a-input>
        </template>
          <template v-if="type == 0"> </template>
          <template v-if="weightData.show.includes('auto')">
            <i>+</i>
            <label>自动评分</label
            ><a-input v-model:value="weightData.calc.auto" @change="dataChange"></a-input>
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
import { message } from "ant-design-vue";
const props = defineProps({
  type: Number, // 0 实操类实验 1 视频文档类实验
  weightVisible: {
    // 弹框显示隐藏
    type: Boolean,
    require: false,
    default: false,
  },
  weightData: {
    default: {
      calc: { report: 0, question: 0, auto: 0 },
      show: ["report", "question", "auto"],
    },
  },
});
let auto = props.weightData.calc.auto ? props.weightData.calc.auto : 0;
let question = props.weightData.calc.question ? props.weightData.calc.question : 0;
let report = props.weightData.calc.report ? props.weightData.calc.report : 0;
let sum = auto + question + report;

const exceed = ref(false);
// 获取父组件方法
const emit = defineEmits(["update:weightVisible", "apply", "submit"]);
// 关闭弹窗
function colseModal() {
  emit("update:weightVisible", false);
}

// input数据发生变化时执行
function dataChange(e: InputEvent) {
  sum = 0;
  if ((e.target as any).value) {
    verifyNumber((e.target as any).value);
  }
  props.weightData.show.forEach((item: any) => {
    let v: any = "0%";
    if (props.weightData.calc[item]) {
      v = props.weightData.calc[item];
    }

    if (v.toString().indexOf("%") != -1) {
      v = v.substring(0, v.length - 1);
    }
    sum += Number(v);
  });

  if (sum > 100) {
    exceed.value = true;
  } else {
    exceed.value = false;
  }
}

// 校验
function verifyNumber(val:any) {
  if (!/^\d+\.?\d*\%?$/.test(val)) {
    message.warn("请输入数字");
    return false;
  } else if(Number(val)%1!==0){
    message.warn("请输入整数");
    return false;
  }else{
    return true
  }
}

// 应用到本课程
function apply() {
  //  props.weightData.calc.report
  //  props.weightData.calc.question
  //  props.weightData.calc.auto
  var flag=true
  if (!exceed.value) {
    if (sum == 100) {
      let verifyNumber:any=[props.weightData.calc.report,props.weightData.calc.question,props.weightData.calc.auto]
      for(var i=0;i<3;i++){
        if(verifyNumber[i]&&Number(verifyNumber[i])%1!==0){
          message.warn("请输入整数");
          flag=false
        }
      }
      if(flag){
        emit("apply");
      }else{
        return false;
      }
      
    } else {
      message.warn("权重比例加起来必须是100");
      return
    }
  } else {
    message.warning("权重总和超过已超过100%，无法应用！");
    return
  }
}
// 取消
function cancel() {
  emit("update:weightVisible", false);
}
// 提交
function submit() {
   var flag=true
  if (!exceed.value) {
    if (sum == 100) {
      let verifyNumber:any=[props.weightData.calc.report,props.weightData.calc.question,props.weightData.calc.auto]
      for(var i=0;i<3;i++){
        if(verifyNumber[i]&&Number(verifyNumber[i])%1!==0){
          message.warn("请输入整数");
          flag=false
        }
      }
      if(flag){
        emit("submit");
      }else{
        return false;
      } 
    } else {
      message.warn("权重比例加起来必须是100");
      return
    }
  } else {
    message.warning("权重总和超过已超过100%，无法提交！");
    return
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
    margin-top: 42px;
    text-align: center;
    button {
      margin-left: 8px;
      margin-right: 8px;
    }
  }
}
</style>
