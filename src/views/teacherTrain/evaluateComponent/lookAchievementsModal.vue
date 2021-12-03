<template>
  <a-modal class="modal" 
    title="实训成果" 
    :footer="null" 
    :visible="visible" 
    @cancel="close()"
    :width="1000"
  >
    <!-- <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="(v, k) in lookAchievementsInfo" :key="k" :tab="v.name">
        <div v-if="v.note">
          <antdv-markdown v-model="v.note" :preview-only="true" class="markdown__editor"/>
        </div>
        <div v-else>该任务未提交笔记</div>
      </a-tab-pane>
    </a-tabs> -->
    <div v-for="(v, k) in achievementsInfo" :key="k.toString()">
      <xe-quill
      :toolbar="'none'"
      v-model:value="v.note"
      height="300px"
      :readOnly="true"
      ref="quilldom"
    />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch,computed ,Ref} from 'vue'
import AntdvMarkdown from "@xianfe/antdv-markdown/src/index.vue";
// import  XeQuill  from 'src/components/dev/Quill.vue';
import XeQuill from "@xianfe/vue3-quill/src/index.vue";
import {goHtml} from 'src/utils/common'

export default defineComponent({
  components: {
    AntdvMarkdown,
    XeQuill,
  },
  props: {
    isShowAchievements: Boolean,
    lookAchievementsInfo: {
      type:Array,
      default:[]
    }
  },
  emit: ['close'],
  setup(props, {emit}) {

    let activeKey = ref('')

    let visible = ref(false)
    let achievementsInfo:Ref<any>=ref([])
    let note=ref()
    let note1=ref()
     let content: Ref<any> = ref({
      ops: [
        { insert: "Delta", attributes: { bold: true } },
        { insert: "是一种富有表现力的数据格式，它是" },
        { insert: "JSON", attributes: { color: "#8955b5", bold: true } },
        {
          insert:
            "的严格子集，Quill用它来描述Quill的文档及其文档的变化，它的链接在这里：",
        },
        {
          insert: "https://quilljs.com/docs/delta",
          attributes: { link: "https://quilljs.com/docs/delta" },
        },
      ],
    });
    watch(
      () => props.isShowAchievements,
      (newVal) => {
        visible.value = newVal
        if (newVal) {
          console.log(props.lookAchievementsInfo)
          activeKey.value = Object.keys(props.lookAchievementsInfo)[0]
        }
      },
      {deep: true}
    )
    const close = () => {
      emit('close')
      // activeKey.value = ''
    }
    const quillItem=(val:any)=>{
        return JSON.parse(val)
    }
    watch(
      ()=>props.lookAchievementsInfo,
      () => {
        achievementsInfo.value=[]
        if(props.lookAchievementsInfo?.length){
            props.lookAchievementsInfo.forEach((item:any)=>{
              achievementsInfo.value.push({
                created_at:item.created_at,
                deleted_at:item.deleted_at,
                id:item.id,
                note:JSON.parse(item.note),
                train_content_id:item.train_content_id,
                train_student_content_id:item.train_student_content_id,
                train_student_id:item.train_student_id,
                updated_at:item.updated_at
                })
            })
        }
      },
      { deep: true,immediate: true}
    );
    return {
      visible,
      close,
      activeKey,
      note,
      achievementsInfo,
      quillItem
    }
  },
})
</script>

<style lang="less" scoped>
:deep(.ant-modal-body) {
  height: 750px;
}
.modal{height:750px}
.markdown__editor{
  height: 100px;
}
:deep(.ql-toolbar.ql-snow){
  display: none;
}
:deep(.ql-editor:nth-child(1)){
  border-top: 1px solid #ccc;
}
</style>
