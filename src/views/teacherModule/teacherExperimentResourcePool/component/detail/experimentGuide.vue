<template>
  <div class="title">
    <h3>实验指导</h3>
    <div class="operate-btns" v-if="currentTab === '0'&&type!=='recommend'">
      <a-button type="primary" @click="preview = false" v-if="preview"
        >编辑</a-button
      >
      <span v-if="!preview">
        <span class="tips">支持单个md格式文件上传</span>
        <a-upload
          name="file"
          :show-upload-list="false"
          accept=".md"
          :multiple="false"
          :before-upload="beforeUpload"
        >
          <a-button type="primary">上传文档</a-button>
        </a-upload>
      </span>
    </div>
  </div>
  <div class="experiment-content">
    <iframe v-if="props.detail.content_task_files?.length" :src="props.detail.content_task_files[0].file_html" frameborder="0" style="width:100%;height:100%"></iframe>
    <marked-editor v-else v-model="props.detail.guide" :preview="preview" />
    <Submit @submit="onSubmit" @cancel="cancel" v-if="!preview && role!==2"></Submit>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, PropType } from "vue";
import { MessageApi } from "ant-design-vue/lib/message";
import markedEditor from "src/components/editor/markedEditor.vue";
import Submit from "src/components/submit/index.vue";
import { readFile } from "src/utils/common";
import { useRouter, useRoute } from "vue-router";
import { IBusinessResp } from "src/typings/fetch";
import request from "src/api/index";
import extStorage from "src/utils/extStorage";
const { lStorage } = extStorage;
const role = Number(lStorage.get("role"));
const router = useRouter();
const route = useRoute();
const { currentTab, type }  = route.query
const http = (request as any).teacherExperimentResourcePool;
const $message: MessageApi = inject("$message")!;
const preview = ref<boolean>(true);
const props: Props = defineProps({
  detail: {
    type: Object as PropType<IDetail>,
    require: true,
    default: {
      guide: '',
      content_task_files: []
    }
  }
})
const emit = defineEmits<{
  (e: "getExperimentDetail"): void;
}>();
let experimentContent = ref<any>(props.detail.guide || '');
interface IDetail {
  id: number
  guide: string
  content_task_files: any
}
interface Props {
  detail: IDetail
}
// 上传文件
const beforeUpload = async (file: any, fileList: any) => {
  const text: any = await readFile(file) || '';
  props.detail.guide = text;
};
const onSubmit = () => {
  http.updateVncGuide({
    urlParams: {content_id: props.detail.id},
    param: {
      guide: props.detail.guide
    }
  }).then((res: IBusinessResp) => {
    // router.go(-1)
    $message.success("更新成功")
    emit('getExperimentDetail');
    preview.value = true
  })
};
const cancel = () => {
  router.go(-1)
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
  margin-top: 16px;
  height: 700px;
  .demo__container :deep(.ant-btn) {
    padding: 0 !important;
  }
  :deep(.mark__body) {
    .mark__editor,
    .mark__preview {
      min-height: 455px;
    }
  }
  .submit {
    margin-top: 32px;
  }
}
</style>
