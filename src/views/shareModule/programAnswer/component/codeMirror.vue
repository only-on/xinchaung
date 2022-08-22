<template>
  <div>
    <codemirror
      v-model="codeVal"
      placeholder=""
      :style="{ height: codeHeight + 'px', overflow:'auto' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tabSize="2"
      :mode="options.mode"
      :extensions="options.extensions"
      @blur="handleBlur"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, provide, inject ,computed} from "vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";
import { xml } from "@codemirror/lang-xml";
import { cpp } from "@codemirror/lang-cpp";
import {StreamLanguage} from "@codemirror/language"
import {go} from "@codemirror/legacy-modes/mode/go"
import {sql} from "@codemirror/legacy-modes/mode/sql"
import {ruby} from "@codemirror/legacy-modes/mode/ruby"
const props = defineProps({
  height: Number,
  code: String,
  lang: String
})
const emit = defineEmits<{
  (e: "update:code", val: any): void;
}>();
const codeHeight = ref(props.height)
const codeVal = ref('');
const options = reactive<{mode: string, extensions: any[]}>({
  mode: '',
  extensions: [html()]
})
// 语言选择框mime值
const  getMime = (val:any) =>{
  if(!val) return ''
  val = val.toLowerCase()
  let mime = ''
  switch (val) {
    case 'c':
      mime = 'csrc';
      break;
    case 'c++':
      mime = 'c++src';
      break;
    case 'c#':
      mime = 'csharp';
      break;
    default: 
      break;
  }
  if (val === 'javascript') {
    return 'text/'+val
  } else if (mime) {
    return 'text/x-' + mime
  } else {
    return 'text/x-' + val
  }
}
const handleBlur = (e:any) => {
  emit('update:code', codeVal.value)
}
watch(()=>props.height, newVal => {
  if (newVal) {
    codeHeight.value = newVal - 40
  }
},{immediate:true})
watch(()=>props.code, (newVal:any) => {
  codeVal.value = newVal
},{immediate:true})
watch(()=>props.lang, (newVal:any) => {
  options.mode = getMime(newVal)
  if(!newVal) return
  let str = newVal.toLowerCase()
  switch (str) {
    case 'html':
      options.extensions = [html()]
      break;
    case 'javascript':
      options.extensions = [javascript()]
      break;
    case 'python':
      options.extensions = [python()]
      break;
    case 'java':
      options.extensions = [java()]
      break;
      
    case 'php':
      options.extensions = [php()]
      break;
      
    case 'xml':
      options.extensions = [xml()]
      break;
    case 'c++':
      options.extensions = [cpp()]
      break;
  }
},{immediate:true})
</script>
<style lang="less" scoped>
.v-codemirror{
  :deep(.ͼ2 .cm-gutters){
    background: var(--white-100);
  }
  :deep(.ͼ1.cm-editor.cm-focused){
    outline: none;
  }
  :deep(.cm-scroller){
    &::-webkit-scrollbar {
      width: 0px;
      height: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: var(--primary-2);
    }
    &::-webkit-scrollbar {
      width: 8px;
    }
  }
}
</style>