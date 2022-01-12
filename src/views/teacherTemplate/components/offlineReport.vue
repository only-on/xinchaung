<template>
  <a-modal v-model:visible="visible" title="离线报告详情" :footer="null" :width="900" @cancel="handleCancel">
     <iframe v-if="showIframe" :src="pdfUrl" frameborder="0" width="100%" height="500px"></iframe>
     <div v-else class="loading">
       <img src="./pdfLoading.gif"/>
       <span>文档转换中，请稍后查看！</span>
     </div>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent,ref, watch } from 'vue'

export default defineComponent({
  props: ['dialogVisible', 'pdfUrl'],
  setup(props,{emit}) {
    var visible = ref<boolean>(props.dialogVisible)
    var pdfUrl = ref<string>(props.pdfUrl)
    var showIframe = ref<boolean>(false)
    watch(()=>props.dialogVisible, newVal => {
      visible.value = newVal
    })
    watch(()=>props.pdfUrl, newVal => {
      pdfUrl.value = newVal
      if (!pdfUrl.value) {
        showIframe.value = false
        return
      }
      fetch(pdfUrl.value,{
          method: 'get',
      }).then((res:any) => {     
          if (res.status === 200) {
            showIframe.value = true
          } else {
            showIframe.value = false
          }
      })
    })
    const handleCancel = () => {
      emit('close')
    }
    return {
      visible,
      pdfUrl,
      showIframe,
      handleCancel
    }
  },
})
</script>
<style lang="less" scoped>
.loading{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
  color: var(--purpleblue-6);
  span{
    display: block;
    margin-top: 30px;
  }
}
</style>
