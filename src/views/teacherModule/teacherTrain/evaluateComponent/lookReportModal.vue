<template>
  <a-modal class="" 
    title="实训报告" 
    :footer="null" 
    :visible="isShowReport" 
    @cancel="close()"
    :width="1000"
  >
    <iframe :src="reportUrl" width="100%" height="700px"></iframe>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue'

export default defineComponent({
  props: {
    isShowReport: Boolean,
    reportUrl: String
  },
  emit: ['close'],
  setup(props, {emit}) {
    let visible = ref(false)
    watch(
      () => props.isShowReport,
      (newVal) => {
        visible.value = newVal
      },
      {deep: true}
    )

    const close = () => {
      emit('close')
    }

    return {
      visible,
      close,
    }
  },
})
</script>

<style lang="less" scoped>
.ant-modal-body {
  height: 750px;
}
</style>
