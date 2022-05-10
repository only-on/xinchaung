<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns" v-if="currentTab === '0'&&type!=='recommend'">
      <span class="tips">仅支持ipynb文件</span>
      <a-upload
        name="file"
        :show-upload-list="false"
        accept=".ipynb"
        :multiple="false"
        :before-upload="beforeUpload"
      >
        <a-button type="primary">重新上传</a-button>
      </a-upload>
    </div>
  </div>
  <div class="experiment-content">
    <iframe :src="props.detail.guide" frameborder="0" style="width:100%;height:100%"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, reactive, PropType } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import Submit from "src/components/submit/index.vue";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { readFile } from "src/utils/getFileType";
import { useRouter, useRoute } from "vue-router";
const router = useRouter()
const route = useRoute();
const { currentTab, type }  = route.query
const $message: MessageApi = inject("$message")!;
const http = request.teacherExperimentResourcePool;
interface Ifiles {
  id: number
  file_name: string
  file_url: string
}
interface IDetail {
  id: number
  content_task_files: any[],
  guide: ''
}
interface Props {
  detail: IDetail
}
const props: Props = defineProps({
  detail: {
    type: Object as PropType<IDetail>,
    require: true,
    default: {
      id: 0,
      content_task_files: [],
      guide: ''
    }
  }
})

const beforeUpload = async (file: any, fileList: any) => {
  // console.log(props.detail.content_task_files[0])
  // const text = await readFile(file, 'ipynb');
  const suffix = (file && file.name).split(".")[1];
  if (suffix !== 'ipynb') {
    $message.warn(`请上传 .ipynb格式文件`)
    return false;
  }
  let fd = new FormData()
  fd.append('jupyter_file', file)
  http.uploadJuptyFile({param: fd}).then((res: any) => {
    const { data } = res
    // console.log(data)
    const param = {
      "guidebooks": [
        {
          file_name: data.file_name,
          file_url: data.file_path,
          size: data.size,
          sort: 0,
          suffix: data.suffix,
          type: 1 // 实验指导文件类型
        }
     ]
    }
    const content_id = props.detail.content_task_files.length ? props.detail.content_task_files[0].content_id : ''
    http.updateJupyterGuide({urlParams: {content_id}, param})
    .then((res: any) => {
      router.go(-1)
      props.detail.content_task_files[0] = Object.assign(props.detail.content_task_files[0], data, {file_url: data.url})
    })
  })
  return false
};

</script>

<style lang="less" scoped>
.title {
  line-height: 34px;
  padding: 10px 0 5px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  h3 {
    margin-left: 12px;
  }
  .ant-btn {
    margin-left: 8px;
  }
  .operate-btns {
    .tips {
      font-size: var(--font-size-sm);
      color: var(--black-25);
    }
  }
}
.experiment-content {
  height: 592px;
  margin-top: 16px;
  .demo__container :deep(.ant-btn) {
    padding: 0 !important;
  }
  :deep(.mark__body) {
    .mark__editor,
    .mark__preview {
      height: 455px;
    }
  }
  .submit {
    margin-top: 32px;
  }
}
</style>
