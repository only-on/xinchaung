<template>
  <a-modal v-model:visible="visible" title="实验报告模板上传" :footer="null" @cancel="handleCancel">
     <a-upload-dragger
        name="file"
        :multiple="false"
        :show-upload-list='{showRemoveIcon: false}'
        accept=".doc,.docx"
        :action="actionUrl"
        :file-list="fileList"
        @change="onChange">
        <p class="ant-upload-drag-icon">
          <i class="iconfont iconchuangjian"></i>
        </p>
        <p class="ant-upload-text">点击这里选择实验报告模板</p>
        <p class="ant-upload-hint">支持单个doc或docx格式文件的上传</p>
      </a-upload-dragger>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent,ref,watch,reactive, inject } from 'vue'
import { MessageApi } from "ant-design-vue/lib/message";

export default defineComponent({
  props: ['dialogVisible'],
  setup(props,{emit}) {
    const $message: MessageApi = inject("$message")!;
    const dev_base_url=import.meta.env.VITE_APP_BASE_API || ''
    var actionUrl=`${dev_base_url}/report/template/upload`
    var visible = ref<boolean>(props.dialogVisible)
    var fileList = reactive<any>([])
    const handleCancel = () => {
      emit('close')
    }
    watch(()=> props.dialogVisible, newVal => {
      visible.value = newVal
      if (!newVal) {
        fileList.length = 0
      }
    })
    const onChange = (info:any) => {
      const status = info.file.status
      if (status === 'done') {
        if (info.fileList.length > 1) {
          info.fileList.splice(0, 1)
        }
        if (info.fileList && info.fileList.length > 0) {
          if (info.fileList[info.fileList.length - 1].response.status === 1) {
            $message.success(`${info.fileList[info.fileList.length - 1].name} 上传成功.`)
            emit('refresh')
            return
          } else {
            $message.error(
              `${info.fileList[info.fileList.length - 1].name} ${
                info.fileList[info.fileList.length - 1].response.msg
              }.`,
            )
          }
        }
      } else if (status === 'error') {
        $message.error(`${info.file.name} 上传失败.`)
      }
      Object.assign(fileList, info.fileList)
    }
    return {
      visible,
      handleCancel,
      fileList,
      onChange,
      actionUrl
    }
  },
})
</script>
<style lang="less" scoped>
.ant-upload-drag-icon{
  i{
    font-size: 34px;
    color: var(--primary-color);
  }
}
</style>
