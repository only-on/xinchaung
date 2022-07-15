<template>
  <div class="wrapper" v-if="reportTemplateData?.template_type=='form'||reportTemplateData?.type=='form'">
    <onlinePreview :reportTemplateData="reportTemplateData"></onlinePreview>
  </div>
  <div class="pdfBox" v-else>
    <PdfVue :url="reportTemplateData.pdf_path" />
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { MessageApi } from "ant-design-vue/lib/message";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ITeacherTemplateHttp, Iform, WidgetModel } from "./templateTyping";
import PdfVue from "src/components/pdf/pdf.vue";
import onlinePreview from "src/components/report/onlinePreview.vue"
const http = (request as ITeacherTemplateHttp).teacherTemplate;
const $message: MessageApi = inject("$message")!;
const router = useRouter();
const route = useRoute();
interface Props {
  id?: number;
}
const props = withDefaults(defineProps<Props>(), {
  id: 0,
});
const templateId = ref<any>("");
onMounted(() => {
  templateId.value = props.id !== 0 ? props.id : 1;
  if (templateId.value) {
    getDetail();
  }
});
const reportTemplateData: any = reactive({})
const getDetail = (id?: number) => {
  http.viewTemplate({urlParams: {id: id||templateId.value}})
    .then((res: IBusinessResp) => {
      if (res && res.data) {
        let result = res.data;
        Object.assign(reportTemplateData, result)
      }
    });
};
watch(()=>{return props.id},(val:any)=>{
  console.log(val);
  
  templateId.value=val
  if (templateId.value) {
    getDetail();
  }
})
defineExpose({
  // getDetail
})
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
}
.contentT {
  flex: 1;
  overflow: auto;
  padding-right: 10px;
  max-height: 900px;
  .dnd-space {
    padding-left: 25px;
    // min-height: 800px;
  }
  table {
    width: 100%;
  }
}
.operate {
  text-align: center;
  margin-top: 25px;
}
.toolbar {
  flex-shrink: 0;
  width: 270px;
  border-radius: 8px;
  box-sizing: border-box;
  padding-right: 25px;
  overflow: auto;
  border-right: 1px solid #e4e4e4;
  &-title {
    font-size: 16px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 600;
    text-align: left;
    color: #050101;
    line-height: 24px;
    letter-spacing: 2px;
  }

  &-subject {
    margin-top: 30px;
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    color: #4a1c6e;
    line-height: 24px;
    letter-spacing: 1px;
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    margin-bottom: 10px;
  }

  &-widget {
    padding-bottom: 13px;
    display: flex;
    flex-direction: column;
  }
}

.actions {
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
  // align-items: center;
  position: absolute;
  left: 8px;
  top: 0;
  i {
    font-size: 14px;
    cursor: pointer;
    color: #777777;
    &:first-child:hover {
      color: var(--primary-color);
    }
    &:last-child:hover {
      color: red;
    }
    &.actions-drag {
      margin-right: 4px;
    }
  }
}
:deep(.toolCol) {
  width: 31px;
}
.pdfBox {
    height: 800px;
  }
</style>
