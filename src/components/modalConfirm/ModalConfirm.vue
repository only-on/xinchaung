<template>
  <a-modal v-model:visible="visible" title="提示" @ok="handleOk">
    <p>{{ text }}</p>
    <p class="confirm-text-title" v-if="subText.length">{{ subText }}</p>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
interface IOptions {
  callbackOk: () => void, 
  text: string,
  subText: string
}
export default defineComponent({
  setup() {
    const visible = ref<boolean>(false)
    const options = reactive({
      text: '',
      subText: '执行后无法恢复，请谨慎操作',
      callbackOk: () => {},
    })

    const showModal = (option: IOptions) => {
      Object.assign(options, option)
      visible.value = true
    }

    const handleOk = (e: MouseEvent) => {
      console.log(e);
      options.callbackOk()
      visible.value = false
    }
    return {
      showModal,
      visible,
      ...toRefs(options),
      handleOk,
    }
  },
})
</script>

<style lang="less" scoped>
.ant-modal-body {
  p {
    margin-bottom: 0;
  }
  .confirm-text-title {
    color: #b9b9b9;
  }
}
</style>
