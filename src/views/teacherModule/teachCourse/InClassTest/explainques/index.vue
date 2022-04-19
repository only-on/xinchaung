<template>
  <div>
    <a-modal
      :width="700"
      cancelText="取消"
      okText="发送"
      title="出题-问答题"
      :visible="props.modalVisable"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="modal-content">
        <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
          <a-form-item label="题目描述" name="titleDescription">
            <a-textarea v-model:value="formState.titleDescription"></a-textarea>
          </a-form-item>
          <a-form-item label="答案" name="textanswer">
            <a-textarea v-model:value="formState.textanswer"></a-textarea>
          </a-form-item>
          <a-form-item label="关键词" name="keyWords">
            <a-textarea v-model:value="formState.keyWords"></a-textarea>
          </a-form-item>
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
  textanswer: [{ required: true, message: "请输入答案" }],
  keyWords: [{ required: true, message: "请输入关键词" }],
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
  textanswer: "",
  keyWords: "",
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
  formState.textanswer = "";
  formState.keyWords = "";
  formState.score = "";
}
function sendExplainQues(){
  const params:any={
    question: formState.titleDescription,
    type_id: 5,
    level_id:1,
    origin_score: formState.score,
    keywords:[formState.keyWords],
    answers:[formState.textanswer]

  }
  http.addques({urlParams:{content_id:props.experitId},param:params}).then((res:any)=>{
    updateVisable(true)
  })
}
function handleOk() {
  formRef.value.validate().then(() => {
    sendExplainQues()
  });
}
function handleCancel() {
  updateVisable(false);
}
</script>
<style lang="less" scoped>
.radio_group {
  width: 100%;
}
.ant-checkbox-group {
  width: 100%;
}
.ant-input {
  border-radius: 18px;
}
</style>
