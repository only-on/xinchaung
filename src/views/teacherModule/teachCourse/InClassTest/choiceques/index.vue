<template>
  <div>
    <a-modal
      :width="700"
      cancelText="取消"
      okText="发送"
      title="出题—选择题"
      :visible="props.modalVisable"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="modal-content">
        <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
          <a-form-item label="题目描述" name="titleDescription">
            <a-textarea v-model:value="formState.titleDescription"></a-textarea>
          </a-form-item>
          <div>
              <a-checkbox-group name="checkboxgroup" class="radio_group"
              v-model:value="formState.answer">
                <div class="option">
                  <div class="option-item">
                    <a-form-item :label="'选项A'" name="optionA">
                      <a-input v-model:value="formState.optionA"></a-input>
                    </a-form-item>
                  </div>
                  <div class="setAnswer">
                    <a-checkbox :value="0">设为答案</a-checkbox> 
                  </div>
                </div>
                <div class="option">
                  <div class="option-item">
                    <a-form-item :label="'选项B'" name="optionB">
                      <a-input v-model:value="formState.optionB"></a-input>
                    </a-form-item>
                  </div>
                  <div class="setAnswer">
                    <a-checkbox :value="1">设为答案</a-checkbox>
                  </div>
                </div>
                <div class="option">
                  <div class="option-item">
                    <a-form-item :label="'选项C'" name="optionC">
                      <a-input v-model:value="formState.optionC"></a-input>
                    </a-form-item>
                  </div>
                  <div class="setAnswer">
                    <a-checkbox :value="2">设为答案</a-checkbox>
                  </div>
                </div>
                <div class="option">
                  <div class="option-item">
                    <a-form-item required :label="'选项D'" name="optionD">
                      <a-input v-model:value="formState.optionD"></a-input>
                    </a-form-item>
                  </div>
                  <div class="setAnswer">
                    <a-checkbox :value="3">设为答案</a-checkbox>
                  </div>
                </div>
              </a-checkbox-group>
          </div>
          <a-form-item label="分数" name="score">
            <a-input v-model:value="formState.score"></a-input>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  ref,
  toRef,
  inject,
  reactive,
  toRefs,
  defineExpose,
} from "vue";
import { Modal, message } from "ant-design-vue";
import request from 'src/api/index'
const http = (request as any).teacherInclassTest;
const rules: any = ref("");
rules.value = {
  titleDescription: [{ required: true, message: "请输入题目描述" }],
  optionA: [{ required: true, message: "请输入选项A内容" }],
  optionB: [{ required: true, message: "请输入选项B内容" }],
  optionC: [{ required: true, message: "请输入选项C内容" }],
  optionD: [{ required: true, message: "请输入选项D内容" }],
  score: [{ required: true, message: "请输入分数" }],
};
interface Istate {
  visible: boolean;
}
const state: Istate = reactive({
  visible: false,
});
const formState: any = reactive({
  titleDescription: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  answer: [],
  score: "",
});
interface Props {
  modalVisable: boolean;
  experitId:any;
}
const props = withDefaults(defineProps<Props>(), {
  modalVisable: false,
  experitId:''
});
const formRef = ref<any>("null");
const emit = defineEmits<{ (e: "updateVisable", val: any,addok:any): void }>();
function updateVisable(addok:any) {
  emit("updateVisable", false,addok);
  clearInputContent();
}
function clearInputContent() {
  formState.titleDescription = "";
  formState.optionA = "";
  formState.optionB = "";
  formState.optionC = "";
  formState.optionD = "";
  formState.answer = [];
  formState.score = "";
}
function sendChoiceQues(){
  const params:any={
    question: formState.titleDescription,
    type_id:2,
    level_id:1,
    origin_score: formState.score,
    options: [formState.optionA,formState.optionB,formState.optionC,formState.optionD],
    answers:formState.answer

  }
  if(!props.experitId){
    message.warning('请创建实验再添加习题！')
    return
  }
  http.addques({urlParams:{content_id:props.experitId},param:params}).then((res:any)=>{
    updateVisable(true)
  })
}
function handleOk() {
  formRef.value.validate().then(() => {
    sendChoiceQues()
  });
}
function handleCancel() {
  updateVisable(false);
}
function verifiyInfor() {
  formRef.value.validate();
}
defineExpose({ verifiyInfor });
</script>
<style lang="less" scoped>
.radio_group {
  width: 100%;
}
.ant-checkbox-group {
  width: 100%;
}
.option {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  .option-item {
    width: 80%;
  }
  .setAnswer {
    width: 105px;
    height: 34px;
    background: #f5f5f5;
    border-radius: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 10px;
  }
}
.ant-input {
  border-radius: 18px;
}
</style>
