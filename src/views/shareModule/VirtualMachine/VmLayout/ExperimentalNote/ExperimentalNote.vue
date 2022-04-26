<template>
  <div class="experimental-note">
    <QuillEditor v-model="noteContent" height="700px" :uploadPathName="'ExperimentalNote'"></QuillEditor>
    <div class="experimental-action">
      <a-button type="primary" @click="submitNote">提交笔记</a-button>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref,onMounted } from "vue";
import QuillEditor from "src/components/editor/quill.vue";
import request from "src/request/getRequest"
import {useRoute} from "vue-router"
import { number } from "echarts";
import { message } from "ant-design-vue";

export default defineComponent({
  components: {    
    QuillEditor,
  },
  setup() {
    const noteApi=request.vmApi
    const route = useRoute();
    let vmQuery = route.query as any;
    const {
      taskId,
    }: any = vmQuery;
    const noteContent = ref({
      ops: [],
    });
    onMounted(()=>{
      getNoteContent()
    })

    // 获取笔记
    function getNoteContent() {
      noteApi.getNoteApi({param:{task_id:taskId}}).then((res:any)=>{
        console.log(res);
        if (res?.data) {
          noteContent.value=JSON.parse(res.data)
        }
        console.log(noteContent.value.ops);
      })
    }

    // 提交笔记
    function submitNote() {
      let obj={content:JSON.stringify(noteContent.value),taskId:taskId}

      noteApi.saveNoteApi({param:{...obj}}).then((res:any)=>{
        message.success("保存成功")
        
      }).catch(err=>{
        console.log(err);
        
      })
    }
    return {
      noteContent,
      submitNote
    };
  },
});
</script>


<style lang="less">
.experimental-note {
  white-space: break-spaces;
  padding: 15px;
  .experimental-action{
    text-align: center;
    margin-top: 20px;
  }
}
</style>
