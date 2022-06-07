<template>
  <div class="pdfBox" v-if="pdfUrl">
    <PdfVue :url="pdfUrl" />
  </div>
  <div class="wrapper" v-else>
    <div class="content">
      <div class="dnd-space">
        <a-form :model="form" layout="vertical" ref="formRef">
          <a-form-item label="报告模板名称" name="name">
            <a-input
              v-model:value="form.name"
              :disabled="true"
              placeholder="请输入报告模板名称"
            />
          </a-form-item>
          <a-form-item>
            <drag-gable
              :list="dataList"
              class="tableDom"
              :sort="true"
              tag="table"
              ignore="a, img, input, textarea"
              item-key="idx"
            >
              <template #item="{ element, index }">
                <widget-create
                  :type="element.type"
                  v-model:fields="element.fields"
                >
                </widget-create>
              </template>
            </drag-gable>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  defineComponent,
  inject,
  onMounted,
  reactive,
  ref,
  computed,
} from "vue";
import { initialWidgetThumb, deepClone } from "./utils";
import widgetThumb from "./components/widgetThumb.vue";
import widgetCreate from "./components/widgetCreate.vue";
import { widgetDataModel } from "./DM";
import { useRoute, useRouter } from "vue-router";
import { MessageApi } from "ant-design-vue/lib/message";
import dragGable from "vuedraggable";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ITeacherTemplateHttp, Iform, WidgetModel } from "./templateTyping";
import PdfVue from "src/components/pdf/pdf.vue";
const http = (request as ITeacherTemplateHttp).teacherTemplate;
const $message: MessageApi = inject("$message")!;
const router = useRouter();
const route = useRoute();
const formRef = ref<any>(null);
interface Props {
  id?: number;
}
const props = withDefaults(defineProps<Props>(), {
  id: 0,
});
const templateId = ref<any>("");
var form = reactive<any>({
  name: "",
});
var dataList = reactive<any[]>([
  {
    ...deepClone(widgetDataModel.w1),
    idx: 0,
  },
]);
onMounted(() => {
  templateId.value = props.id !== 0 ? props.id : "";
  if (templateId.value) {
    getDetail();
  }
});
const pdfUrl = ref('')
const getDetail = (id?: number) => {
  dataList.length = 0;  // {urlParams: {id: templateId.value}}
  http.viewTemplate({urlParams: {id: id||templateId.value}})
    .then((res: IBusinessResp) => {
      if (res && res.data) {
        let result = res.data;
        form.name = result.name;
        pdfUrl.value = result.pdf_path
        Object.assign(dataList, result.json_content);
        // 增加唯一标识， 否则拖拽排序时input的value值会被影响
        dataList.forEach((item: WidgetModel, index: number) => {
          item.idx = index;
        });
      }
    });
};
defineExpose({
  getDetail
})
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
}
.content {
  flex: 1;
  overflow: auto;
  padding-right: 10px;
  max-height: 806px;
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
