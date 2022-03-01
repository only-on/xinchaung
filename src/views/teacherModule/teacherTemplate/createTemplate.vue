<template>
  <div class="wrapper">
    <div class="toolbar" v-if="props.type !== 'view'">
      <div class="toolbar-title">报告模板组件</div>
      <div v-for="(item, index) in initialWidgetThumb" :key="index">
        <div class="toolbar-subject">{{ item.title }}</div>
        <drag-gable
          class="toolbar-widget"
          v-model="item.widget"
          :disabled="props.type === 'view'"
          :sort="false"
          group="table"
          @end="handleDragEnd"
          item-key="type"
        >
          <template #item="{ element }">
            <widget-thumb :type="element.type" />
          </template>
        </drag-gable>
      </div>
    </div>
    <div class="content">
      <div class="dnd-space">
        <a-form :model="form" :rules="rules" layout="vertical" ref="formRef">
          <a-form-item label="报告模板名称" name="name">
            <a-input
              v-model:value="form.name"
              :disabled="props.type === 'view'"
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
                  <template #toolbar v-if="props.type !== 'view'">
                    <div class="actions">
                      {{ element.id }}
                      <i class="actions-drag iconfont icon-yidong"></i>
                      <i
                        class="actions-delete iconfont icon-shanchu"
                        @click="handleDelete(index)"
                      ></i>
                    </div>
                  </template>
                </widget-create>
              </template>
            </drag-gable>
          </a-form-item>
        </a-form>
      </div>
      <!-- <div class="operate">
        <a-button @click="goBack">{{templateId ? '返回' : '取消'}}</a-button>
        <a-button v-show="!isCheck" type="primary" style="margin-left: 10px" @click="handleSave">保存</a-button>
      </div> -->
    </div>
  </div>
  <div class="operate">
    <a-button @click="goBack(1)">{{ templateId ? "返回" : "取消" }}</a-button>
    <a-button
      v-show="props.type !== 'view' && !props.detailView"
      type="primary"
      style="margin-left: 10px"
      @click="handleSave"
      >保存并设置为模板</a-button
    >
    <!-- 详情页查看报告模板 -->
    <!-- <a-button
      v-if="props.detailView"
      type="primary"
      style="margin-left: 10px"
      @click="replaceReport"
      >更换报告</a-button
    > -->
    <!-- 报告模板列表查看 -->
    <a-button
      v-if="props.type === 'view'"
      type="primary"
      style="margin-left: 10px"
      @click="editReport"
      >编辑</a-button
    >
    <a-button
      v-if="props.type === 'view'"
      type="primary"
      style="margin-left: 10px"
      @click="settingReport"
      >设置为报告模板</a-button
    >
  </div>
  <!-- 更换报告模板 -->
  <!-- <SelectReport
    v-if="reportVisible"
    :visible="reportVisible"
    @reportCancel="reportCancel"
  ></SelectReport> -->
</template>
<script lang="ts" setup>
import { defineComponent, inject, onMounted, reactive, ref } from "vue";
import { initialWidgetThumb, deepClone } from "./utils";
import widgetThumb from "./components/widgetThumb.vue";
import widgetCreate from "./components/widgetCreate.vue";
import { widgetDataModel } from "./components/DM";
import { useRoute, useRouter } from "vue-router";
import { MessageApi } from "ant-design-vue/lib/message";
import dragGable from "vuedraggable";
import request from "src/api/index";
import { IBusinessResp } from "src/typings/fetch.d";
import { ITeacherTemplateHttp, Iform, WidgetModel } from "./templateTyping";
// import SelectReport from "src/views/teacherModule/teacherExperimentResourcePool/component/selectReport.vue";
// export default defineComponent({
// components: {
//   widgetThumb,
//   widgetCreate,
//   dragGable,
// },
// props: {
//   type: {
//     type: String,
//     default: ""
//   },
//   id: {
//     type: Number,
//     default: 0
//   },
//   detailView: {
//     type: Boolean,
//     default: false
//   }
// },
// emits: ["cancelTemplate", "viewTemplate"],
// setup() {
const http = (request as ITeacherTemplateHttp).teacherTemplate;
const $message: MessageApi = inject("$message")!;
const router = useRouter();
const route = useRoute();
const formRef = ref<any>(null);
interface Props {
  type?: string;
  id?: number;
  detailView?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  type: "",
  id: 0,
  detailView: false,
});
const templateId = ref<any>("");
var isCheck = ref<boolean>(false);
var form = reactive<any>({
  name: "",
});
var rules = {
  name: [
    { required: true, message: "请输入模板标题" },
    { max: 20, message: "模板标题不能超过20个字符" },
    { whitespace: true, message: "不能只包含空格" },
  ],
};
var dataList = reactive<any[]>([
  {
    ...deepClone(widgetDataModel.w1),
    idx: 0,
  },
]);
onMounted(() => {
  templateId.value = props.id !== 0 ? props.id : "";
  if (props.type && props.type === "view") {
    isCheck.value = true;
  }
  if (templateId.value) {
    getDetail();
  }
});
const getDetail = () => {
  dataList.length = 0;
  http
    .viewTemplate({ param: { id: templateId.value } })
    .then((res: IBusinessResp) => {
      if (res && res.data) {
        let result = res.data;
        form.name = result.name;
        Object.assign(dataList, result.json_content);
        // 增加唯一标识， 否则拖拽排序时input的value值会被影响
        dataList.forEach((item: WidgetModel, index: number) => {
          item.idx = index;
        });
      }
    });
};
const handleDragEnd = (evt: any) => {
  const clone: HTMLElement = evt.clone.children[0];
  const type: any = clone.getAttribute("data-type");
  const widget: any = deepClone(widgetDataModel[type]);
  // 增加唯一标识
  dataList.push(Object.assign(widget, { idx: dataList.length }));
  return true;
};
const handleDelete = (index: number) => {
  if (dataList.length === 1) {
    $message.warn("最少保留一个实验报告组件");
    return;
  }
  console.log("index", index);
  dataList.splice(index, 1);
};
const handleSave = () => {
  formRef.value.validate().then(() => {
    let json_content: WidgetModel[] = dataList.map((item: any) => {
      delete item.idx;
      return item;
    });
    let params: Iform = {
      name: form.name.trim(),
      json_content: json_content,
      html_content: document.getElementsByClassName("tableDom")[0].outerHTML,
    };
    if (templateId.value) {
      params.id = templateId.value;
      http.updateTemplate({ param: params }).then((res: IBusinessResp) => {
        $message.success("报告模板修改成功！");
        goBack(2);
      });
    } else {
      http.createTemplate({ param: params }).then((res: IBusinessResp) => {
        $message.success("报告模板创建成功！");
        goBack(2);
      });
    }
  });
};
const emit = defineEmits<{
  (e: "cancelTemplate", val: number): void;
  (e: "viewTemplate", i: number, v: any): void;
}>();
const goBack = (val: number) => {
  emit("cancelTemplate", val);
  // if (templateId.value) {
  //   router.go(-1)
  // } else {
  //   router.push('/teacher/teacherTemplate')
  // }
};
// },
// })

// 更换报告
const reportVisible = ref<boolean>(false);
const replaceReport = () => {
  reportVisible.value = true;
};
const reportCancel = () => {
  reportVisible.value = false;
};
// 编辑
const editReport = () => {
  emit("viewTemplate", 0, { id: 1 });
  console.log("editReport");
};
// 设置为模板
const settingReport = () => {
  console.log("settingReport");
  emit("cancelTemplate", 0);
};
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
    min-height: 800px;
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
</style>
