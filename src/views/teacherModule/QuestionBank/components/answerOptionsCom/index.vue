<template>
<a-form-item
    class="answer-option"
    v-for="(item, index) in multipleQuesSelection"
    :key="index"
    :name="['multipleQuesSelection', index, 'value']"
    :rules="{
        required: true,
        message:type == 1?selectLabels[index]+'选项不能为空':'填空' + (index + 1)+'不能为空',
    }"
    >
      <template #label v-if="index == 0">
        {{index == 0 ? '答案选项' : ''}}
        <span class="tiptit" v-if="index == 0 && type == 1">点击选项可以设置正确答案</span>
      </template>
    <div style="display: flex; margin-bottom:0px">
        <span v-if="type == 1" :class="item.ifAnswer?'selected_answer':'select_answer'" @click="item.ifAnswer=!item.ifAnswer">{{ selectLabels[index] }}</span>
        <span v-else class="blankLabel">{{ "填空" + (index + 1) }}</span>
        <a-input v-model:value="item.value" />
        <div class="answer_item">
        <span
            v-if="Number(index) > (type == 1?1:0)"
            class="icon iconfont icon-yichu1"
            @click="deleteItem(index)"
        ></span>
        <span
            v-if="index == multipleQuesSelection.length - 1"
            class="icon iconfont icon--tainjia"
            @click="addItem(index)"
        ></span>
        </div>
    </div>
    </a-form-item>
</template>
<script lang="ts" setup>
import {
  ref,
  toRefs,
  onMounted,
  Ref,
  inject,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { Modal, message } from "ant-design-vue";
interface optionTypes{
    ifAnswer:any;
    value:any;
}
interface Props {
  type:any;
  multipleQuesSelection:optionTypes[];
}
const props = withDefaults(defineProps<Props>(),{
 labelName: () =>'',
 multipleQuesSelection:()=>[]
});
var selectLabels: any = ref(["A", "B", "C", "D", "E", "F", "G"]);
const emit = defineEmits<{
  (e: "addItem", index: any): void;
  (e: "deleteItem",index: any): void;
}>();
function addItem(index: any) {
    emit("addItem",index);
}
function deleteItem(index: any) {
    emit("deleteItem",index);
}
</script>
<style lang="less" scoped>
.answer-option {
  .ant-input {
    width: 740px;
  }
  .answer_item {
    margin-left: 14px;
  }
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 24px;
  }
}
.select_answer {
  width: 34px;
  height: 34px;
  border: 1px solid #dfdfdf;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
.selected_answer {
  width: 34px;
  height: 34px;
  border: 1px solid var(--primary-color);
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}
.select_answer:hover,.selected_answer:hover{
  cursor: pointer;
}
.answer_item {
  .icon {
    font-size: 20px;
  }
  .icon-yichu1 {
    margin-left: 10px;
    margin-right: 10px;
    color: #ff9544;
  }
  .icon--tainjia {
    color: #1cb2b3;
  }
}
.blankLabel {
  width: 50px;
  height: 34px;
  display: flex;
  align-items: center;
}
</style>