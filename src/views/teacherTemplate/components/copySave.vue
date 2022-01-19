<template>
  <a-modal v-model:visible="visible" title="模板重命名" :footer="null" @cancel="handleCancel">
      <a-form :model="form">
        <a-form-item label="模板名称">
          <a-input v-model:value="form.name" :maxlength="20"/>
        </a-form-item>
        <a-form-item>
          <a-button  @click="handleCancel">取消</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="handleOk">确定并保存</a-button>
        </a-form-item>
      </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'

export default defineComponent({
  props: ['dialogVisible', 'name'],
  setup(props,{emit}) {
    var form = reactive<any>({
      name: props.name
    })
    var visible = ref<boolean>(props.dialogVisible)
    const handleOk = () => {
      emit('save', form)
    }
    const handleCancel = () => {
      emit('close')
    }
    watch(()=>props.dialogVisible, newVal => {
      visible.value = newVal
      if (!newVal) {
        form.name = props.name
      }
    })
    watch(()=>props.name, newVal => {
      form.name = props.name
    })
    return {
      form,
      visible,
      handleOk,
      handleCancel
    }
  },
})
</script>
<style lang="less" scoped>
.ant-form{
  margin-top: 20px;
  .ant-form-item{
    text-align: center;
  }
}
</style>
