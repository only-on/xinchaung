<template>
  <div class="quill-editor-wrap">
    <a-spin :spinning="loading" :tip="handleType+'上传中...'">
      <XeQuill
        ref="quillDom"
        v-if="type === 'edit'"
        class=""
        :toolbar="toolbar"
        :options="options"
        v-model:value="content"
        :handlers="handlers"
        :style="{ height: height}"
        @selectionChange="selectionChange"
        @editorChange="editorChange"
      >
      </XeQuill>
    </a-spin>
    <div v-if="type === 'preview'" v-html="html"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, PropType, ref, Ref,reactive, toRefs,computed } from "vue";
import {XeQuill} from '@xianfe/vue3-quill'
import { Delta } from "quill-delta";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { isJsonString } from "src/utils/common";
const dev_base_url=import.meta.env.VITE_APP_BASE_API || ''
interface IreactiveData {
  content: Delta;
}
import { IBusinessResp} from 'src/typings/fetch.d';
import request from 'src/api/index'
const http=(request as any).common
// const http=(request as any).teacherCourseAnalysis
export default defineComponent({
  name: "Quill",
  components: {
    XeQuill,
  },
  props: {
    options: {
      default: () => {
        return {
           placeholder: "输入内容...",
            theme: "snow",
        }
      },
    },
    modelValue: {
      type: Object as PropType<Delta>,
      default: () => [],
      require: true,
    },
    rang:{
      type: Number,
      default: () => 0,
    },
    height: {
      default: "200px",
      type: String,
      require: false,
    },
    type: {
      default: "edit",
      require: false,
    },
    quillRef: {
      default: "quillRef",
      type: String,
    },
    toolbar:{
      default: "full",
      type: Array as PropType<any>,
    },
    uploadPathName:{      //  编辑器上传文件至服务     服务器存储目录   
      default: "",
      type: String,
      require: true
    }
  },
  setup(props, { emit }) {
    const quillDom = ref(props.quillRef);
    const options = props.options;
    const fileName: Ref<string> = ref("quillfile");
    const temporaryRang: Ref<number> = ref(1);
    var loading:Ref<boolean> =ref(false)
    const handleType:Ref<string> = ref('图片')
    const handlers:any={
        'image': async function () {
          handleType.value = '图片'
          // quillDom.value.insertHtml(htm);
          var input = document.createElement('input');
          input.type = 'file';
          input.name = fileName.value;
          input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
          input.onchange = await onFileChange;
          input.click()
        },
        'video': async function () {
          handleType.value = '视频'
          const input = document.createElement('input');
          input.type = 'file';
          input.name = fileName.value;
          input.accept = 'video/*';
          input.onchange = await onVideoFileChange;
          input.click()
        }
    }
    async function onVideoFileChange(e:any){
      var fileInput = e.target;
        if (fileInput.files.length === 0) {
          return
        }
        loading.value=true
        console.log(e.target.files)
        const fd = new FormData()
        fd.append('file', fileInput.files[0])
        fd.append('upload_path', props.uploadPathName)
        fd.append('default_name', '0')
        await http.uploadsFile({param:fd}).then((res:IBusinessResp)=>{
          let html= `<iframe src="${res.data.url}"></iframe>`
          insertHtml(res.data.url, 'video');
          loading.value=false
        })
    }
    async function onFileChange(e:any){
      var fileInput = e.target;
        if (fileInput.files.length === 0) {
          return
        }
        loading.value=true
        const fd = new FormData()
        fd.append('file', fileInput.files[0])
        fd.append('upload_path', props.uploadPathName)
        fd.append('default_name', '0')
        await http.uploadsFile({param:fd}).then((res:IBusinessResp)=>{
          let html= `<img src="${res.data.url}" alt="">`
           insertHtml(res.data.url, 'image');
           loading.value=false
        })
    }
    const reactiveData: IreactiveData = reactive({ content: props.modelValue });
    const { content } = toRefs(reactiveData);
    const height = props.height;
    const toolbar=props.toolbar
    // console.log(quillDom);
    
    watch(
      () => content.value,
      () => {
        emit("update:modelValue", content.value);
      }
    );

    watch(
      () => props.modelValue,
      () => {
        // console.log(props.modelValue);
        
        content.value = props.modelValue;

      },{deep:true}
    );
    let html: any = "";
    let contentPre: any = isJsonString(content.value)
      ? JSON.parse(content.value as any)
      : "";
    if (contentPre.ops) {
      var converter = new QuillDeltaToHtmlConverter(contentPre.ops, {});
      html = converter.convert();
    } else {
      html = content.value;
    }

    function setContents(delta: Delta) {
      if (delta.ops) {
        (quillDom.value as any).setContents(delta);
      } else {
        (quillDom.value as any).setContents({ ops: [] });
      }
    }
    // console.log(props.rang);
    
    // 选择的发送变化时
    function  selectionChange(val:any) {
      // console.log( val.range && val.range.index);
      // (quillDom.value as any).getQuill().clipboard.dangerouslyPasteHTML(2,'<img src="https://gw.alicdn.com/tps/TB1W_X6OXXXXXcZXVXXXXXXXXXX-400-400.png">','api')
      val.range?emit("update:rang", val.range.index):'';
      val.range?temporaryRang.value=val.range.index:''
    }

    // 编辑器发送变化时
    function  editorChange(val:any) {
      if (val.name==="selection-change") {
        val.range?emit("update:rang", val.range.index):'';
        // console.log( val.range && val.range.index);
        val.range?temporaryRang.value=val.range.index:''
      }
    }

    // 插入html
    function  insertHtml(htmlString:string, type: string) {
      // console.log(quillDom.value);
      const rang=props.rang?props.rang:temporaryRang.value;
      // (quillDom.value as any).clipboard.dangerouslyPasteHTML(props.rang,htmlString,'api') 
      // console.log(rang);
      // (quillDom.value as any).getQuill().clipboard.dangerouslyPasteHTML(rang,htmlString,'user')
      (quillDom.value as any).getQuill().insertEmbed(rang, type, htmlString);
      emit("update:modelValue", (quillDom.value as any).getQuill().getContents());
    }
    return {
      options,
      ...toRefs(reactiveData),
      height,
      loading,
      toolbar,
      html,
      quillDom,
      setContents,
      selectionChange,
      editorChange,
      insertHtml,
      handlers,
      handleType,
    };
  },
});
</script>
<style lang="less" scoped>
.quill-editor-wrap {
  width: 100%;
  height: 100%;
}
.quill-editor{
  overflow: auto;
}
:deep(.ql-container){
  min-height: calc(100% - 43px);
}
</style>
